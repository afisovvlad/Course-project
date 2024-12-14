import {Component, EventEmitter, Output} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Output() callModal = new EventEmitter<boolean>();

  constructor() {
  }

  clickToCallMe(): void {
    this.callModal.emit(true);
  }
}
