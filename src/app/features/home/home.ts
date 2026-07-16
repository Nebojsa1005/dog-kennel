import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { BreedCard } from '../../shared/components/breed-card/breed-card';
import { DogImg } from '../../shared/components/dog-img/dog-img';
import { Badge } from '../../shared/components/badge/badge';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { PuppyService } from '../../core/services/puppy.service';
import { EmailService } from '../../core/services/email.service';
import { Puppy } from '../../core/models/puppy.model';
import { InquiryState } from '../../shared/models/inquiry-state.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    NgFor,
    BreedCard,
    DogImg,
    Badge,
    SectionHeader,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {
  config = KENNEL_CONFIG;
  breeds = KENNEL_CONFIG.breeds;
  contactForm: FormGroup;

  private puppyService = inject(PuppyService);
  private router = inject(Router);
  private emailService = inject(EmailService);
  puppies = toSignal(this.puppyService.getAvailablePuppies(3), { initialValue: [] });

  isLoading = signal(false);
  isSuccess = signal(false);
  isError = signal(false);

  stats = [
    { value: '12+', labelKey: 'about.stats.yearsLabel' },
    { value: '80+', labelKey: 'about.stats.litttersLabel' },
    { value: '300+', labelKey: 'about.stats.puppiesLabel' },
    { value: '15', labelKey: 'about.stats.countriesLabel' },
  ];

  @ViewChildren('fadeEl', { read: ElementRef }) fadeElements!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interest: ['general'],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          this.observer.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
  }

  ngAfterViewInit() {
    this.fadeElements.forEach(el => this.observer.observe(el.nativeElement));
    this.fadeElements.changes.subscribe((list: QueryList<ElementRef>) => {
      list.forEach(el => this.observer.observe(el.nativeElement));
    });
  }

  onInquire(p: Puppy): void {
    this.router.navigate(['/contact'], {
      state: { name: p.name, breedId: p.breedId } satisfies InquiryState,
    });
  }

  async submitContact(): Promise<void> {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;

    this.isLoading.set(true);
    this.isSuccess.set(false);
    this.isError.set(false);

    try {
      const { name, email, interest, message } = this.contactForm.value;
      await this.emailService.sendContactForm({
        from_name: name,
        from_email: email,
        interest,
        message,
        time: new Date().toString(),
      });
      this.contactForm.reset();
      this.isSuccess.set(true);
    } catch {
      this.isError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}
