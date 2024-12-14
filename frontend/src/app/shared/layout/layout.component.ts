import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject, OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './footer/footer.component';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {MatDialog, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {RequestService} from '../services/request.service';
import {DefaultResponseType} from '../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {NgStyle} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogClose,
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    NgStyle,
  ],
  providers: [
    provideNgxMask(),
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutComponent implements OnDestroy{
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  unsuccessfulConsultationRequest: string = '';
  successfulConsultationRequest: boolean = false;
  consultationDialogRef: MatDialogRef<any> | null = null;

  private subs: Subscription = new Subscription();

  @ViewChild('consultationDialog') consultationDialog!: TemplateRef<ElementRef>;

  consultationForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(private requestService: RequestService) {
  }

  callModal() {
    this.consultationDialogRef = this.dialog.open(this.consultationDialog, {
      maxWidth: 'unset',
      minWidth: 'unset',
      maxHeight: 'unset',
      minHeight: 'unset'
    });

    if (this.consultationDialogRef) {
      this.subs.add(this.consultationDialogRef.afterClosed().subscribe(() => {
        this.closeConsultationModal();
      }));
    }
  }

  consultationRequest() {
    if (this.consultationForm.valid) {
      if (this.consultationForm.value.name && this.consultationForm.value.phone) {
        this.subs.add(this.requestService.consultationRequest(this.consultationForm.value.name, this.consultationForm.value.phone)
          .subscribe({
            next: ((data: DefaultResponseType) => {
              if (data.error) {
                this.unsuccessfulConsultationRequest = 'Произошла ошибка при отправке формы, попробуйте еще раз.'
              } else {
                this.successfulConsultationRequest = true;
              }
            }),

            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error) {
                this.unsuccessfulConsultationRequest = 'Произошла ошибка при отправке формы, попробуйте еще раз.'
              }
            }
          }));
      }
    } else {
      this.consultationForm.markAllAsTouched();
    }
  }

  closeConsultationModal(): void {
    this.consultationDialogRef?.close();
    this.successfulConsultationRequest = false;
    this.unsuccessfulConsultationRequest = '';
    this.consultationForm.markAsUntouched();
    this.consultationForm.markAsPristine();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
