import { resolve } from 'path';

const inviteUserTemplatePath = resolve(__dirname, './auth/inviteUser.hbs');
const ActionPlanNewTaskTemplatePath = resolve(__dirname, './security/action-plan/actionPlanNewTask.hbs');
const actionPlanAllTaskTemplatePath = resolve(__dirname, './security/action-plan/actionPlanAllTask.hbs');

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
} as const;

export type EmailTemplate = keyof typeof EmailTemplate;
export const AllowedEmailTemplate = Object.keys(EmailTemplate) as EmailTemplate[];
