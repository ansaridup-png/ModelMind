package com.example.ai.model;

public class Model {
    private String id;
    private String name;
    private String type;
    private String artifactPath;

    public Model() {}

    public Model(String id, String name, String type, String artifactPath) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.artifactPath = artifactPath;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getArtifactPath() {
        return artifactPath;
    }

    public void setArtifactPath(String artifactPath) {
        this.artifactPath = artifactPath;
    }
}
