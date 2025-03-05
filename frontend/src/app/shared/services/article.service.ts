import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable,} from "rxjs";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";
import {CommentType} from "../../../types/comment.type";
import {ActivatedRoute} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ArticleService {


  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute,) { }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url:string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }

  getArticles(params: ActiveParamsType): Observable<{count: number, pages: number, items: ArticleType[]}> {
    return this.http.get<{ count: number, pages: number, items: ArticleType[]}>(environment.api + 'articles', {
    params: params
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

}
