type BuildDocumentQueueMessageIdsParams = {
  documentVersionId: string;
  attemptToken?: string | number;
};

/**
 * FIFO queue ids scoped per document version so one stuck job does not block others.
 */
export function buildDocumentQueueMessageIds({
  documentVersionId,
  attemptToken = Date.now(),
}: BuildDocumentQueueMessageIdsParams) {
  return {
    MessageGroupId: documentVersionId,
    MessageDeduplicationId: `${documentVersionId}-${attemptToken}`,
  };
}
