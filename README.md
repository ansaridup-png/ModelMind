# AI Model Platform

This project is a small but extensible AI/ML platform starter with:

- React frontend for the dashboard and workflow UI
- Spring Boot backend for REST APIs and orchestration
- Python ML engine for model training, preprocessing, evaluation, and serialization
- Docker Compose for local orchestration

## Quick start

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend/ai
./mvnw spring-boot:run
```

### ML engine

```bash
cd ml-engine
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

### Docker

```bash
docker compose up --build
```

## Current first release scope

- Dashboard with ML, DL, AI, and RAG cards
- ML -> Supervised -> Regression -> Linear Regression workflow
- Structured data path with CSV upload
- Feature/target selection and model training simulation
- Training result card with metrics and artifact download concept

This is intentionally designed as a minimal MVP while keeping the architecture ready for future ML, DL, AI, and RAG growth.
