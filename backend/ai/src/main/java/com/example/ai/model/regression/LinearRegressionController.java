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
@RequestMapping("/api/regression")
public class LinearRegressionController {

    private final LinearRegressionService linearRegressionService;

    public LinearRegressionController(LinearRegressionService linearRegressionService) {
        this.linearRegressionService = linearRegressionService;
    }

    @GetMapping("/datasets")
    public List<Map<String, String>> getDatasets() {
        return linearRegressionService.getDatasetSummaries();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(linearRegressionService.uploadCsv(file));
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(linearRegressionService.analyzeCsv(file));
    }

    @PostMapping("/train")
    public TrainingResponse train(@RequestBody TrainingRequest request) {
        return linearRegressionService.train(request);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadModel(@RequestParam String fileName) {
        return linearRegressionService.downloadModel(fileName);
    }
}
