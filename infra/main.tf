# 1. Artifact Registry
resource "google_artifact_registry_repository" "docker_repo" {
  provider = google

  location      = var.region
  repository_id = "${var.service_name}-repo"
  format        = "DOCKER"
  description   = "Docker images for ${var.service_name}"
  cleanup_policies {
    action = "KEEP"
    id     = "last"

    most_recent_versions {
      keep_count = 5
    }
  }

}

# 2. Cloud Run service
resource "google_cloud_run_service" "default" {
  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image = "europe-west1-docker.pkg.dev/${var.project_id}/${var.service_name}-repo/${var.service_name}:latest"
        ports {
          container_port = 3000
        }
        env {
          name = "DATABASE_URL"

          value_from {
            secret_key_ref {
              name = "FINANCE_API_DATABASE_URL"
              key  = "latest"
            }
          }
        }

        env {
          name = "DATABASE_TYPE"

          value_from {
            secret_key_ref {
              name = "FINANCE_API_DATABASE_TYPE"
              key  = "latest"
            }
          }
        }

        env {
          name = "API_VERSION"

          value_from {
            secret_key_ref {
              name = "FINANCE_API_API_VERSION"
              key  = "latest"
            }
          }
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "2"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

}

# 3. IAM para permitir invocación pública
resource "google_cloud_run_service_iam_member" "invoker" {
  service  = google_cloud_run_service.default.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
