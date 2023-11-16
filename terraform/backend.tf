resource "digitalocean_ssh_key" "ssh" {
  name       = var.ssh_key_name
  public_key = file(var.ssh_key_path)
}

// This should be used for specifying digitalocean_droplet.drop.image
// data "digitalocean_image" "img" {
//  slug = "docker-20-04"
// }

resource "digitalocean_droplet" "drop" {
  image    = "122088422"
  name     = "backend-1"
  region   = "ams3"
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.ssh.fingerprint]
  backups  = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "digitalocean_project" "project" {
  name        = "531"
  environment = "Production"
  description = "5/3/1 workout plan"
  purpose     = "Web backend"
  resources = [
    digitalocean_droplet.drop.urn,
    "do:domain:bakseter.net"
  ]
  is_default = true
}
