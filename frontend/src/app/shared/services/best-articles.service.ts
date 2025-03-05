import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
// import {PopularArticlesType} from "../../../types/popular-articles.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class BestArticlesService {

  constructor(private http: HttpClient) { }

  getPopularArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/top');
  }

  getRelatedArticles(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/related/' + url);
  }

  // removeFavorite(productId: string): Observable<DefaultResponseType> {
  //   return this.http.delete<DefaultResponseType>(environment.api + 'top', {body: {productId}});
  // }

}
