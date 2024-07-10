import { riskAllId } from './../constants/ids';

export const getIsTodosRisk = ({ riskName, riskId }: { riskName?: string; riskId?: string }) => {
  if (riskName === 'Todos') return true;
  if (riskId === riskAllId) return true;

  return false;
};
