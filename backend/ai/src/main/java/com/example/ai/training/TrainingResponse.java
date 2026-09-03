package com.example.ai.training;

import java.util.List;

public record TrainingResponse(
        String model,
        String dataset,
        double r2Score,
        double mae,
        double rmse,
        List<String> features,
        String target,
        String artifactName
) {
}
