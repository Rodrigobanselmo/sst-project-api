import { DomainError } from "../../error/domain-error.error";

export type DomainResponse<T = void> = [T | void, DomainError | null]