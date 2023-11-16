locals {
  backend_url_prod = "https://api.bakseter.net"
  backend_url_dev  = "http://api.bakseter.net:8081"
}

# Next.js

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

resource "vercel_project_environment_variable" "next_backend_url_prod" {
  project_id = vercel_project.next_project.id
  key        = "NEXT_PUBLIC_BACKEND_URL"
  value      = local.backend_url_prod
  target     = ["production"]
}

resource "vercel_project_environment_variable" "next_backend_url_dev" {
  project_id = vercel_project.next_project.id
  key        = "NEXT_PUBLIC_BACKEND_URL"
  value      = local.backend_url_dev
  target     = ["preview", "development"]
}

resource "vercel_project_environment_variable" "next_auth_secret" {
  project_id = vercel_project.next_project.id
  key        = "NEXTAUTH_SECRET"
  value      = var.auth_secret
  target     = ["production", "preview", "development"]
}

# SvelteKit

resource "vercel_project" "svelte_project" {
  name                       = "531-svelte"
  framework                  = "sveltekit"
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

resource "vercel_project_environment_variable" "svelte_backend_url_prod" {
  project_id = vercel_project.svelte_project.id
  key        = "PUBLIC_BACKEND_URL"
  value      = local.backend_url_prod
  target     = ["production"]
}

resource "vercel_project_environment_variable" "svelte_backend_url_dev" {
  project_id = vercel_project.svelte_project.id
  key         = "PUBLIC_BACKEND_URL"
  value       = local.backend_url_dev
  target      = ["preview", "development"]
}

resource "vercel_project_environment_variable" "svelte_auth_secret" {
  project_id = vercel_project.svelte_project.id
  key        = "AUTH_SECRET"
  value      = var.auth_secret
  target     = ["production", "preview", "development"]
}

# Shared

resource "vercel_shared_environment_variable" "google_client_id" {
  project_ids = [vercel_project.next_project.id, vercel_project.svelte_project.id]
  key         = "GOOGLE_CLIENT_ID"
  value       = var.google_client_id
  target      = ["production", "preview", "development"]
}

resource "vercel_shared_environment_variable" "google_client_secret" {
  project_ids = [vercel_project.next_project.id, vercel_project.svelte_project.id]
  key         = "GOOGLE_CLIENT_SECRET"
  value       = var.google_client_secret
  target      = ["production", "preview", "development"]
}
