import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import Swiper from 'swiper/bundle';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css'

import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ServiceType} from '../../../types/service.type';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    ArticleCardComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent  implements OnInit {
  swiper!: Swiper;

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

  constructor() {

  }

  ngOnInit() {
    this.swiper = new Swiper('.swiper', {
      loop: true,

      modules: [Pagination, Navigation],

      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });


  }
}
