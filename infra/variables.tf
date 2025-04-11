variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "project_number" {
  type        = string
  description = "GCP project number"
}

variable "region" {
  type        = string
  default     = "europe-west1"
}

variable "service_name" {
  type        = string
  default     = "finance-api"
}
