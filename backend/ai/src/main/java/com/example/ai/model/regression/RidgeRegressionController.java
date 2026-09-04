package com.example.ai.model.regression;

import com.example.ai.training.TrainingRequest;
import com.example.ai.training.TrainingResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/regression/ridge")
public class RidgeRegressionController {

    private final RidgeRegressionService ridgeRegressionService;

    public RidgeRegressionController(RidgeRegressionService ridgeRegressionService) {
        this.ridgeRegressionService = ridgeRegressionService;
    }

    @GetMapping("/datasets")
    public List<Map<String, String>> getDatasets() {
        return ridgeRegressionService.getDatasetSummaries();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ridgeRegressionService.uploadCsv(file));
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ridgeRegressionService.analyzeCsv(file));
    }

    @PostMapping("/train")
    public TrainingResponse train(@RequestBody TrainingRequest request) {
        return ridgeRegressionService.train(request);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadModel(@RequestParam String fileName) {
        return ridgeRegressionService.downloadModel(fileName);
    }
}
