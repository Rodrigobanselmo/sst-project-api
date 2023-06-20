import parser from 'ua-parser-js';

export function getUserAgentString(userAgent: string) {
  const ua = parser(userAgent);

  return {
    browser: ua.browser.name,
    browserVersion: ua.browser.version,
    device: ua.device.model,
    deviceVendor: ua.device.vendor,
    os: ua.os.name,
    osVersion: ua.os.version,
  };
}
