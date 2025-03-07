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
    return this.http.get<CategoryType[]>(environment.api + 'categories')
      .pipe(
        map((items: CategoryType[]) => {
          const array: CategoryWithTypeType[] = [];
          items.forEach((item: CategoryType) => {
            const foundItem = array.find(arrayItem => arrayItem.url === item.url);
            if (foundItem) {
              foundItem.categories.push({
                id: item.id,
                name: item.name,
                url: item.url,
              });
            } else {

              array.push({
                id: item.id,
                category: item.name,
                url: item.url,
                categories: [
                  {
                    id: item.id,
                    name: item.name,
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
