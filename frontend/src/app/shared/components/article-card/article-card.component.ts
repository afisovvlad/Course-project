import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServiceType} from '../../../../types/service.type';
import {RouterLink} from '@angular/router';
import {ArticleType} from '../../../../types/article.type';
import {environment} from '../../../../environments/environment.development';

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
  // @ts-ignore
  @Output() detailServiceCategory = new EventEmitter()<string>;
  isArticleCard: boolean = true;
  environment = environment;

  @Input() serviceCard: ServiceType | null = null;
  @Input() article: ArticleType | null = null;

  constructor() {
    this.isArticleCard = !this.serviceCard;
  }

  detailsService (category: string) {
    this.detailServiceCategory.emit(category);
  }
}
