import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {environment} from '../../../environments/environment.development';
import {ArticlesService} from '../../shared/services/articles.service';
import {ArticleCardComponent} from '../../shared/components/article-card/article-card.component';
import {ArticleType} from '../../../types/article.type';
import {AuthService} from '../../core/services/auth.service';
import {CommentsParamsType} from '../../../types/comments-params.type';
import {CommentsResponseType} from '../../../types/comments-response.type';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgStyle} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {ActionsCommentType} from '../../../types/actions-comment.type';
import {Subscription} from 'rxjs';
import {ActionType} from '../../../types/action.type';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    RouterLink,
    ArticleCardComponent,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, OnDestroy {
  readonly environment = environment;

  relatedArticles: ArticleType[] | null = [];
  article: ArticleType;
  isLoggedIn: boolean = false;
  comments: CommentsResponseType = {};
  commentsParams: CommentsParamsType;
  commentForm!: FormGroup;
  actionsForComments: ActionsCommentType[] = [];
  private _snackBar = inject(MatSnackBar);

  private subs: Subscription = new Subscription();
  protected readonly actionType = ActionType;

  @ViewChild('textAreaElement') textAreaElement!: ElementRef<HTMLTextAreaElement>;

  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.isLoggedIn = this.authService.getIsLoggedIn();

    this.article = {
      text: '',
      comments: [],
      commentsCount: 0,
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: ''
    }

    this.commentsParams = {
      offset: 3,
      article: '',
    }
  }

  ngOnInit() {
    this.subs.add(this.authService.isLoggedIn$
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      }));

    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });

    this.subs.add(this.activatedRoute.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe(article => {
            this.article = article;
            this.commentsParams.article = this.article.id;
            this.comments.comments = this.article.comments;
            this.comments.allCount = this.article.commentsCount;

            if (this.isLoggedIn) {
              this.articlesService.getActionForComments(this.article.id)
                .subscribe((response) => {
                  if (response && response.length > 0) {
                    this.actionsForComments = response;
                  }
                });
              this.findActiveAction();
            }
          });

        this.articlesService.getRelatedArticles(params['url'])
          .subscribe(articles => {
            if (articles && articles.length > 0) {
              this.relatedArticles = articles;
            }
          });
      }));
  }

  addComments() {
    this.getComments();
    if (this.commentsParams.offset) {
      this.commentsParams.offset += 10;
    }
  }

  addComment() {
    if (this.commentForm.valid) {
      this.subs.add(this.articlesService.addComment({
        text: this.textAreaElement.nativeElement.value,
        article: this.article.id
      })
        .subscribe({
          next: (response) => {
            if (response.error) {
              this._snackBar.open(response.message);
            } else {
              if (this.commentsParams.offset !== undefined) {
                this.commentForm.reset();
                this.commentsParams.offset = 0;
                this.getComments(true);
                this._snackBar.open('Ваш комментарий успешно опубликован!');
              }
            }
          },

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка добавления комментария');
            }
          }
        }));
    } else {
      this.textAreaElement.nativeElement.style.borderColor = 'red';
      this._snackBar.open('Чтобы оставить комментарий заполните поле');
      setTimeout(() => {
        this.textAreaElement.nativeElement.style.borderColor = '';
      }, 2700);
    }
  }

  addActionForComment(action: ActionType, commentId: string) {
    if (this.isLoggedIn) {
      this.subs.add(this.articlesService.addAction(action, commentId)
        .subscribe({
          next: (response) => {
            if (response.error) {
              this._snackBar.open(response.message);
            } else {
              if (action !== this.actionType.violate) {
                this._snackBar.open('Ваш голос учтен');
                this.articlesService.getActionForComments(this.article.id)
                  .subscribe((response) => {
                    if (response) {
                      this.actionsForComments = response;
                      this.findActiveAction();
                    }
                  });
              } else {
                this._snackBar.open('Жалоба отправлена');
              }
            }
          },

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка добавления реакции');
            }
          }
        }));
    } else {
      this._snackBar.open('Чтобы оставить реакцию или пожаловаться необходимо авторизоваться');
    }
  }

  formatingDate(data: string): string {
    return new Date(data).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '');
  }

  getComments(addComment: boolean = false) {
    this.subs.add(this.articlesService.getComments(this.commentsParams)
      .subscribe(comments => {
        if (comments && comments.comments && comments.comments.length > 0 && this.comments.comments) {
          if (addComment) {
            this.comments.comments = comments.comments.slice(0, 3);
            this.comments.allCount = comments.allCount;
            this.commentsParams.offset = 3;
          } else {
            this.comments.comments = this.comments.comments.concat(comments.comments);
          }
          this.findActiveAction();
        }
      }));
  }

  findActiveAction() {
    if (this.isLoggedIn) {
      this.actionsForComments.forEach(item => {
        const findComment = this.comments.comments?.find(comment => comment.id === item.comment);
        if (findComment) {
          findComment.activeAction = findComment.activeAction ? '' : findComment.activeAction = item.action;
        }
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
