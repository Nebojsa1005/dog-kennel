import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor() {
    emailjs.init(environment.emailjs.publicKey);
  }

  async sendContactForm(data: {
    from_name: string;
    from_email: string;
    interest: string;
    message: string;
    time: string;
  }): Promise<void> {
    const result = await emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      data as Record<string, unknown>
    );
    if (result.status !== 200) {
      throw new Error(result.text ?? 'Failed to send message');
    }
  }
}
