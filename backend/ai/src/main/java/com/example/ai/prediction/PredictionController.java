package com.example.ai.prediction;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PredictionController {

    @GetMapping("/prediction")
    public Map<String, String> prediction() {
        return Map.of("status", "ready", "model", "Linear Regression");
    }
}
