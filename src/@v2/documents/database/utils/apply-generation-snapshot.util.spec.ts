import { describe, expect, it } from '@jest/globals';

import { applyGenerationSnapshotToDocumentData } from './apply-generation-snapshot.util';

describe('applyGenerationSnapshotToDocumentData', () => {
  it('replaces professionals with snapshot list and keeps snapshot order', () => {
    const documentData = {
      professionalsSignatures: [
        {
          professionalId: 10,
          isSigner: true,
          isElaborator: true,
          professional: { id: 10, name: 'Francisco' },
        },
      ],
    } as any;

    applyGenerationSnapshotToDocumentData(documentData, {
      professionalSignatures: [{ professionalId: 20, isSigner: true, isElaborator: true }],
    }, {
      supplementalProfessionalSignatures: new Map([
        [
          20,
          {
            professionalId: 20,
            isSigner: false,
            isElaborator: false,
            professional: { id: 20, name: 'Alex' },
          },
        ],
      ]),
    });

    expect(documentData.professionalsSignatures).toEqual([
      {
        professionalId: 20,
        isSigner: true,
        isElaborator: true,
        professional: { id: 20, name: 'Alex' },
      },
    ]);
  });

  it('updates flags for existing professionals from snapshot', () => {
    const documentData = {
      professionalsSignatures: [
        {
          professionalId: 10,
          isSigner: true,
          isElaborator: true,
          professional: { id: 10, name: 'Francisco' },
        },
      ],
    } as any;

    applyGenerationSnapshotToDocumentData(documentData, {
      professionalSignatures: [{ professionalId: 10, isSigner: false, isElaborator: true }],
    });

    expect(documentData.professionalsSignatures).toEqual([
      {
        professionalId: 10,
        isSigner: false,
        isElaborator: true,
        professional: { id: 10, name: 'Francisco' },
      },
    ]);
  });

  it('clears professionals when snapshot has an empty list', () => {
    const documentData = {
      professionalsSignatures: [
        {
          professionalId: 10,
          isSigner: true,
          isElaborator: true,
        },
      ],
    } as any;

    applyGenerationSnapshotToDocumentData(documentData, {
      professionalSignatures: [],
    });

    expect(documentData.professionalsSignatures).toEqual([]);
  });
});
