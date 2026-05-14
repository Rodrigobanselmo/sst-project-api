import { resolve } from 'path';

const inviteUserTemplatePath = resolve(__dirname, './auth/inviteUser.hbs');
const ActionPlanNewTaskTemplatePath = resolve(__dirname, './security/action-plan/actionPlanNewTask.hbs');
const actionPlanAllTaskTemplatePath = resolve(__dirname, './security/action-plan/actionPlanAllTask.hbs');
const formInvitationTemplatePath = resolve(__dirname, './forms/formInvitation.hbs');
const formInvitationReminderTemplatePath = resolve(__dirname, './forms/formInvitationReminder.hbs');

export const EmailTemplate = {
  INVITE_USER: {
    path: inviteUserTemplatePath,
    subject: 'Convite para se tornar membro',
  },
  ACTION_PLAN_ALL_TASKS: {
    path: actionPlanAllTaskTemplatePath,
    subject: 'Resumo de suas tarefas atribuídas no plano de ação',
  },
  ACTION_PLAN_NEW_TASKS: {
    path: ActionPlanNewTaskTemplatePath,
    subject: 'Nova tarefa atribuída no plano de ação',
  },
  FORM_INVITATION: {
    path: formInvitationTemplatePath,
    subject: 'Convite para responder formulário',
  },
  FORM_INVITATION_REMINDER: {
    path: formInvitationReminderTemplatePath,
    subject: 'Lembrete: Sua participação ainda é esperada',
  },
} as const;

export type EmailTemplate = keyof typeof EmailTemplate;
export const AllowedEmailTemplate = Object.keys(EmailTemplate) as EmailTemplate[];
