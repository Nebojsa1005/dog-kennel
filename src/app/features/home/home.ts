import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { BreedCard } from '../../shared/components/breed-card/breed-card';
import { DogImg } from '../../shared/components/dog-img/dog-img';
import { Badge } from '../../shared/components/badge/badge';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { PuppyService } from '../../core/services/puppy.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslateModule, NgFor, BreedCard, DogImg, Badge, SectionHeader],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {
  config = KENNEL_CONFIG;
  breeds = KENNEL_CONFIG.breeds;
  contactForm: FormGroup;

  private puppyService = inject(PuppyService);
  puppies = toSignal(this.puppyService.getAvailablePuppies(3), { initialValue: [] });

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

  submitContact() {
    if (this.contactForm.valid) {
      console.log('Contact form submitted:', this.contactForm.value);
      this.contactForm.reset();
    }
  }
}
