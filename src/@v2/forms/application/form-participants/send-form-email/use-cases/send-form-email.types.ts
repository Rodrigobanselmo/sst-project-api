export namespace ISendFormEmailUseCase {
  export type Params = {
    companyId: string;
    applicationId: string;
    participantIds?: number[];
  };

  export type Result = {
    emailsSent: number;
    participants: {
      id: number;
      name: string;
      email: string;
      sent: boolean;
      error?: string;
    }[];
  };
}
