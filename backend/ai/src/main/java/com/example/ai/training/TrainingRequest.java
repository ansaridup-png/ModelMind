package com.example.ai.training;

import java.util.List;

public record TrainingRequest(
        String modelName,
        String datasetName,
        String target,
        List<String> features,
        Integer degree,
        Integer alpha,
        Integer noOfTrees
) {
}


