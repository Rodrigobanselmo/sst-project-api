export namespace ISendFormReminderUseCase {
  export type Params = {
    companyId: string;
    applicationId: string;
  };

  export type Result = {
    emailsSent: number;
    skippedAlreadyAnswered: number;
    skippedWithoutEmail: number;
    reminderCount: number;
    reminderLimit: number;
    remainingReminders: number;
    participants: {
      id: number;
      name: string;
      email: string;
      sent: boolean;
      error?: string;
    }[];
  };
}
