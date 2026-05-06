import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, NgFor],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  config = KENNEL_CONFIG;
  breeds = KENNEL_CONFIG.breeds;
  mobileOpen = signal(false);
  scrolled = signal(false);
  activeLang = signal('en');

  constructor(private translate: TranslateService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.activeLang.set(lang);
  }

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }
}
