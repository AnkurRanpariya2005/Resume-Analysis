package com.resumeanalyzer.controller;

import com.resumeanalyzer.model.AnalysisResult;
import com.resumeanalyzer.model.ResumeAnalysis;
import com.resumeanalyzer.service.ResumeAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeAnalysisController {

    @Autowired
    private ResumeAnalysisService resumeAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            AnalysisResult result = resumeAnalysisService.analyzeResume(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/analyses")
    public ResponseEntity<List<ResumeAnalysis>> getUserAnalyses() {
        List<ResumeAnalysis> analyses = resumeAnalysisService.getUserAnalyses();
        return ResponseEntity.ok(analyses);
    }
} 