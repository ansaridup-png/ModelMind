package com.example.ai.training;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @PostMapping("/train/linear-regression")
    public TrainingResponse trainLinearRegression(@RequestBody TrainingRequest request) {
        return trainingService.trainLinearRegression(request);
    }
}
