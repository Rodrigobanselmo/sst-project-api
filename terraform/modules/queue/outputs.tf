output "queue_urls" {
  value = { for k, v in aws_sqs_queue.queue : k => v.id }
}
