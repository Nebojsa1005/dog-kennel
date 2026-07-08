import { Component } from '@angular/core';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { GuestbookForm } from './guestbook-form/guestbook-form';
import { GuestbookList } from './guestbook-list/guestbook-list';

@Component({
  selector: 'app-guestbook',
  standalone: true,
  imports: [SectionHeader, GuestbookForm, GuestbookList],
  templateUrl: './guestbook.html',
  styleUrl: './guestbook.scss',
})
export class Guestbook {}
