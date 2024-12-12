import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-footer',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private modalService: ModalService) {
  }

  clickToCallMe(): void {
    this.modalService.modalHandler$.next(true);
  }
}
