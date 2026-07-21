import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { LanguageSwitcherComponent } from './translation/language-switcher.component';
import { TranslationBannerComponent } from './translation/translation-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, LanguageSwitcherComponent, TranslationBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.addLangs(['en', 'sr']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
