package com.example.ai.training;

import com.example.ai.python.PythonMlClient;
import org.springframework.stereotype.Service;

@Service
public class TrainingService {

    private final PythonMlClient pythonMlClient;

    public TrainingService(PythonMlClient pythonMlClient) {
        this.pythonMlClient = pythonMlClient;
    }

    public TrainingResponse trainLinearRegression(TrainingRequest request) {
        return pythonMlClient.callTrainLinearRegression(request);
    }
}
