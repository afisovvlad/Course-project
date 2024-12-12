import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ServiceType} from '../../../types/service.type';
import {ArticlesService} from '../../shared/services/articles.service';
import {ArticleType} from '../../../types/article.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RouterLink} from '@angular/router';
import {MatDialog, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {NgStyle} from '@angular/common';
import {RequestService} from '../../shared/services/request.service';
import {DefaultResponseType} from '../../../types/default-response.type';
import {ModalService} from '../../shared/services/modal.service';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatDialogClose,
    ArticleCardComponent,
    RouterLink,
    MatDialogContent,
    NgxMaskDirective,
    NgStyle,
    ReactiveFormsModule,
    CarouselModule,
  ],
  providers: [
    provideNgxMask(),
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent implements OnInit {
  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  @ViewChild('orderDialog') orderDialog!: TemplateRef<ElementRef>;
  @ViewChild('consultationDialog') consultationDialog!: TemplateRef<ElementRef>;
  @ViewChild('orderDialogSelect') orderDialogSelect!: HTMLSelectElement;
  popularArticles: ArticleType[] = [];

  mainCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      }
    }
  }

  reviewsCustomOptions: OwlOptions = {
    loop: true,
    margin: 26,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 3
      }
    }
  }

  orderDialogRef: MatDialogRef<any> | null = null;
  consultationDialogRef: MatDialogRef<any> | null = null;
  servicesArr: ServiceType[] = [
    {
      image: '/images/services-image-1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽'
    },
    {
      image: '/images/services-image-2.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽'
    },
    {
      image: '/images/services-image-3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽'
    },
    {
      image: '/images/services-image-4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽'
    },
  ];
  unsuccessfulOrderRequest: string = '';
  unsuccessfulConsultationRequest: string = '';
  successfulOrderRequest: boolean = false;
  successfulConsultationRequest: boolean = false;

  orderForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(10)]]
  });

  consultationForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(private articleService: ArticlesService,
              private requestService: RequestService,
              private modalService: ModalService) {
  }

  ngOnInit() {
    this.articleService.getPopularArticles()
      .subscribe({
        next: ((data: ArticleType[]) => {
          this.popularArticles = data;
        }),

        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка запроса');
          }
        }
      });

    this.modalService.modalHandler$.subscribe(() => {
      this.consultationDialogRef = this.dialog.open(this.consultationDialog, {
        maxWidth: 'unset',
        minWidth: 'unset',
        maxHeight: 'unset',
        minHeight: 'unset'
      });
    });
  }

  showModalService(service: string) {
    this.orderDialogRef = this.dialog.open(this.orderDialog, {
      maxWidth: 'unset',
      minWidth: 'unset',
      maxHeight: 'unset',
      minHeight: 'unset'
    });
    setTimeout(() => {
      const orderSelectElement = document.getElementById('dialog-form-select') as HTMLSelectElement;
      const optionsSelectElement = Array.from(orderSelectElement.options);
      optionsSelectElement.find(option => option.value === service)!.selected = true;
    }, 0)
  }

  orderRequest() {
    if (this.orderForm.valid) {
      const orderSelectElement = document.getElementById('dialog-form-select') as HTMLSelectElement;

      if (this.orderForm.value.name && this.orderForm.value.phone && orderSelectElement.value) {
        this.requestService.orderRequest(this.orderForm.value.name, this.orderForm.value.phone, orderSelectElement.value)
          .subscribe({
            next: ((data: DefaultResponseType) => {
              if (data.error) {
                this.unsuccessfulOrderRequest = 'Произошла ошибка при отправке формы, попробуйте еще раз.'
              } else {
                this.successfulOrderRequest = true;
              }
            }),

            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error) {
                this.unsuccessfulOrderRequest = 'Произошла ошибка при отправке формы, попробуйте еще раз.'
              }
            }
          });
      }
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  consultationRequest() {
    if (this.consultationForm.valid) {
      if (this.consultationForm.value.name && this.consultationForm.value.phone) {
        this.requestService.consultationRequest(this.consultationForm.value.name, this.consultationForm.value.phone)
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
          });
      }
    } else {
      this.consultationForm.markAllAsTouched();
    }
  }

  closeOrderModal(): void {
    this.orderDialogRef?.close();
    this.successfulOrderRequest = false;
    this.unsuccessfulOrderRequest = '';
  }

  closeConsultationModal(): void {
    this.consultationDialogRef?.close();
    this.successfulConsultationRequest = false;
    this.unsuccessfulConsultationRequest = '';
  }
}
