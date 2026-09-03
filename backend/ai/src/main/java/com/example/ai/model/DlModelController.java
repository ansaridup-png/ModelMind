package com.example.ai.model;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DlModelController {

    @GetMapping("/dlmodels")
    public Map<String, Object> getModels() {
        return Map.of(
                "main", List.of(
                        Map.of("label", "Supervised Learning", "enabled", true, "route", "supervised"),
                        Map.of("label", "Unsupervised Learning", "enabled", false, "route", "home"),
                        Map.of("label", "Semi-Supervised Learning", "enabled", false, "route", "home"),
                        Map.of("label", "Reinforcement Learning", "enabled", false, "route", "home")
                )
        );
    }
}
