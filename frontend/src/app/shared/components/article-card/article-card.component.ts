import {Component, Input, OnInit} from '@angular/core';
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
export class ArticleCardComponent implements OnInit{
  isArticleCard: boolean = true;

  @Input() serviceCard: ServiceType | null = null;

  constructor() {
  }

  ngOnInit() {
    this.isArticleCard = !this.serviceCard;
  }
}
