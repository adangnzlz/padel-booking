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


# 4. IAM para permitir despliegue de GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-deployer"
  display_name = "GitHub Actions Deployer"
  description  = "Service account for deploying finance-api from GitHub Actions"
}

# Permiso para desplegar en Cloud Run
resource "google_project_iam_member" "run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Permiso para escribir en Artifact Registry
resource "google_project_iam_member" "artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Permiso para actuar como service account
resource "google_project_iam_member" "service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Permiso para acceder a Secret Manager
resource "google_project_iam_member" "cloud_run_secret_access" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${var.project_number}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "access_database_type" {
  secret_id = data.google_secret_manager_secret.database_type.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.project_number}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "access_database_url" {
  secret_id = data.google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.project_number}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "access_api_version" {
  secret_id = data.google_secret_manager_secret.api_version.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.project_number}-compute@developer.gserviceaccount.com"
}
  