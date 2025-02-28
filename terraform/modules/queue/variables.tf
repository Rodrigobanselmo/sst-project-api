variable "queues" {
  type = list(object({
    name = string
    fifo = bool
    max_receive_count = number
    dlq = bool
  }))
  description = "The names of the SQS queues to create"
}

variable "app_env" {
  type    = string
  description = "value of the environment"
}
