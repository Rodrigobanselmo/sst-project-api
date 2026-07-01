import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import {
  CHEMICAL_ENRICHMENT_SOURCE_TIMEOUT_MS,
  PUBCHEM_PUG_REST_BASE_URL,
} from './chemical-identity-enrichment.constants';
import type {
  ChemicalIdentityConfidence,
  ChemicalIdentityMatchedBy,
} from './chemical-identity-enrichment.types';

export type PubChemCompoundData = {
  cid: number;
  matchedBy: ChemicalIdentityMatchedBy;
  confidence: ChemicalIdentityConfidence;
  title?: string;
  molecularFormula?: string;
  canonicalSmiles?: string;
  synonyms: string[];
  description?: string;
  url: string;
  warnings: string[];
};

const CAS_PATTERN = /^\d{2,7}-\d{2}-\d$/;

@Injectable()
export class PubChemPugRestClient {
  private readonly logger = new Logger(PubChemPugRestClient.name);

  normalizeCas(cas?: string | null): string | null {
    if (!cas?.trim()) return null;
    const normalized = cas.trim().replace(/\s+/g, '');
    return CAS_PATTERN.test(normalized) ? normalized : null;
  }

  async lookup(params: {
    cas?: string | null;
    name: string;
    synonyms?: string[];
  }): Promise<PubChemCompoundData | null> {
    const cas = this.normalizeCas(params.cas);
    if (cas) {
      const byCas = await this.lookupByQuery(cas, 'CAS');
      if (byCas) return byCas;
    }

    const byName = await this.lookupByQuery(params.name.trim(), 'NAME');
    if (byName) return byName;

    for (const synonym of (params.synonyms ?? []).slice(0, 3)) {
      const trimmed = synonym?.trim();
      if (!trimmed || trimmed.length < 3) continue;
      const bySynonym = await this.lookupByQuery(trimmed, 'SYNONYM');
      if (bySynonym) return bySynonym;
    }

    return null;
  }

  private async lookupByQuery(
    query: string,
    matchedBy: ChemicalIdentityMatchedBy,
  ): Promise<PubChemCompoundData | null> {
    if (!query) return null;

    try {
      const cidResult = await this.fetchCid(query);
      if (!cidResult) return null;

      const details = await this.fetchCompoundDetails(
        cidResult.cid,
        query,
        matchedBy,
        cidResult.confidence,
        cidResult.warnings,
      );
      return details;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PubChem error';
      this.logger.debug(`PubChem lookup failed for "${query}": ${message}`);
      return null;
    }
  }

  private async fetchCid(query: string): Promise<{
    cid: number;
    confidence: ChemicalIdentityConfidence;
    warnings: string[];
  } | null> {
    const url = `${PUBCHEM_PUG_REST_BASE_URL}/compound/name/${encodeURIComponent(query)}/cids/JSON`;
    const response = await axios.get(url, {
      timeout: CHEMICAL_ENRICHMENT_SOURCE_TIMEOUT_MS,
      validateStatus: (status) => status === 200 || status === 404,
    });
    if (response.status === 404) return null;

    const cids: number[] = response.data?.IdentifierList?.CID ?? [];
    if (!cids.length) return null;

    const warnings: string[] = [];
    let confidence: ChemicalIdentityConfidence = 'medium';
    if (cids.length > 1) {
      warnings.push('Múltiplos registros PubChem para a consulta.');
      confidence = 'low';
    }

    return { cid: cids[0], confidence, warnings };
  }

  private async fetchCompoundDetails(
    cid: number,
    query: string,
    matchedBy: ChemicalIdentityMatchedBy,
    baseConfidence: ChemicalIdentityConfidence,
    baseWarnings: string[],
  ): Promise<PubChemCompoundData> {
    const warnings = [...baseWarnings];
    let confidence = baseConfidence;

    const [properties, synonymsResponse, descriptionResponse] = await Promise.all([
      axios
        .get(
          `${PUBCHEM_PUG_REST_BASE_URL}/compound/cid/${cid}/property/MolecularFormula,CanonicalSMILES,Title,IUPACName/JSON`,
          {
            timeout: CHEMICAL_ENRICHMENT_SOURCE_TIMEOUT_MS,
            validateStatus: (status) => status === 200 || status === 404,
          },
        )
        .catch(() => null),
      axios
        .get(`${PUBCHEM_PUG_REST_BASE_URL}/compound/cid/${cid}/synonyms/JSON`, {
          timeout: CHEMICAL_ENRICHMENT_SOURCE_TIMEOUT_MS,
          validateStatus: (status) => status === 200 || status === 404,
        })
        .catch(() => null),
      axios
        .get(`${PUBCHEM_PUG_REST_BASE_URL}/compound/cid/${cid}/description/JSON`, {
          timeout: CHEMICAL_ENRICHMENT_SOURCE_TIMEOUT_MS,
          validateStatus: (status) => status === 200 || status === 404,
        })
        .catch(() => null),
    ]);

    const props = properties?.data?.PropertyTable?.Properties?.[0] ?? {};
    const synonyms: string[] =
      synonymsResponse?.data?.InformationList?.Information?.[0]?.Synonym ?? [];

    if (matchedBy === 'CAS' && synonyms.length) {
      const normalizedQuery = query.toLowerCase();
      const casConfirmed = synonyms.some(
        (synonym) => synonym?.toLowerCase() === normalizedQuery,
      );
      if (casConfirmed) {
        confidence = 'high';
      } else {
        warnings.push('CAS consultado não confirmado nos sinônimos PubChem.');
        confidence = confidence === 'high' ? 'medium' : confidence;
      }
    }

    const descriptions =
      descriptionResponse?.data?.InformationList?.Information ?? [];
    const description = descriptions
      .map((item: { Description?: string }) => item.Description)
      .filter(Boolean)
      .slice(0, 1)
      .join(' ');

    return {
      cid,
      matchedBy,
      confidence,
      title: props.Title || props.IUPACName,
      molecularFormula: props.MolecularFormula,
      canonicalSmiles: props.CanonicalSMILES,
      synonyms: synonyms.slice(0, 50),
      description: description || undefined,
      url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
      warnings,
    };
  }
}
