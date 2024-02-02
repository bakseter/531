locals {
  location            = "norwayeast"
  db_user             = "postgres"
  db_name             = "postgres"
  backend_url         = "https://${azurerm_container_app.backend.ingress.0.fqdn}"
  backend_api_version = "v2"
}

resource "azurerm_resource_group" "rg" {
  name     = "531-${var.environment}"
  location = local.location

  tags = {
    "environment" = var.environment
  }
}

# Backend

resource "azurerm_container_app_environment" "backend_env" {
  name                = "env-${azurerm_resource_group.rg.name}"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name

  tags = {
    "environment" = var.environment
  }
}

resource "azurerm_container_app" "backend" {
  name                         = "app-${azurerm_resource_group.rg.name}"
  container_app_environment_id = azurerm_container_app_environment.backend_env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  = "ghcr.io/bakseter/531/backend:latest"
      cpu    = "0.25"
      memory = "0.5Gi"

      liveness_probe {
        transport = "HTTP"
        path      = "/status"
        port      = "8080"
      }

      readiness_probe {
        transport = "HTTP"
        path      = "/status"
        port      = "8080"
      }

      env {
        name  = "MIGRATE_DB"
        value = "true"
      }

      env {
        name  = "DATABASE_URL"
        value = "jdbc:postgresql://${azurerm_postgresql_flexible_server.db.fqdn}:5432/${local.db_name}"
      }

      env {
        name  = "DATABASE_USERNAME"
        value = local.db_user
      }

      env {
        name        = "DATABASE_PASSWORD"
        secret_name = "database-password"
      }
    }

    min_replicas    = 1
    max_replicas    = 1
    revision_suffix = substr(var.revision_suffix, 0, 10)
  }

  ingress {
    target_port      = "8080"
    external_enabled = true

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  secret {
    name  = "database-password"
    value = var.db_password
  }

  tags = {
    "environment" = var.environment
  }
}

# Database

resource "azurerm_postgresql_flexible_server" "db" {
  location            = local.location
  name                = "531-${local.db_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name

  administrator_login    = local.db_user
  administrator_password = var.db_password

  sku_name   = "B_Standard_B1ms"
  version    = "15"
  storage_mb = 32768

  backup_retention_days = 7

  zone = 1

  lifecycle {
    ignore_changes = [
      zone
    ]

    prevent_destroy = true
  }

  tags = {
    "environment" = var.environment
  }
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "db_firewall" {
  name             = "${local.db_name}-firewall"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}


# Frontend

resource "vercel_project" "next_project" {
  name                       = "531-frontend"
  framework                  = "nextjs"
  root_directory             = "frontend"
  serverless_function_region = "arn1"
  install_command            = "yarn --frozen-lockfile"

  git_repository = {
    type = "github"
    repo = "bakseter/531"
  }
}

resource "vercel_project_domain" "domain" {
  project_id = vercel_project.next_project.id
  domain     = "bakseter.net"
}

resource "vercel_project_environment_variable" "next_backend_url" {
  project_id = vercel_project.next_project.id
  key        = "NEXT_PUBLIC_BACKEND_URL"
  value      = local.backend_url
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "next_backend_api_version" {
  project_id = vercel_project.next_project.id
  key        = "NEXT_PUBLIC_BACKEND_API_VERSION"
  value      = local.backend_api_version
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "next_auth_secret" {
  project_id = vercel_project.next_project.id
  key        = "AUTH_SECRET"
  value      = var.auth_secret
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "next_google_id" {
  project_id = vercel_project.next_project.id
  key        = "AUTH_GOOGLE_ID"
  value      = var.google_client_id
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "next_google_secret" {
  project_id = vercel_project.next_project.id
  key        = "AUTH_GOOGLE_SECRET"
  value      = var.google_client_secret
  target     = ["production", "preview", "development"]
}
