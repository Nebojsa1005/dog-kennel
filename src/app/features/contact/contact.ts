import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { EmailService } from '../../core/services/email.service';
import { InquiryState } from '../../shared/models/inquiry-state.model';

const BREED_ID_TO_INTEREST: Record<string, string> = {
  'bernese-mountain-dog': 'bernese',
  maltese: 'maltese',
  'bolonka-zwetna': 'bolonka',
};

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, SectionHeader, NgIf, MatProgressSpinnerModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private emailService = inject(EmailService);

  config = KENNEL_CONFIG;
  form: FormGroup;
  isLoading = signal(false);
  isSuccess = signal(false);
  isError = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interest: ['general'],
      message: ['', Validators.required],
    });

    const state = history.state as Partial<InquiryState>;
    if (state?.name && state?.breedId) {
      this.form.patchValue({
        interest: BREED_ID_TO_INTEREST[state.breedId] ?? 'general',
        message: `Hi, I am interested in ${state.name}. Please send me price and availability information. Thank you!`,
      });
    }
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.isSuccess.set(false);
    this.isError.set(false);

    try {
      const { name, email, interest, message } = this.form.value;
      await this.emailService.sendContactForm({
        from_name: name,
        from_email: email,
        interest,
        message,
        time: new Date().toString(),
      });
      this.form.reset();
      this.isSuccess.set(true);
    } catch {
      this.isError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}
