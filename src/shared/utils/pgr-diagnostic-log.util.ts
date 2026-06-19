import { hostname } from 'os';

type PgrDiagnosticPayload = Record<string, unknown>;

export function logPgrDiagnostic(phase: string, payload: PgrDiagnosticPayload) {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  console.log(
    JSON.stringify({
      tag: 'PGR_DIAG',
      phase,
      host: hostname(),
      pid: process.pid,
      pm2Name: process.env.name || process.env.pm_id || null,
      gitSha: process.env.DEPLOY_GIT_SHA || null,
      at: new Date().toISOString(),
      ...payload,
    }),
  );
}
