package com.example.ai.training;

import java.util.List;

public record TrainingRequest(
        String modelName,
        String datasetName,
        String target,
        List<String> features,
        Integer degree,
        double alpha,
        Integer noOfTrees,
        Integer maxDepth,
        double learningRate,
        Double epsilon,
        String kernel,
        Integer noOfNeighbors,
        String weights
) {
}


