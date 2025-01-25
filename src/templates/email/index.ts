import { resolve } from 'path';

const inviteUserTemplatePath = resolve(__dirname, './auth/inviteUser.hbs');

export const EmailPathEnum = {
  INVITE_USER: inviteUserTemplatePath,
} as const;

export type EmailPathEnum = keyof typeof EmailPathEnum;
