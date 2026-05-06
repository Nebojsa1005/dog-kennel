import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { BreedCard } from '../../shared/components/breed-card/breed-card';
import { DogImg } from '../../shared/components/dog-img/dog-img';
import { Badge } from '../../shared/components/badge/badge';
import { SectionHeader } from '../../shared/components/section-header/section-header';

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

  puppies = [
    { id: 1, breed: 'Bernese Mountain Dog', litter: 'A', born: '2025-03-01', availableFrom: '2025-05-01', status: 'available' as const },
    { id: 2, breed: 'Maltese', litter: 'B', born: '2025-02-15', availableFrom: '2025-04-15', status: 'reserved' as const },
    { id: 3, breed: 'Bolonka Zwetna', litter: 'C', born: '2025-04-01', availableFrom: '2025-06-01', status: 'available' as const },
  ];

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
