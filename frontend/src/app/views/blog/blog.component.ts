import {Component, OnInit} from '@angular/core';
import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService} from '../../shared/services/articles.service';
import {CategoryService} from '../../shared/services/category.service';
import {CategoryType} from '../../../types/category.type';
import {ActiveParamsType} from '../../../types/active-params.type';
import {ArticlesType} from '../../../types/articles.type';
import {ActiveParamsUtil} from '../../shared/util/active-params.util';
import {AppliedCategoryType} from '../../../types/applied-category.type';

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
  activeParams: ActiveParamsType = {categories: []};
  articles?: ArticlesType;
  appliedCategories: AppliedCategoryType[] = [];


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService,
              private categoryService: CategoryService,) {
  }

  ngOnInit() {
    this.categoryService.getCategory()
      .subscribe((categories: CategoryType[]) => {
        if (categories) {
          this.categories = categories;
        }
    });

    this.activatedRoute.queryParams
      .subscribe((params) => {
        if (params) {
          this.activeParams = ActiveParamsUtil.processParams(params);
        }

        this.appliedCategories = [];
        if (this.activeParams.categories && this.activeParams.categories.length > 0) {
          this.activeParams.categories.forEach((category) => {
            const foundCategory = this.categories.find(item => item.url === category);
            if (foundCategory) {
              this.appliedCategories.push({
                name: foundCategory.name,
                url: foundCategory.url,
              });
            }
          });
        }

        this.articlesService.getArticles(this.activeParams)
          .subscribe((data: ArticlesType) => {
            if (data.pages < this.activeParams.page!) {
              this.activeParams.page = 1;
              this.router.navigate(['/blog'], {
                queryParams: this.activeParams,
              });
              return;
            }

            if (data && data.items && data.items.length > 0) {
              this.articles = data;
            }
          });
      });
  }

  clickToCategory(category: string): void {
    if (this.activeParams.categories!.includes(category)) {
      console.log(this.activeParams.categories);
      this.activeParams.categories = this.activeParams.categories!.filter(item => item !== category);
    } else {
      console.log(this.activeParams.categories);
      this.activeParams.categories!.push(category);
    }
    console.log(this.activeParams.categories);

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams,
    });
  }

  removeAppliedCategory(url: string): void {
    this.appliedCategories.filter(item => item.url !== url);
    this.activeParams.categories?.filter(item => item !== url);
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams,
    });
  }
}
