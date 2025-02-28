terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.32.0"
    }
  }

  backend "s3" {}
}

/*======
Create SQS Queues with Dead Letter Queues
========*/
module "queues" {
  source      = "../../modules/queue"
  queues = var.queues
}

/*======
Create a private RDS Postgres instance
========*/
module "database" {
  source  = "../../modules/database"
  db_name = "coala"

  network = {
    vpc_id = var.network.vpc_id
    subnets = {
      private = var.network.subnets.private
      public  = var.network.subnets.public
    }
  }
}

/*======
Create ECR Repository
========*/
module "ecr" {
  source   = "../../modules/ecr"
  app_name = var.app_name
}

/*======
Create ECS Cluster with App Service and RabbitMQ Service
========*/
module "ecs" {
  source              = "../../modules/ecs"
  app_name            = var.app_name
  ecr_repository      = module.ecr.repository
  domain_name         = "api.coalasaude.com.br"
  ssl_certificate_arn = var.ssl_certificate_arn

  secrets = var.ecs_secrets

  network = {
    vpc_id = var.network.vpc_id
    subnets = {
      private = var.network.subnets.private
      public  = var.network.subnets.public
    }
  }
}
