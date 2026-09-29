import dagshub
import mlflow

# Connexion automatique à DagsHub
dagshub.init(
    repo_owner='haouelyomna111',
    repo_name='signlive-asl-detection',
    mlflow=True
)

# Test : logger un run
with mlflow.start_run(run_name="test-connexion"):
    mlflow.log_param("test", "ok")
    mlflow.log_metric("accuracy", 0.95)
    print("✅ MLflow connecté à DagsHub !")