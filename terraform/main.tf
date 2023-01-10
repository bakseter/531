terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.25.2"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_image" "img" {
  slug = "docker-20-04"
}

resource "digitalocean_ssh_key" "ssh" {
  name       = var.ssh_key_name
  public_key = file(var.ssh_key_path)
}

resource "digitalocean_droplet" "drop" {
  image    = data.digitalocean_image.img.id
  name     = "backend-1"
  region   = "ams3"
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.ssh.fingerprint]
}

resource "digitalocean_project" "project" {
  name        = "531"
  description = "5/3/1 workout plan"
  purpose     = "Web backend"
  resources   = [digitalocean_droplet.drop.urn]
  is_default  = true
}
