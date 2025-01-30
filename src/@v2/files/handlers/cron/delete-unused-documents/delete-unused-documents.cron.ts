import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { AuditLogConfig } from '@/decorators/audit-log-config.decorator'
import { DocumentTokens } from '@/@modules/documents/constants/tokens'
import { DeleteUnusedDocument } from '@/@modules/documents/services/document/delete-unused-document/delete-unused-document.interface'

@Injectable()
export class DeleteUnusedDocumentsCron {
  constructor(
    @Inject(DocumentTokens.DeleteUnusedDocumentService)
    private readonly deleteUnusedDocumentService: DeleteUnusedDocument
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @AuditLogConfig('DeleteUnusedDocumentsCron')
  async handleCron() {
    await this.deleteUnusedDocumentService.delete()
  }
}
