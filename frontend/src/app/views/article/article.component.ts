import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {environment} from '../../../environments/environment.development';
import {ArticlesService} from '../../shared/services/articles.service';
import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ArticleType} from '../../../types/article.type';
import {AuthService} from '../../core/services/auth.service';
import {CommentsParamsType} from '../../../types/comments-params.type';
import {CommentsResponseType} from '../../../types/comments-response.type';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    RouterLink,
    ArticleCardComponent
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  readonly environment = environment;

  relatedArticles: ArticleType[] | null = [];
  article!: ArticleType;
  isLoggedIn: boolean = false;
  comments: CommentsResponseType = {};
  commentsParams!: CommentsParamsType;

  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.authService.isLoggedIn$
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });

    this.activatedRoute.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe(article => {
              this.article = article;
          });

        console.log(this.article);

        if (this.article.comments && this.article.comments?.length > 3) {
          this.articlesService.getComments(this.commentsParams)
            .subscribe(comments => {
              this.comments = comments;
            });
        } else {
          this.comments.comments = this.article.comments;
          this.comments.allCount = this.article.commentsCount;
        }

        this.articlesService.getRelatedArticles(params['url'])
          .subscribe(articles => {
            if (articles && articles.length > 0) {
              this.relatedArticles = articles;
            }
          });
      });
  }
}
