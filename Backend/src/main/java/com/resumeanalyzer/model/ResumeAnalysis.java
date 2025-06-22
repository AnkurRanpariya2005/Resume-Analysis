package com.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResumeAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String overallScore;
    private String summary;
    private LocalDateTime analyzedAt;


    public ResumeAnalysis(String fileName, String overallScore, String summary) {
        this.fileName = fileName;
        this.overallScore = overallScore;
        this.summary = summary;
        this.analyzedAt = LocalDateTime.now();
    }

    
} 