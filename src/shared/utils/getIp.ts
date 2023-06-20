export function getIp(req: any) {
  return req.headers['x-forwarded-for'] || req.ip;
}
