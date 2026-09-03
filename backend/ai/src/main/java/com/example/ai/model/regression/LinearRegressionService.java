package com.example.ai.model.regression;

import com.example.ai.python.PythonMlClient;
import com.example.ai.training.TrainingRequest;
import com.example.ai.training.TrainingResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LinearRegressionService {

    private static final Path UPLOAD_DIR = Paths.get("D:/Ai Project/ml-engine/data/uploaded");

    private final PythonMlClient pythonMlClient;

    public LinearRegressionService(PythonMlClient pythonMlClient) {
        this.pythonMlClient = pythonMlClient;
    }

    public List<Map<String, String>> getDatasetSummaries() {
        try {
            Files.createDirectories(UPLOAD_DIR);
            List<Map<String, String>> datasets = new ArrayList<>();
            try (var stream = Files.list(UPLOAD_DIR)) {
                stream.filter(path -> path.getFileName().toString().endsWith(".csv"))
                        .forEach(path -> datasets.add(Map.of(
                                "name", path.getFileName().toString(),
                                "type", "csv"
                        )));
            }
            return datasets;
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read uploaded datasets", e);
        }
    }

    public Map<String, Object> uploadCsv(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is required");
        }

        Files.createDirectories(UPLOAD_DIR);
        Path target = UPLOAD_DIR.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return Map.of(
                "fileName", file.getOriginalFilename(),
                "path", target.toString(),
                "uploaded", true
        );
    }

    public Map<String, Object> analyzeCsv(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is required");
        }

        List<String> columns = parseCsvColumns(file);
        return Map.of(
                "fileName", file.getOriginalFilename(),
                "columns", columns,
                "columnCount", columns.size()
        );
    }

    public TrainingResponse train(TrainingRequest request) {
        return pythonMlClient.callTrainLinearRegression(request);
    }

    public ResponseEntity<Resource> downloadModel(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("Model file name is required");
        }

        Path modelPath = Paths.get("D:/Ai Project/ml-engine/models/trained").resolve(fileName).normalize();
        if (!modelPath.startsWith(Paths.get("D:/Ai Project/ml-engine/models/trained")) || !Files.exists(modelPath)) {
            throw new IllegalArgumentException("Model artifact not found: " + fileName);
        }

        Resource resource = new FileSystemResource(modelPath);
        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(modelPath.getFileName().toString())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private List<String> parseCsvColumns(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String header = reader.readLine();
            if (header == null || header.isBlank()) {
                return List.of();
            }

            List<String> columns = new ArrayList<>();
            for (String part : header.split(",")) {
                String cleaned = part.trim();
                if (!cleaned.isEmpty()) {
                    columns.add(cleaned);
                }
            }
            return columns;
        }
    }
}
