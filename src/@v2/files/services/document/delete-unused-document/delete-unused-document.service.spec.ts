import { Test, TestingModule } from '@nestjs/testing'
import { captureException } from '@sentry/node'

import { Document } from '@/@modules/documents/domain/entities'
import { SharedTokens } from '@/@modules/shared/di/tokens'
import { Storage } from '@/@modules/shared/adapters/storage'
import { asyncBatch } from '@/@modules/shared/utils/async/asyncBatch'
import { DocumentRepository } from '@/@modules/documents/database/repositories/document/document.repository'
import { DocumentTokens } from '@/@modules/documents/constants/tokens'

import { DeleteUnusedDocumentService } from './delete-unused-document.service'

vi.mock('@sentry/node', () => ({
  captureException: vi.fn()
}))

vi.mock('@/@modules/shared/utils/async/asyncBatch', () => ({
  asyncBatch: vi.fn()
}))

describe('DeleteUnusedDocumentService', () => {
  let sut: DeleteUnusedDocumentService
  let storage: Storage
  let documentRepository: DocumentRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUnusedDocumentService,
        {
          provide: SharedTokens.Storage,
          useValue: {
            remove: vi.fn()
          }
        },
        {
          provide: DocumentTokens.DocumentRepository,
          useValue: {
            findMany: vi.fn(),
            delete: vi.fn()
          }
        }
      ]
    }).compile()

    sut = module.get<DeleteUnusedDocumentService>(DeleteUnusedDocumentService)
    storage = module.get<Storage>(SharedTokens.Storage)
    documentRepository = module.get<DocumentRepository>(DocumentTokens.DocumentRepository)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should delete unused documents', async () => {
    const documentsMock = [
      { id: 1, fileName: 'doc1.pdf' },
      { id: 2, fileName: 'doc2.pdf' }
    ] as Document[]

    vi.spyOn(documentRepository, 'findMany').mockResolvedValueOnce([documentsMock, 2])

    const removeSpy = vi.spyOn(storage, 'remove').mockResolvedValueOnce(undefined)
    const deleteSpy = vi.spyOn(documentRepository, 'delete').mockResolvedValueOnce(undefined)

    await sut.delete()

    expect(documentRepository.findMany).toHaveBeenCalled()
    expect(asyncBatch).toHaveBeenCalledWith({
      items: documentsMock,
      batchSize: 10,
      callback: expect.any(Function)
    })

    // Mock the callback function for asyncBatch
    const callback = vi.mocked(asyncBatch).mock.calls[0][0].callback

    for (const document of documentsMock) {
      await callback(document)
      expect(removeSpy).toHaveBeenCalledWith({ fileName: document.fileName })
      expect(deleteSpy).toHaveBeenCalledWith({ documentId: document.id })
    }
  })

  it('should capture exception if an error occurs during deletion', async () => {
    const documentsMock = [{ id: 1, fileName: 'doc1.pdf' }] as Document[]

    const error = new Error('test error')
    vi.spyOn(documentRepository, 'findMany').mockResolvedValueOnce([documentsMock, 1])
    vi.spyOn(storage, 'remove').mockRejectedValueOnce(error)
    const deleteSpy = vi.spyOn(documentRepository, 'delete')

    await sut.delete()

    expect(documentRepository.findMany).toHaveBeenCalled()
    expect(asyncBatch).toHaveBeenCalledWith({
      items: documentsMock,
      batchSize: 10,
      callback: expect.any(Function)
    })

    const callback = vi.mocked(asyncBatch).mock.calls[0][0].callback

    for (const document of documentsMock) {
      await callback(document)
      expect(storage.remove).toHaveBeenCalledWith({ fileName: document.fileName })
      expect(deleteSpy).not.toHaveBeenCalled()
      expect(captureException).toHaveBeenCalledWith(error, {
        extra: { documentId: document.id, action: 'delete unused document' }
      })
    }
  })
})
