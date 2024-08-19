import { Aggregate } from "@/@v2/shared/domain/entities/aggregate";
import { DocumentBaseEntity } from "../entities/document-base.entity";
import { DocumentVersionEntity } from "../entities/document-version.entity";
import { HierarchyEntity } from "../entities/hierarchy.entity";
import { HomogeneousGroupEntity } from '../entities/homogeneous-group.entity';

export type IDocumentAggregate = {
  documentVersion: DocumentVersionEntity
  documentBase: DocumentBaseEntity;

  hierarchies: () => Promise<HierarchyEntity[]>
  homogeneousGroups: () => Promise<HomogeneousGroupEntity[]>
}

export class DocumentAggregate {
  documentVersion: DocumentVersionEntity
  documentBase: DocumentBaseEntity;

  #aggregate: Aggregate = new Aggregate();
  #hierarchies: () => Promise<HierarchyEntity[]>
  #homogeneousGroups: () => Promise<HomogeneousGroupEntity[]>

  constructor(params: IDocumentAggregate) {
    this.documentVersion = params.documentVersion;
    this.documentBase = params.documentBase;

    this.#hierarchies = params.hierarchies
    this.#homogeneousGroups = params.homogeneousGroups
  }

  async hierarchies() {
    return this.#aggregate.get(() => this.#hierarchies())
  }

  async homogeneousGroups() {
    return this.#aggregate.get(() => this.#homogeneousGroups())
  }
}
