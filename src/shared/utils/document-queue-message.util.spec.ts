import { describe, expect, it } from '@jest/globals';

import { buildDocumentQueueMessageIds } from './document-queue-message.util';

describe('buildDocumentQueueMessageIds', () => {
  it('scopes fifo group to the document version id', () => {
    const ids = buildDocumentQueueMessageIds({
      documentVersionId: 'doc-version-1',
      attemptToken: 123,
    });

    expect(ids.MessageGroupId).toBe('doc-version-1');
    expect(ids.MessageDeduplicationId).toBe('doc-version-1-123');
  });

  it('builds deduplication id from document version and attempt token', () => {
    const ids = buildDocumentQueueMessageIds({
      documentVersionId: 'doc-version-1',
      attemptToken: 'regenerate',
    });

    expect(ids.MessageDeduplicationId).toBe('doc-version-1-regenerate');
  });
});
