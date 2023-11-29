terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.32.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "1.0.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_token
}

provider "digitalocean" {
  token = var.do_token
}
