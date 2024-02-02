terraform {
  required_providers {
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

provider "azurerm" {
  features {}
}
