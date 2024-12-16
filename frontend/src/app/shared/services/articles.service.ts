import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleType} from '../../../types/article.type';
import {environment} from '../../../environments/environment';
import {ArticlesType} from '../../../types/articles.type';
import {ActiveParamsType} from '../../../types/active-params.type';
import {CommentsParamsType} from '../../../types/comments-params.type';
import {CommentsResponseType} from '../../../types/comments-response.type';
import {AddCommentParamsType} from '../../../types/add-comment-params.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {ActionsCommentType} from '../../../types/actions-comment.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getPopularArticles (): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticles (params: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {
      params: params,
    });
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getComments(params: CommentsParamsType): Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(environment.api + 'comments', {
      params: params,
    });
  }

  addComment(params: AddCommentParamsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: params.text,
      article: params.article,
    });
  }

  addAction(action: string, commentId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    });
  }

  getActionForComments(articleId: string): Observable<ActionsCommentType[]> {
    return this.http.get<ActionsCommentType[]>(environment.api + 'comments/article-comment-actions', {
      params: {
        articleId: articleId,
      }
    });
  }
}
