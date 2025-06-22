package com.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "resume_analyses")
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String overallScore;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @ElementCollection
    @CollectionTable(name = "analysis_pros", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "pro", columnDefinition = "TEXT")
    private List<String> pros;

    @ElementCollection
    @CollectionTable(name = "analysis_cons", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "con", columnDefinition = "TEXT")
    private List<String> cons;

    @ElementCollection
    @CollectionTable(name = "analysis_recommendations", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "recommendation", columnDefinition = "TEXT")
    private List<String> recommendations;

    @Column(nullable = false)
    private LocalDateTime analyzedAt;

    public AnalysisResult(String fileName, String overallScore, String summary, 
                         List<String> pros, List<String> cons, List<String> recommendations, 
                         LocalDateTime analyzedAt) {
        this.fileName = fileName;
        this.overallScore = overallScore;
        this.summary = summary;
        this.pros = pros;
        this.cons = cons;
        this.recommendations = recommendations;
        this.analyzedAt = analyzedAt;
    }
} 