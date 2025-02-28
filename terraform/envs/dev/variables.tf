variable "queues" {
  type = list(object({
    name = string
    fifo = bool
    max_receive_count = number
    dlq = bool
  }))
  default = [
    {
      name = "generate_documents"
      fifo  = true
      max_receive_count = 1
      dlq = true
    }
  ]
}

variable "app_env" {
  type    = string
  default = "production"
}

variable "app_name" {
  type    = string
  default = "backend"
}

variable "ecs_secrets" {
  type        = map(string)
  description = "ECS secrets variables"
}

variable "tls_certificate_arn" {
  type        = string
  description = "The TLS certificate ARN"
}
