import { Injectable, inject } from '@angular/core';
import { TranslationService } from './translation.service';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SELECT']);

@Injectable({ providedIn: 'root' })
export class DomTranslatorService {
  private readonly translationService = inject(TranslationService);

  private observer: MutationObserver | null = null;
  private readonly inFlight = new WeakSet<Node>();

  start(): void {
    if (this.observer) {
      return;
    }

    this.translateSubtree(document.body);

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => this.translateSubtree(node));
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  retranslate(): void {
    const translated = document.body.querySelectorAll<HTMLElement>('[data-original-text]');
    translated.forEach((el) => {
      el.textContent = el.dataset['originalText'] ?? el.textContent;
      el.removeAttribute('data-original-text');
    });

    this.translateSubtree(document.body);
  }

  private translateSubtree(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (SKIP_TAGS.has(element.tagName)) {
        return;
      }
      element.childNodes.forEach((child) => this.translateSubtree(child));
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      this.translateTextNode(node as Text);
    }
  }

  private translateTextNode(node: Text): void {
    const text = node.textContent?.trim();
    const parent = node.parentElement;

    if (!text || !parent || this.inFlight.has(node)) {
      return;
    }

    this.inFlight.add(node);
    const original = node.textContent ?? '';

    this.translationService
      .translate(text)
      .then((translated) => {
        if (translated !== text) {
          parent.setAttribute('data-original-text', original);
          node.textContent = original.replace(text, translated);
        }
      })
      .finally(() => this.inFlight.delete(node));
  }
}
