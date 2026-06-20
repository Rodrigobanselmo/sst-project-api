import { describe, expect, it } from '@jest/globals';

import { CharacterizationModel } from '@/@v2/documents/domain/models/characterization.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import {
  isSyntheticHomogeneousGroupPath,
  resolveCharacterizationDescription,
  resolveHomogeneousGroupInventoryDescription,
} from './resolve-homogeneous-group-description.util';

const environmentName =
  'Sonda semissubmersível: SS-92 — Nanhai 8 — NAN HAI BA HAO';

const baseCharacterization = new CharacterizationModel({
  id: 'char-1',
  name: environmentName,
  description: null,
  type: CharacterizationTypeEnum.OPERATION,
  considerations: [],
  activities: [],
  paragraphs: ['Descrição em parágrafos da caracterização.'],
  luminosity: null,
  moisturePercentage: null,
  noiseValue: null,
  temperature: null,
  profileName: null,
  profileParentId: null,
  photos: [],
});

describe('isSyntheticHomogeneousGroupPath', () => {
  it('detects synthetic characterization path stored in gho.description', () => {
    expect(
      isSyntheticHomogeneousGroupPath(`${environmentName}(//)OPERATION`),
    ).toBe(true);
  });
});

describe('resolveCharacterizationDescription', () => {
  it('uses descriptive paragraphs when available', () => {
    expect(resolveCharacterizationDescription(baseCharacterization)).toBe(
      'Descrição em parágrafos da caracterização.',
    );
  });

  it('prefers paragraphs over legacy description field', () => {
    const characterization = new CharacterizationModel({
      ...baseCharacterization,
      description: 'Descrição legada',
      paragraphs: ['Descrição principal'],
    });

    expect(resolveCharacterizationDescription(characterization)).toBe('Descrição principal');
  });

  it('returns empty when only the characterization name is available', () => {
    const characterization = new CharacterizationModel({
      ...baseCharacterization,
      description: environmentName,
      paragraphs: [],
    });

    expect(resolveCharacterizationDescription(characterization)).toBe('');
  });
});

describe('resolveHomogeneousGroupInventoryDescription', () => {
  it('uses real GSE description when available', () => {
    const gho = new HomogeneousGroupModel({
      id: 'gho-1',
      name: 'GSE clássico',
      description: 'Descrição real do GSE',
      type: undefined as unknown as HomoTypeEnum,
      companyId: 'company-1',
      hierarchies: [],
      characterization: null,
      risksData: [],
    });

    expect(resolveHomogeneousGroupInventoryDescription(gho)).toBe('Descrição real do GSE');
  });

  it('uses characterization paragraphs when GSE description is synthetic path', () => {
    const gho = new HomogeneousGroupModel({
      id: 'gho-2',
      name: environmentName,
      description: `${environmentName}(//)OPERATION`,
      type: HomoTypeEnum.ENVIRONMENT,
      companyId: 'company-1',
      hierarchies: [],
      characterization: baseCharacterization,
      risksData: [],
    });

    expect(resolveHomogeneousGroupInventoryDescription(gho)).toBe(
      'Descrição em parágrafos da caracterização.',
    );
  });

  it('returns empty when only name, title or synthetic path exist', () => {
    const gho = new HomogeneousGroupModel({
      id: 'gho-3',
      name: environmentName,
      description: `${environmentName}(//)OPERATION`,
      type: HomoTypeEnum.ENVIRONMENT,
      companyId: 'company-1',
      hierarchies: [],
      characterization: new CharacterizationModel({
        ...baseCharacterization,
        description: environmentName,
        paragraphs: [],
      }),
      risksData: [],
    });

    expect(resolveHomogeneousGroupInventoryDescription(gho)).toBe('');
  });

  it('does not use environment name as fallback', () => {
    const gho = new HomogeneousGroupModel({
      id: 'gho-4',
      name: environmentName,
      description: environmentName,
      type: HomoTypeEnum.ENVIRONMENT,
      companyId: 'company-1',
      hierarchies: [],
      characterization: new CharacterizationModel({
        ...baseCharacterization,
        description: null,
        paragraphs: [],
      }),
      risksData: [],
    });

    expect(resolveHomogeneousGroupInventoryDescription(gho)).toBe('');
  });

  it('returns empty when no descriptive content exists', () => {
    const gho = new HomogeneousGroupModel({
      id: 'gho-5',
      name: 'Sem descrição',
      description: '',
      type: undefined as unknown as HomoTypeEnum,
      companyId: 'company-1',
      hierarchies: [],
      characterization: null,
      risksData: [],
    });

    expect(resolveHomogeneousGroupInventoryDescription(gho)).toBe('');
  });
});
