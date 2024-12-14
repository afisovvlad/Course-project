import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService} from '../../shared/services/articles.service';
import {CategoryService} from '../../shared/services/category.service';
import {CategoryType} from '../../../types/category.type';
import {ActiveParamsType} from '../../../types/active-params.type';
import {ArticlesType} from '../../../types/articles.type';
import {ActiveParamsUtil} from '../../shared/util/active-params.util';
import {AppliedCategoryType} from '../../../types/applied-category.type';
import {ScrollToUtil} from '../../shared/util/scroll-to.util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    ArticleCardComponent
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnDestroy {
  @ViewChild('blogTitle') blogTitleElement!: ElementRef;

  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  articles?: ArticlesType;
  appliedCategories: AppliedCategoryType[] = [];
  pages: number[] = [];
  filterOpen: boolean = false;
  updateKey: number = 0;

private subs: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService,
              private categoryService: CategoryService,) {
  }

  ngOnInit() {
    this.subs.add(this.categoryService.getCategory()
      .subscribe((categories: CategoryType[]) => {
        if (categories) {
          this.categories = categories;
        }
      }));

    this.subs.add(this.activatedRoute.queryParams
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

        this.subs.add(this.articlesService.getArticles(this.activeParams)
          .subscribe((data: ArticlesType) => {
            if (data.pages < this.activeParams.page!) {
              this.activeParams.page = 1;
              this.router.navigate(['/blog'], {
                queryParams: this.activeParams
              });
              return;
            }

            if (data && data.items && data.items.length > 0) {
              this.articles = data;
            }

            this.pages = [];
            for (let i = 1; i <= data.pages; i++) {
              this.pages.push(i);
            }

            if (this.blogTitleElement) {
              ScrollToUtil.scrollTo(this.blogTitleElement);
            }
          }));
      }));
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  clickToCategory(category: string): void {
    if (this.activeParams.categories!.includes(category)) {
      this.activeParams.categories = this.activeParams.categories!.filter(item => item !== category);
    } else {
      this.activeParams.categories!.push(category);
    }

    if (this.activeParams.categories!.length > 0) {
      this.activeParams = {
        ...this.activeParams,
        updateKey: JSON.stringify(this.updateKey + 1),
      }
      this.updateKey++;
    }


    this.router.navigate(['/blog'], {
      queryParams: this.activeParams,
    }).then();

    this.activeParams = {
      page: this.activeParams.page,
      categories: this.activeParams.categories,
    }
  }

  removeAppliedCategory(url: string): void {
    this.appliedCategories = this.appliedCategories.filter(item => item.url !== url);
    this.activeParams.categories = this.activeParams.categories?.filter(item => item !== url);
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  goNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams,
      }).then();
    }
  }

  goPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      }).then();
    }
  }

  clickToPage(pageNum: number): void {
    this.activeParams.page = pageNum;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    }).then();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
