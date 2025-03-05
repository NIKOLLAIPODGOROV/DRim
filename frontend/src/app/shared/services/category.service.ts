import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, pipe} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {TypeType} from "../../../types/type.type";
import {CategoryWithTypeType} from "../../../types/category-with-type.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }


getCategories(): Observable<CategoryType[]> {
  return this.http.get<CategoryType[]>(environment.api + 'categories');
}

  getCategoriesWithFilter(): Observable<CategoryWithTypeType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles')
      .pipe(
        map((items: ArticleType[]) => {
          const array: CategoryWithTypeType[] = [];
          items.forEach((item: ArticleType) => {
            const foundItem = array.find(arrayItem => arrayItem.category === item.category);
            if (foundItem) {
              foundItem.categories.push({
                id: item.id,
                name: item.category,
                url: item.url,
              });
            } else {

              array.push({
                id: item.id,
                category: item.category,
                url: item.url,
                categories: [
                  {
                    id: item.id,
                    name: item.category,
                    url: item.url,
                  }]
              });
            }
          });
          return array;
        })
      );
  }
}
