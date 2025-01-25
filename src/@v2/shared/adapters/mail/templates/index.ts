import { resolve } from 'path';

const inviteUserTemplatePath = resolve(__dirname, './auth/inviteUser.hbs');

export const EmailType = {
  INVITE_USER: {
    path: inviteUserTemplatePath,
    subject: 'Convite para se tornar membro',
  },
} as const;

export type EmailType = keyof typeof EmailType;
