locals {
  cluster_name = "531cluster"
  backend_name = "five31-backend"
}

resource "azurerm_kubernetes_cluster" "k8s" {
  name                = local.cluster_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku_tier            = "Free"
  dns_prefix          = local.cluster_name

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

resource "kubernetes_namespace" "five31" {
  metadata {
    name = "531"
  }
}

resource "kubernetes_secret" "five31-backend-db-password" {
  metadata {
    name      = "five31-backend-db-password"
    namespace = kubernetes_namespace.five31.metadata.0.name
  }

  data = {
    db-password = var.db_password
  }
}

resource "kubernetes_deployment" "five31-backend" {
  metadata {
    name      = "${local.backend_name}-deployment"
    namespace = kubernetes_namespace.five31.metadata.0.name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = local.backend_name
      }
    }

    template {
      metadata {
        labels = {
          app = local.backend_name
        }
      }

      spec {
        container {
          image = "ghcr.io/bakseter/531/backend:latest"
          name  = "${local.backend_name}-container"

          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/status"
              port = 8080
            }

            initial_delay_seconds = 3
            period_seconds        = 3
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
            name  = "DATABASE_PASSWORD"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.five31-backend-db-password.metadata.0.name
                key  = "db-password"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "five31-backend" {
  metadata {
    name      = "${local.backend_name}-lb"
    namespace = kubernetes_namespace.five31.metadata.0.name
  }

  spec {
    port {
      port        = 8080
      target_port = 8080
    }

    type = "LoadBalancer"
  }
}
