import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { Injectable, Logger } from '@nestjs/common';
import { AwsSesAdapter } from './aws-ses.adapter';
import { BrevoAdapter } from './brevo.adapter';
import { EmailProviderEnum } from './email-provider.enum';
import { SendMailAdapter } from './mail.interface';
import { NodeMailerAdapter } from './node-mailer.adapter';

interface EmailProviderMap {
  [EmailProviderEnum.MAIN]: SendMailAdapter;
  [EmailProviderEnum.SECONDARY]: SendMailAdapter;
  [EmailProviderEnum.MOST_RELIABLE]: SendMailAdapter;
}

@Injectable()
export class CompositeEmailAdapter implements SendMailAdapter {
  private readonly logger = new Logger(CompositeEmailAdapter.name);
  private readonly providers: EmailProviderMap;
  private readonly retryAttempts = 1;
  private readonly retryDelay = 1500;

  constructor(
    private readonly nodeMailerAdapter: NodeMailerAdapter,
    private readonly awsSesAdapter: AwsSesAdapter,
    private readonly brevoAdapter: BrevoAdapter,
  ) {
    // Configure which adapter maps to which provider level
    // Using NodeMailer as MAIN since Brevo domain is not authenticated
    this.providers = {
      [EmailProviderEnum.MAIN]: this.brevoAdapter,
      [EmailProviderEnum.SECONDARY]: this.awsSesAdapter,
      [EmailProviderEnum.MOST_RELIABLE]: this.nodeMailerAdapter,
    };
  }

  async sendMail(data: SendMailAdapter.SendMailData): Promise<void> {
    // Enable fallback to secondary providers for better reliability
    const providers = [EmailProviderEnum.MAIN, EmailProviderEnum.SECONDARY];
    if (data.provider) providers.unshift(data.provider);

    let lastError: Error | null = null;

    for (let i = 0; i < providers.length; i++) {
      const providerType = providers[i];
      const provider = this.providers[providerType];

      if (!provider) {
        this.logger.warn(`Provider ${providerType} not configured, skipping`);
        continue;
      }

      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          this.logger.debug(`Attempting to send email via ${providerType} (attempt ${attempt}/${this.retryAttempts})`);
          this.logger.debug(`data: ${JSON.stringify(data)}`);

          await provider.sendMail(data);

          this.logger.log(`Email sent successfully via ${providerType} on attempt ${attempt}`);
          return; // Success, exit early
        } catch (error) {
          lastError = error as Error;
          this.logger.warn(`Failed to send email via ${providerType} on attempt ${attempt}: ${error.message}`);

          // If this is not the last attempt, wait before retrying
          if (attempt < this.retryAttempts) {
            await this.delay(this.retryDelay);
          }
        }
      }

      this.logger.error(`All retry attempts failed for provider ${providerType}, trying next provider`);
    }

    // If we reach here, all providers failed
    const errorMessage = `All email providers failed to send email. Last error: ${lastError?.message}`;
    this.logger.error(errorMessage);

    captureException(new Error(errorMessage));

    throw new Error(errorMessage);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
