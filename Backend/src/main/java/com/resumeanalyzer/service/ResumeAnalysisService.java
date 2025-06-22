package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AnalysisResult;
import com.resumeanalyzer.model.ResumeAnalysis;
import com.resumeanalyzer.repository.ResumeAnalysisRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class ResumeAnalysisService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String UPLOAD_DIR = "uploads/resumes";
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public AnalysisResult analyzeResume(MultipartFile file) throws IOException {
        createUploadDirectory();
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        
        try {
            Files.copy(file.getInputStream(), filePath);
            String resumeText = extractTextFromPdf(filePath.toFile());
            AnalysisResult result = analyzeWithGemini(resumeText, fileName);
            
            ResumeAnalysis analysis = new ResumeAnalysis(
                file.getOriginalFilename(),
                result.getOverallScore(),
                result.getSummary()
            );
            resumeAnalysisRepository.save(analysis);
            
            return result;
        } finally {
            Files.deleteIfExists(filePath);
        }
    }

    private void createUploadDirectory() throws IOException {
        Path path = Paths.get(UPLOAD_DIR);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }

    private String extractTextFromPdf(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private AnalysisResult analyzeWithGemini(String resumeText, String fileName) {
        String prompt = String.format(
            "Analyze this resume and provide a detailed analysis in EXACTLY this format:\n" +
            "1. Overall Score: [score]/100\n" +
            "2. Summary: [2-3 sentence summary]\n" +
            "3. Pros:\n- [Strength 1]\n- [Strength 2]\n- [Strength 3]\n" +
            "4. Cons:\n- [Weakness 1]\n- [Weakness 2]\n- [Weakness 3]\n" +
            "5. Recommendations:\n- [Suggestion 1]\n- [Suggestion 2]\n- [Suggestion 3]\n\n" +
            "Resume Content:\n%s", 
            resumeText.substring(0, Math.min(resumeText.length(), 15000))
        );


        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> textPart = new HashMap<>();
        textPart.put("text", prompt);
        
        content.put("parts", Collections.singletonList(textPart));
        requestBody.put("contents", Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_API_URL,
                HttpMethod.POST,
                new HttpEntity<>(requestBody, headers),
                Map.class
            );

            return parseGeminiResponse(response.getBody(), fileName);
        } catch (Exception e) {
            log.error("Gemini API error: {}", e.getMessage());
            return getFallbackAnalysis(fileName);
        }
    }

    private AnalysisResult parseGeminiResponse(Map<String, Object> response, String fileName) {
        if (response == null || !response.containsKey("candidates")) {
            log.warn("Invalid Gemini response structure");
            return getFallbackAnalysis(fileName);
        }

        try {
            Map<String, Object> candidate = ((List<Map<String, Object>>) response.get("candidates")).get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            String analysisText = (String) ((Map<String, Object>) ((List<?>) content.get("parts")).get(0)).get("text");
            
            log.debug("Gemini raw analysis:\n{}", analysisText);
            return parseAnalysisText(analysisText, fileName);
        } catch (Exception e) {
            log.error("Response parsing failed: {}", e.getMessage());
            return getFallbackAnalysis(fileName);
        }
    }

    private AnalysisResult parseAnalysisText(String analysisText, String fileName) {
        
        String[] sections = analysisText.split("\\d+\\.\\s");
        
      
        if (sections.length < 6) {
            log.warn("Unexpected section count: {}", sections.length);
            return parseAnalysisTextFallback(analysisText, fileName);
        }
        
        String score = extractScore(sections[1]);
        String summary = extractSummary(sections[2]);
        List<String> pros = extractListItems(sections[3]);
        List<String> cons = extractListItems(sections[4]);
        List<String> recommendations = extractListItems(sections[5]);
        
        return new AnalysisResult(
            fileName,
            score,
            summary,
            pros,
            cons,
            recommendations,
            LocalDateTime.now()
        );
    }
    
    private String extractScore(String section) {
       
        Pattern pattern = Pattern.compile("(\\d+/100)");
        Matcher matcher = pattern.matcher(section);
        return matcher.find() ? matcher.group(1) : "N/A";
    }
    
    private String extractSummary(String section) {
        String summary = section.replaceFirst("Summary[:\\s]*", "");
        return summary.trim().replaceAll("\n", " ");
    }
    
    private List<String> extractListItems(String section) {
        List<String> items = new ArrayList<>();
        String[] lines = section.split("\n");
        
        for (String line : lines) {
            line = line.trim();
            
            if (line.isEmpty() || 
                line.startsWith("Pros:") || 
                line.startsWith("Cons:") || 
                line.startsWith("Recommendations:")) {
                continue;
            }
            
          
            if (line.startsWith("- ") || line.startsWith("* ")) {
                items.add(line.substring(2).trim());
            } 
        
            else if (!line.contains(":") && line.length() > 10) {
                items.add(line);
            }
        }
        return items;
    }
    
    private AnalysisResult parseAnalysisTextFallback(String analysisText, String fileName) {
        log.warn("Using fallback parser for analysis text");
      
        String score = "N/A";
        Pattern pattern = Pattern.compile("(\\d+/100)");
        Matcher matcher = pattern.matcher(analysisText);
        if (matcher.find()) {
            score = matcher.group(1);
        }
        
        String summary = "";
        String[] parts = analysisText.split("2\\.\\s*Summary[:\\s]*", 2);
        if (parts.length > 1) {
            summary = parts[1].split("3\\.\\s*Pros[:\\s]*")[0].trim();
        }
        
        return new AnalysisResult(
            fileName,
            score,
            summary,
            extractListItemsFallback(analysisText, "Pros"),
            extractListItemsFallback(analysisText, "Cons"),
            extractListItemsFallback(analysisText, "Recommendations"),
            LocalDateTime.now()
        );
    }
    
    private List<String> extractListItemsFallback(String text, String sectionName) {
        List<String> items = new ArrayList<>();
        Pattern pattern = Pattern.compile(
            Pattern.quote(sectionName) + "[\\s:]*\\n(-[^\\n]+)"
        );
        Matcher matcher = pattern.matcher(text);
        
        while (matcher.find()) {
            items.add(matcher.group(1).substring(1).trim());
        }
        return items.isEmpty() ? Collections.emptyList() : items;
    }

    private AnalysisResult getFallbackAnalysis(String fileName) {
        return new AnalysisResult(
            fileName,
            "75/100",
            "Generated fallback analysis due to service issues",
            Arrays.asList("Strong technical background", "Good education history"),
            Arrays.asList("Limited work experience", "Could use more quantifiable achievements"),
            Arrays.asList("Add more metrics to experience", "Include relevant certifications"),
            LocalDateTime.now()
        );
    }

    public List<ResumeAnalysis> getUserAnalyses() {
        return resumeAnalysisRepository.findAll();
    }
}