package com.example.ai.model;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ModelController {

    @GetMapping("/models")
    public Map<String, Object> getModels() {
        return Map.of(
                "main", List.of(
                        Map.of("label", "Supervised Learning", "enabled", true, "route", "supervised"),
                        Map.of("label", "Unsupervised Learning", "enabled", false, "route", "home"),
                        Map.of("label", "Semi-Supervised Learning", "enabled", false, "route", "home"),
                        Map.of("label", "Reinforcement Learning", "enabled", false, "route", "home")
                ),
                "supervised", List.of(
                        Map.of("label", "Regression", "enabled", true, "route", "regression"),
                        Map.of("label", "Classification", "enabled", false, "route", "home")
                ),
                "regression", List.of(
                        Map.of("label", "Linear Regression", "enabled", true, "route", "linear-regression"),
                        Map.of("label", "Multiple Linear Regression", "enabled", true, "route", "multiple-linear-regression"),
                        Map.of("label", "Polynomial Regression", "enabled", false, "route", "home")
                )
        );
    }
}
