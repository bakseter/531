terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.34.1"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "1.0.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.89.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "531-tfstate"
    storage_account_name = "531tfstate12533"
    container_name       = "tfstate"
    key                  = "azure.terraform.tfstate"
  }
}

provider "vercel" {
  api_token = var.vercel_token
}

provider "digitalocean" {
  token = var.do_token
}

provider "azurerm" {
  features {}

  subscription_id = "5c316fca-0ca0-412a-a54e-39c1b6eb882b"
}

