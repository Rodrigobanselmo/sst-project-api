import { Injectable, Logger } from '@nestjs/common';

import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';

import { mergeEnrichmentHints } from './chemical-identity-enrichment-hints';
import {
  CHEMICAL_ENRICHMENT_CONCURRENCY,
} from './chemical-identity-enrichment.constants';
import type {
  ChemicalIdentityEnrichmentInput,
  ChemicalIdentityEnrichmentResult,
  ChemicalIdentitySourceResult,
  RiskSubtypeCurationCandidateChemicalIdentity,
} from './chemical-identity-enrichment.types';
import { PubChemPugRestClient } from './pubchem-pug-rest.client';

@Injectable()
export class ChemicalIdentityEnrichmentService {
  private readonly logger = new Logger(ChemicalIdentityEnrichmentService.name);

  constructor(private readonly pubChemClient: PubChemPugRestClient) {}

  async enrichBatch(
    inputs: ChemicalIdentityEnrichmentInput[],
  ): Promise<Map<string, ChemicalIdentityEnrichmentResult>> {
    const requestCache = new Map<string, ChemicalIdentityEnrichmentResult>();
    const results = new Map<string, ChemicalIdentityEnrichmentResult>();

    await asyncBatch({
      items: inputs,
      batchSize: CHEMICAL_ENRICHMENT_CONCURRENCY,
      callback: async (input) => {
        const enrichment = await this.enrichOne(input, requestCache);
        results.set(input.riskFactorId, enrichment);
        return enrichment;
      },
    });

    return results;
  }

  async enrichOne(
    input: ChemicalIdentityEnrichmentInput,
    requestCache: Map<string, ChemicalIdentityEnrichmentResult>,
  ): Promise<ChemicalIdentityEnrichmentResult> {
    const cacheKey = this.buildCacheKey(input);
    const cached = requestCache.get(cacheKey);
    if (cached) return cached;

    const sourceResults: ChemicalIdentitySourceResult[] = [];
    const warnings: string[] = [];

    let pubchem = null;
    try {
      pubchem = await this.pubChemClient.lookup({
        cas: input.cas,
        name: input.name,
        synonyms: input.synonyms,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PubChem error';
      this.logger.debug(`PubChem enrichment failed for "${input.name}": ${message}`);
    }

    if (pubchem) {
      sourceResults.push({
        source: 'PUBCHEM',
        found: true,
        matchedBy: pubchem.matchedBy,
        cid: String(pubchem.cid),
        title: pubchem.title,
        molecularFormula: pubchem.molecularFormula,
        canonicalSmiles: pubchem.canonicalSmiles,
        synonyms: pubchem.synonyms,
        description: pubchem.description,
        chemicalClasses: [],
        url: pubchem.url,
        confidence: pubchem.confidence,
        warnings: pubchem.warnings,
      });
    } else {
      sourceResults.push({
        source: 'PUBCHEM',
        found: false,
        confidence: 'low',
      });
    }

    // NIST/NIOSH: sem API REST estável nesta fase — apenas diagnóstico interno.
    this.logger.debug(
      'NIST Chemistry WebBook e NIOSH Pocket Guide não possuem endpoint REST estável; usando apenas PubChem.',
    );

    const normalizedHints = mergeEnrichmentHints(sourceResults);
    const enrichment: ChemicalIdentityEnrichmentResult = {
      sourceResults,
      normalizedHints,
      warnings,
    };

    requestCache.set(cacheKey, enrichment);
    return enrichment;
  }

  toCandidateChemicalIdentity(
    enrichment?: ChemicalIdentityEnrichmentResult,
  ): RiskSubtypeCurationCandidateChemicalIdentity | undefined {
    const pubchem = enrichment?.sourceResults.find(
      (result) => result.source === 'PUBCHEM' && result.found,
    );
    if (!pubchem) return undefined;

    return {
      sources: ['PUBCHEM'],
      matchedBy: pubchem.matchedBy,
      title: pubchem.title,
      molecularFormula: pubchem.molecularFormula,
      classHints: enrichment?.normalizedHints.classHints,
      externalConfidence: pubchem.confidence,
      warnings: pubchem.warnings,
    };
  }

  toAiChemicalIdentitySummary(
    enrichment?: ChemicalIdentityEnrichmentResult,
  ): Record<string, unknown> | null {
    const pubchem = enrichment?.sourceResults.find(
      (result) => result.source === 'PUBCHEM' && result.found,
    );
    if (!pubchem) return null;

    const hints = enrichment?.normalizedHints ?? {};
    return {
      sources: ['PUBCHEM'],
      matchedBy: pubchem.matchedBy,
      title: pubchem.title,
      molecularFormula: pubchem.molecularFormula,
      synonyms: (pubchem.synonyms ?? []).slice(0, 12),
      classHints: hints.classHints ?? [],
      hints: {
        hasAromaticRing: hints.hasAromaticRing ?? null,
        isPolycyclicAromatic: hints.isPolycyclicAromaticHint ?? null,
        isAliphatic: hints.isAliphaticHint ?? null,
        isHalogenated: hints.isHalogenatedHint ?? null,
        isIsocyanate: hints.isIsocyanateHint ?? null,
      },
      warnings: pubchem.warnings ?? [],
    };
  }

  private buildCacheKey(input: ChemicalIdentityEnrichmentInput): string {
    const cas = this.pubChemClient.normalizeCas(input.cas);
    if (cas) return `cas:${cas}`;
    return `name:${input.name.trim().toLowerCase()}`;
  }
}
