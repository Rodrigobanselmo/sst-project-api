resource "aws_sqs_queue" "queue" {
  count       = length(var.queues)
  name        = "${var.app_env}-${var.queues[count.index].name}${var.queues[count.index].fifo ? ".fifo" : ""}"
  fifo_queue  = var.queues[count.index].fifo
}

resource "aws_sqs_queue" "dlq" {
  count = length([for queue in var.queues : queue if queue.dlq])
  name  = "${var.app_env}-${var.queues[count.index].name}-DLQ${var.queues[count.index].fifo ? ".fifo" : ""}"
  fifo_queue  = var.queues[count.index].fifo
}

resource "aws_sqs_queue_redrive_policy" "queue" {
  count = length([for q in var.queues : q if q.dlq])

  queue_url = aws_sqs_queue.queue[count.index].id

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq[count.index].arn
    maxReceiveCount     = var.queues[count.index].max_receive_count
  })
}

resource "aws_sqs_queue_redrive_allow_policy" "redrive_allow_policy" {
  count = length([for q in var.queues : q if q.dlq])

  queue_url = aws_sqs_queue.dlq[count.index].id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.queue[count.index].arn]
  })
}
