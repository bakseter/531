locals {
  location    = "norwayeast"
  db_user     = "postgres"
  db_name     = "postgres"
  backend_url = "https://${azurerm_container_group.cg.fqdn}"
}

# Backend

resource "azurerm_resource_group" "rg" {
  name     = "531-${var.environment}"
  location = local.location

  tags = {
    "environment" = var.environment
  }
}

## Caddy storage

resource "azurerm_storage_account" "cstore" {
  name                      = substr(replace(azurerm_resource_group.rg.name, "-", ""), 0, 20)
  resource_group_name       = azurerm_resource_group.rg.name
  location                  = local.location
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  enable_https_traffic_only = true

  tags = {
    "environment" = var.environment
  }
}

resource "azurerm_storage_share" "cshare" {
  name                 = substr(replace(azurerm_resource_group.rg.name, "-", ""), 0, 20)
  storage_account_name = azurerm_storage_account.cstore.name
  quota                = 1
}

## Containers

resource "azurerm_container_group" "cg" {
  name                = "${azurerm_resource_group.rg.name}-cg"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  os_type             = "Linux"
  dns_name_label      = azurerm_resource_group.rg.name

  container {
    name  = "${azurerm_resource_group.rg.name}-backend"
    image = var.backend_image

    cpu    = 0.5
    memory = 0.5

    environment_variables = {
      "MIGRATE_DB"        = "true"
      "DATABASE_URL"      = "jdbc:postgresql://${azurerm_postgresql_flexible_server.db.fqdn}:5432/${local.db_name}"
      "DATABASE_USERNAME" = local.db_user
    }

    secure_environment_variables = {
      "DATABASE_PASSWORD" = var.db_password
    }
  }

  container {
    name  = "${azurerm_resource_group.rg.name}-caddy"
    image = "caddy:2.7.6-alpine"

    cpu    = 0.5
    memory = 0.5

    ports {
      port     = 443
      protocol = "TCP"
    }

    ports {
      port     = 80
      protocol = "TCP"
    }

    volume {
      name                 = "caddy-data"
      mount_path           = "/data"
      storage_account_name = azurerm_storage_account.cstore.name
      storage_account_key  = azurerm_storage_account.cstore.primary_access_key
      share_name           = azurerm_storage_share.cshare.name
    }

    commands = ["caddy", "reverse-proxy", "--from", "${azurerm_resource_group.rg.name}.${local.location}.azurecontainer.io", "--to", "localhost:8080"]
  }

  exposed_port {
    port     = 443
    protocol = "TCP"
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

  tags = {
    "environment" = var.environment
  }

  lifecycle {
    ignore_changes = [
      zone
    ]

    prevent_destroy = true
  }
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "db_firewall" {
  name             = "${local.db_name}-firewall"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}


# Frontend

## Next.js

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

## SvelteKit

resource "vercel_project" "svelte_project" {
  name                       = "531-svelte"
  framework                  = "sveltekit-1"
  root_directory             = "frontend-svelte"
  serverless_function_region = "arn1"
  install_command            = "yarn --frozen-lockfile"

  git_repository = {
    type = "github"
    repo = "bakseter/531"
  }
}

resource "vercel_project_domain" "svelte_domain" {
  project_id = vercel_project.svelte_project.id
  domain     = "svelte.bakseter.net"
}

resource "vercel_project_environment_variable" "svelte_backend_url" {
  project_id = vercel_project.svelte_project.id
  key        = "PUBLIC_BACKEND_URL"
  value      = local.backend_url
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "svelte_api_version" {
  project_id = vercel_project.svelte_project.id
  key        = "PUBLIC_API_VERSION"
  value      = "v2"
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "svelte_auth_secret" {
  project_id = vercel_project.svelte_project.id
  key        = "AUTH_SECRET"
  value      = var.auth_secret
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "svelte_google_client_id" {
  project_id = vercel_project.svelte_project.id
  key        = "GOOGLE_CLIENT_ID"
  value      = var.google_client_id
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "svelte_google_client_secret" {
  project_id = vercel_project.svelte_project.id
  key        = "GOOGLE_CLIENT_SECRET"
  value      = var.google_client_secret
  target     = ["production", "preview", "development"]
}
