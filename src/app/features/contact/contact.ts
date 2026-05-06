import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { SectionHeader } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, SectionHeader],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  config = KENNEL_CONFIG;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interest: ['general'],
      message: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      console.log('Contact form:', this.form.value);
      this.form.reset();
    }
  }
}
