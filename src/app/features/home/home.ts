import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { register } from 'swiper/element/bundle';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { BreedCard } from '../../shared/components/breed-card/breed-card';
import { DogImg } from '../../shared/components/dog-img/dog-img';
import { Badge } from '../../shared/components/badge/badge';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { TransformImagePipe } from '../../shared/pipes/transform-image.pipe';
import { PuppyService } from '../../core/services/puppy.service';
import { EmailService } from '../../core/services/email.service';
import { AboutService } from '../../core/services/about.service';
import { ImageModalService } from '../../core/services/image-modal.service';
import { Puppy } from '../../core/models/puppy.model';
import { InquiryState } from '../../shared/models/inquiry-state.model';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    TransformImagePipe,
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
  private aboutService = inject(AboutService);
  private imageModalService = inject(ImageModalService);
  puppies = toSignal(this.puppyService.getAvailablePuppies(3), { initialValue: [] });

  isLoading = signal(false);
  isSuccess = signal(false);
  isError = signal(false);

  aboutText = toSignal(this.aboutService.getText(), { initialValue: '' });
  aboutParagraphs = computed(() =>
    this.aboutText()
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
  );
  aboutImages = toSignal(this.aboutService.getImages(), { initialValue: [] });

  private aboutStats = toSignal(this.aboutService.getStats(), {
    initialValue: { years: '', litters: '', puppies: '', countries: '' },
  });
  stats = computed(() => {
    const s = this.aboutStats();
    return [
      { value: s.years, labelKey: 'about.stats.yearsLabel' },
      { value: s.litters, labelKey: 'about.stats.litttersLabel' },
      { value: s.puppies, labelKey: 'about.stats.puppiesLabel' },
      { value: s.countries, labelKey: 'about.stats.countriesLabel' },
    ];
  });

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

  onImageClick(index: number, alt: string): void {
    this.imageModalService.open(this.aboutImages().map(img => img.url), index, alt);
  }

  onLogoImageClick(alt: string): void {
    this.imageModalService.open(['assets/logo/logo.png'], 0, alt);
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
