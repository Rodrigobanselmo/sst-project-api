import type { EmailTemplate } from '@/templates/@v2/email';

type IEmailType = {
  type: EmailTemplate;
  email?: string;
};

interface IInviteUser extends IEmailType {
  type: 'INVITE_USER';
  companyId: string;
  userId: number;
  link: string;
}

interface IActionPlanAllTasks extends IEmailType {
  type: 'ACTION_PLAN_ALL_TASKS';
  userId: number;
  companyId: string;
  link: string;
  tasks: {
    title: string;
    status: string;
    dueDate: string;
    statusColor: string;
  }[];
}

interface IActionPlanNewTasks extends IEmailType {
  type: 'ACTION_PLAN_NEW_TASKS';
  userId: number;
  companyId: string;
  link: string;
  tasks: {
    title: string;
    status: string;
    dueDate: string;
    statusColor: string;
  }[];
}

export type ISendEmail = IInviteUser | IActionPlanAllTasks | IActionPlanNewTasks;

export interface MailAdapter {
  sendMail(data: MailAdapter.SendMailData): Promise<void>;
}

export namespace MailAdapter {
  export type SendMailData = ISendEmail;
}
