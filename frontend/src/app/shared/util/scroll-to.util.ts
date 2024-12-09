import {ElementRef} from '@angular/core';

export class ScrollToUtil {
  static scrollTo(element: ElementRef<HTMLElement>) {
    element.nativeElement.scrollIntoView({ behavior: 'smooth' });
    console.log(element);
  }
}
