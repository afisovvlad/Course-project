import {Component, OnInit} from '@angular/core';
import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService} from '../../shared/services/articles.service';
import {CategoryService} from '../../shared/services/category.service';
import {CategoryType} from '../../../types/category.type';
import {ActiveParamsType} from '../../../types/active-params.type';
import {ArticlesType} from '../../../types/articles.type';
import {ArticleType} from '../../../types/article.type';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    ArticleCardComponent
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {'categories[]': []};
  articles?: ArticlesType;


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService,
              private categoryService: CategoryService,) {
  }

  ngOnInit() {
    this.categoryService.getCategory()
      .subscribe(categories => {
        if (categories) {
          this.categories = categories;
        }
    });

    this.articlesService.getArticles(this.activeParams)
      .subscribe((data: ArticlesType) => {
        if (data && data.items && data.items.length > 0) {
          this.articles = data;
        }
      });
  }
}
