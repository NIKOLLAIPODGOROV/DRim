import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentType} from "../../../types/comment.type";
import {ArticleType} from "../../../types/article.type";
import {CommentActionType} from "../../../types/comment-action.type";
import {ActionType} from "../../../types/action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(offset: number | null, article: string): Observable<{ allCounts: number, comments: CommentType[] }> {
    return this.http.get<{ allCounts: number, comments: CommentType[] }>(environment.api + 'comments');
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text, article
    });
  }

  applyAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {
      action
    });
  }

  getActionForComment(id: string, actions: string): Observable<DefaultResponseType | CommentActionType> {
    return this.http.get<DefaultResponseType | CommentActionType>(environment.api + 'comments/' + id + '/actions',);
  }

  getArticleCommentActions(articleId: string): Observable<DefaultResponseType | {comment: string, action: string}> {
    return this.http.get<DefaultResponseType | {comment: string, action: string}>(environment.api + 'comments/article-comment-actions?articleId=' + articleId,);
  }
}
