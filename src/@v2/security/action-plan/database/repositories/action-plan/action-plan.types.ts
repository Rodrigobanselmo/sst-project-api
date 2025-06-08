export interface IActionPlanRepository {}

export namespace IActionPlanRepository {
  export type UpdateResponsibleNotifiedAtParams = { ids: string[]; callback?: () => Promise<void> };
  export type UpdateResponsibleNotifiedAtReturn = Promise<void>;
}
