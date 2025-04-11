# Referencias a secretos existentes (debes crearlos tú a mano en GCP)
data "google_secret_manager_secret" "database_url" {
  secret_id = "FINANCE_API_DATABASE_URL"
}

data "google_secret_manager_secret" "database_type" {
  secret_id = "FINANCE_API_DATABASE_TYPE"
}

data "google_secret_manager_secret" "api_version" {
  secret_id = "FINANCE_API_API_VERSION"
}

# Validación: si falta alguno, Terraform lanza error
locals {
  missing_secrets = [
    data.google_secret_manager_secret.database_url.secret_id == "" ? "FINANCE_API_DATABASE_URL" : null,
    data.google_secret_manager_secret.database_type.secret_id == "" ? "FINANCE_API_DATABASE_TYPE" : null,
    data.google_secret_manager_secret.api_version.secret_id == "" ? "FINANCE_API_API_VERSION" : null
  ]
}

resource "null_resource" "ensure_secrets_exist" {
  count = length(compact(local.missing_secrets)) > 0 ? 1 : 0

  provisioner "local-exec" {
    command = "echo '❌ Missing secrets: ${join(", ", compact(local.missing_secrets))}' && exit 1"
  }
}
