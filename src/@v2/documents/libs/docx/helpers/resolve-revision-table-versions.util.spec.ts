import { describe, expect, it } from '@jest/globals';

import { DocumentBaseModel } from '@/@v2/documents/domain/models/document-base.model';
import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { VersionModel } from '@/@v2/documents/domain/models/version.model';
import { resolveRevisionTableVersions } from './resolve-revision-table-versions.util';

const makeDocumentBase = (versions: VersionModel[]) =>
  ({
    allVersions: versions,
    approvedBy: 'Aprovador',
    revisionBy: 'Revisor',
    elaboratedBy: 'Elaborador',
  }) as DocumentBaseModel;

const makeDocumentVersion = (
  version: string,
  documentDate: Date | null,
  officialRevisionSeries: number | null = null,
  revisionSnapshot?: {
    approvedBy?: string | null;
    revisionBy?: string | null;
    elaboratedBy?: string | null;
  },
): DocumentVersionModel =>
  ({
    version,
    description: `Descrição ${version}`,
    documentDate,
    createdAt: new Date('2026-06-18'),
    officialRevisionSeries,
    approvedBy: revisionSnapshot?.approvedBy ?? null,
    revisionBy: revisionSnapshot?.revisionBy ?? null,
    elaboratedBy: revisionSnapshot?.elaboratedBy ?? null,
    documentBase: makeDocumentBase([]),
  }) as DocumentVersionModel;

describe('resolveRevisionTableVersions', () => {
  it('versão de teste 0.0.1 inclui histórico 0.0.0 + 0.0.1', () => {
    const history = [
      new VersionModel({
        version: '0.0.0',
        description: 'teste',
        documentDate: new Date('2025-07-15'),
        createdAt: new Date('2025-07-15'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
      }),
      new VersionModel({
        version: '1.0.0',
        description: 'oficial',
        documentDate: new Date('2026-06-18'),
        createdAt: new Date('2026-06-18'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
      }),
    ];

    const documentBase = makeDocumentBase(history);
    const documentVersion = makeDocumentVersion(
      '0.0.1',
      new Date('2025-08-10'),
    );
    documentVersion.documentBase = documentBase;

    const rows = resolveRevisionTableVersions(documentVersion, documentBase);

    expect(rows.map((row) => row.version)).toEqual(['0.0.0', '0.0.1']);
    expect(rows[1].documentDate).toEqual(new Date('2025-08-10'));
  });

  it('versão de teste 0.0.2 inclui histórico acumulado da família', () => {
    const history = [
      new VersionModel({
        version: '0.0.0',
        description: 'teste 0',
        documentDate: new Date('2025-07-15'),
        createdAt: new Date('2025-07-15'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
      }),
      new VersionModel({
        version: '0.0.1',
        description: 'teste 1',
        documentDate: new Date('2025-08-10'),
        createdAt: new Date('2025-08-10'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
      }),
    ];

    const documentBase = makeDocumentBase(history);
    const documentVersion = makeDocumentVersion(
      '0.0.2',
      new Date('2025-09-01'),
    );
    documentVersion.documentBase = documentBase;

    const rows = resolveRevisionTableVersions(documentVersion, documentBase);

    expect(rows.map((row) => row.version)).toEqual(['0.0.0', '0.0.1', '0.0.2']);
  });

  it('versão oficial 1.0.0 sem histórico oficial retorna uma linha', () => {
    const history = [
      new VersionModel({
        version: '0.0.0',
        description: 'simulado',
        documentDate: new Date('2025-07-15'),
        createdAt: new Date('2025-07-15'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
      }),
    ];

    const documentBase = makeDocumentBase(history);
    const documentVersion = makeDocumentVersion(
      '1.0.0',
      new Date('2026-06-18'),
    );
    documentVersion.documentBase = documentBase;

    const rows = resolveRevisionTableVersions(documentVersion, documentBase);

    expect(rows).toHaveLength(1);
    expect(rows[0].version).toBe('1.0.0');
  });

  it('versão oficial 2.0.0 inclui somente histórico oficial da mesma série', () => {
    const history = [
      new VersionModel({
        version: '0.0.0',
        description: 'simulado',
        documentDate: new Date('2025-07-15'),
        createdAt: new Date('2025-07-15'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
        officialRevisionSeries: null,
      }),
      new VersionModel({
        version: '1.0.0',
        description: 'rev 1',
        documentDate: new Date('2026-01-10'),
        createdAt: new Date('2026-01-10'),
        approvedBy: 'Aprovador 1',
        revisionBy: 'Revisor 1',
        elaboratedBy: null,
        officialRevisionSeries: 1,
      }),
      new VersionModel({
        version: '1.0.0',
        description: 'nova série',
        documentDate: new Date('2026-03-10'),
        createdAt: new Date('2026-03-10'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
        officialRevisionSeries: 2,
      }),
    ];

    const documentBase = makeDocumentBase(history);
    const documentVersion = makeDocumentVersion(
      '2.0.0',
      new Date('2026-06-18'),
      1,
    );
    documentVersion.approvedBy = 'Aprovador 2';
    documentVersion.revisionBy = 'Revisor 2';
    documentVersion.documentBase = documentBase;

    const rows = resolveRevisionTableVersions(documentVersion, documentBase);

    expect(rows.map((row) => row.version)).toEqual(['1.0.0', '2.0.0']);
    expect(rows[0].approvedBy).toBe('Aprovador 1');
    expect(rows[0].revisionBy).toBe('Revisor 1');
    expect(rows[1].approvedBy).toBe('Aprovador 2');
    expect(rows[1].revisionBy).toBe('Revisor 2');
  });

  it('versão oficial 1.0.0 da série 2 não inclui histórico da série 1', () => {
    const history = [
      new VersionModel({
        version: '1.0.0',
        description: 'série 1',
        documentDate: new Date('2026-01-10'),
        createdAt: new Date('2026-01-10'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
        officialRevisionSeries: 1,
      }),
      new VersionModel({
        version: '2.0.0',
        description: 'série 1',
        documentDate: new Date('2026-02-10'),
        createdAt: new Date('2026-02-10'),
        approvedBy: null,
        revisionBy: null,
        elaboratedBy: null,
        officialRevisionSeries: 1,
      }),
    ];

    const documentBase = makeDocumentBase(history);
    const documentVersion = makeDocumentVersion(
      '1.0.0',
      new Date('2026-06-18'),
    );
    documentVersion.officialRevisionSeries = 2;
    documentVersion.documentBase = documentBase;

    const rows = resolveRevisionTableVersions(documentVersion, documentBase);

    expect(rows.map((row) => row.version)).toEqual(['1.0.0']);
  });
});
