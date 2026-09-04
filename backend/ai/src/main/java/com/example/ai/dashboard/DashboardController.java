package com.example.ai.dashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of(
                "title", "ModelMind",
                "tagline", "From data to decisions.",
                "cards", List.of(
                        Map.of("id", "ml", "title", "ML", "subtitle", "Machine Learning", "accent", "cyan", "route", "ml"),
                        Map.of("id", "dl", "title", "DL", "subtitle", "Deep Learning", "accent", "violet", "route", "dl"),
                        Map.of("id", "ai", "title", "AI", "subtitle", "Generative AI", "accent", "amber", "route", "home")
                ),
                "rag", Map.of("title", "RAG", "subtitle", "Retrieval Augmented Generation", "route", "home")
        );
    }
}
