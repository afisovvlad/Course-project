import {Component, Input} from '@angular/core';
import {ServiceType} from '../../../../types/service.type';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {
  articleCard: boolean = true;

  @Input() service?: ServiceType;

  constructor() {
    this.articleCard = !this.service;
  }

}
