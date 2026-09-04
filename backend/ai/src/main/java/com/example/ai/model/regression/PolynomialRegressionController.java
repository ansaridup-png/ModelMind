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
@RequestMapping("/api/model/polynomial/regression")
public class PolynomialRegressionController {

    private final PolynomialRegressionService polynomialRegressionService;

    public PolynomialRegressionController(PolynomialRegressionService polynomialRegressionService) {
        this.polynomialRegressionService = polynomialRegressionService;
    }

    @GetMapping("/datasets")
    public List<Map<String, String>> getDatasets() {
        return polynomialRegressionService.getDatasetSummaries();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(polynomialRegressionService.uploadCsv(file));
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(polynomialRegressionService.analyzeCsv(file));
    }

    @PostMapping("/train")
    public TrainingResponse train(@RequestBody TrainingRequest request) {
        return polynomialRegressionService.train(request);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadModel(@RequestParam String fileName) {
        return polynomialRegressionService.downloadModel(fileName);
    }
}
