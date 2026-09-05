package com.example.ai.python;

import com.example.ai.training.TrainingRequest;
import com.example.ai.training.TrainingResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PythonMlClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public String callHealthCheck() {
        return restTemplate.getForObject("http://localhost:8000/health", String.class);
    }

    public TrainingResponse callTrainLinearRegression(TrainingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());
        payload.put("features", request.features() == null ? List.of() : request.features());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8000/api/train/linear-regression",
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Empty response from Python ML engine");
        }

        return new TrainingResponse(
                String.valueOf(body.getOrDefault("model", "Linear Regression")),
                String.valueOf(body.getOrDefault("dataset", request.datasetName())),
                toDouble(body.get("r2_score")),
                toDouble(body.get("mae")),
                toDouble(body.get("rmse")),
                toStringList(body.get("features")),
                String.valueOf(body.getOrDefault("target", request.target())),
                String.valueOf(body.getOrDefault("artifact_name", "linear-regression-model.joblib"))
        );
    }

    private double toDouble(Object value) {
        if (value == null) {
            return 0.0;
        }
        return Double.parseDouble(String.valueOf(value));
    }

        public TrainingResponse callTrainMultipleLinearRegression(
            TrainingRequest request
    ) {

        Map<String, Object> payload = new HashMap<>();

        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());

        payload.put(
                "features",
                request.features() == null
                        ? List.of()
                        : request.features()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        "http://localhost:8000/api/train/multiple-linear-regression",
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

        Map<String, Object> body = response.getBody();

        if (body == null) {
            throw new IllegalStateException(
                    "Empty response from Python ML engine"
            );
        }

        return new TrainingResponse(
                String.valueOf(
                        body.getOrDefault(
                                "model",
                                "Multiple Linear Regression"
                        )
                ),

                String.valueOf(
                        body.getOrDefault(
                                "dataset",
                                request.datasetName()
                        )
                ),

                toDouble(body.get("r2_score")),

                toDouble(body.get("mae")),

                toDouble(body.get("rmse")),

                toStringList(body.get("features")),

                String.valueOf(
                        body.getOrDefault(
                                "target",
                                request.target()
                        )
                ),

                String.valueOf(
                        body.getOrDefault(
                                "artifact_name",
                                "multiple-linear-regression-model.joblib"
                        )
                )
        );
    }

    public TrainingResponse callTrainRidgeRegression(TrainingRequest request) {

    Map<String, Object> payload = new HashMap<>();

    payload.put("model_name", request.modelName());
    payload.put("dataset_name", request.datasetName());
    payload.put("target", request.target());
    payload.put(
        "features",
        request.features() == null ? List.of() : request.features()
    );

    payload.put(
        "alpha",
        request.alpha() != 0.0 ? request.alpha() : 1.0
    );

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<Map<String, Object>> entity =
            new HttpEntity<>(payload, headers);

    ResponseEntity<Map> response = restTemplate.exchange(
            "http://localhost:8000/api/train/ridge-regression",
            HttpMethod.POST,
            entity,
            Map.class
    );

    Map<String, Object> body = response.getBody();

    if (body == null) {
        throw new IllegalStateException(
                "Empty response from Python ML engine"
        );
    }

    return new TrainingResponse(
            String.valueOf(
                    body.getOrDefault(
                            "model",
                            "Ridge Regression"
                    )
            ),

            String.valueOf(
                    body.getOrDefault(
                            "dataset",
                            request.datasetName()
                    )
            ),

            toDouble(body.get("r2_score")),
            toDouble(body.get("mae")),
            toDouble(body.get("rmse")),

            toStringList(body.get("features")),

            String.valueOf(
                    body.getOrDefault(
                            "target",
                            request.target()
                    )
            ),

            String.valueOf(
                    body.getOrDefault(
                            "artifact_name",
                            "ridge-regression-model.joblib"
                    )
            )
    );
}

        public TrainingResponse callTrainPolynomialRegression(
                TrainingRequest request) {

        Map<String, Object> payload = new HashMap<>();

        payload.put(
                "model_name",
                request.modelName()
        );

        payload.put(
                "dataset_name",
                request.datasetName()
        );

        payload.put(
                "target",
                request.target()
        );

        payload.put(
                "features",
                request.features() == null
                        ? List.of()
                        : request.features()
        );

        payload.put(
                "degree",
                request.degree() == null
                        ? 2
                        : request.degree()
        );

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        "http://localhost:8000/api/train/polynomial-regression",
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

        Map<String, Object> body =
                response.getBody();

        if (body == null) {
                throw new IllegalStateException(
                        "Empty response from Python ML engine"
                );
        }

        return new TrainingResponse(
                String.valueOf(
                        body.getOrDefault(
                                "model",
                                "Polynomial Regression"
                        )
                ),

                String.valueOf(
                        body.getOrDefault(
                                "dataset",
                                request.datasetName()
                        )
                ),

                toDouble(body.get("r2_score")),

                toDouble(body.get("mae")),

                toDouble(body.get("rmse")),

                toStringList(body.get("features")),

                String.valueOf(
                        body.getOrDefault(
                                "target",
                                request.target()
                        )
                ),

                String.valueOf(
                        body.getOrDefault(
                                "artifact_name",
                                "polynomial-regression-model.joblib"
                        )
                )
        );
        }

        public TrainingResponse callTrainDecisionTree(TrainingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());
        payload.put("features", request.features() == null ? List.of() : request.features());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8000/api/train/decision-tree",
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Empty response from Python ML engine");
        }

        return new TrainingResponse(
                String.valueOf(body.getOrDefault("model", "Decision Tree")),
                String.valueOf(body.getOrDefault("dataset", request.datasetName())),
                toDouble(body.get("r2_score")),
                toDouble(body.get("mae")),
                toDouble(body.get("rmse")),
                toStringList(body.get("features")),
                String.valueOf(body.getOrDefault("target", request.target())),
                String.valueOf(body.getOrDefault("artifact_name", "decision-tree-model.joblib"))
        );
    }

     public TrainingResponse callXgBoost(TrainingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());
        payload.put("features", request.features() == null ? List.of() : request.features());
        payload.put("n_estimators", request.noOfTrees() == null ? 100 : request.noOfTrees());
        payload.put("max_depth", request.maxDepth() == null ? 6 : request.maxDepth());
        payload.put("learning_rate", request.learningRate());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8000/api/train/xgboost",
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Empty response from Python ML engine");
        }

        return new TrainingResponse(
                String.valueOf(body.getOrDefault("model", "XgBoost")),
                String.valueOf(body.getOrDefault("dataset", request.datasetName())),
                toDouble(body.get("r2_score")),
                toDouble(body.get("mae")),
                toDouble(body.get("rmse")),
                toStringList(body.get("features")),
                String.valueOf(body.getOrDefault("target", request.target())),
                String.valueOf(body.getOrDefault("artifact_name", "xgboost-model.joblib"))
        );
    }

         public TrainingResponse callRandomForest(TrainingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());
        payload.put("features", request.features() == null ? List.of() : request.features());
        payload.put("n_estimators", request.noOfTrees() == null ? 100 : request.noOfTrees());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8000/api/train/random-forest",
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Empty response from Python ML engine");
        }

        return new TrainingResponse(
                String.valueOf(body.getOrDefault("model", "Random Forest")),
                String.valueOf(body.getOrDefault("dataset", request.datasetName())),
                toDouble(body.get("r2_score")),
                toDouble(body.get("mae")),
                toDouble(body.get("rmse")),
                toStringList(body.get("features")),
                String.valueOf(body.getOrDefault("target", request.target())),
                String.valueOf(body.getOrDefault("artifact_name", "random-forest-model.joblib"))
        );
    }

    public TrainingResponse callSvr(TrainingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());
        payload.put("features", request.features() == null ? List.of() : request.features());
        payload.put("epsilon", request.epsilon() == null ? 0.1 : request.epsilon());
        payload.put("kernel", request.kernel() == null || request.kernel().isBlank() ? "rbf" : request.kernel());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8000/api/train/svr",
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Empty response from Python ML engine");
        }

        return new TrainingResponse(
                String.valueOf(body.getOrDefault("model", "Support Vector Regression")),
                String.valueOf(body.getOrDefault("dataset", request.datasetName())),
                toDouble(body.get("r2_score")),
                toDouble(body.get("mae")),
                toDouble(body.get("rmse")),
                toStringList(body.get("features")),
                String.valueOf(body.getOrDefault("target", request.target())),
                String.valueOf(body.getOrDefault("artifact_name", "svr-model.joblib"))
        );
    }

    public TrainingResponse callKnn(TrainingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model_name", request.modelName());
        payload.put("dataset_name", request.datasetName());
        payload.put("target", request.target());
        payload.put("features", request.features() == null ? List.of() : request.features());
        payload.put("n_neighbors", request.noOfNeighbors() == null ? 5 : request.noOfNeighbors());
        payload.put("weights", request.weights() == null || request.weights().isBlank() ? "uniform" : request.weights());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8000/api/train/knn",
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Empty response from Python ML engine");
        }

        return new TrainingResponse(
                String.valueOf(body.getOrDefault("model", "KNN Regression")),
                String.valueOf(body.getOrDefault("dataset", request.datasetName())),
                toDouble(body.get("r2_score")),
                toDouble(body.get("mae")),
                toDouble(body.get("rmse")),
                toStringList(body.get("features")),
                String.valueOf(body.getOrDefault("target", request.target())),
                String.valueOf(body.getOrDefault("artifact_name", "knn-model.joblib"))
        );
    }

    private List<String> toStringList(Object value) {
        if (value instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
    }
}
