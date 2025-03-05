import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {ArticleType} from "../../../../types/article.type";
// import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {RequestsType} from "../../../../types/requests.type";

import {ArticleService} from "../../services/article.service";
import {CategoryType} from "../../../../types/category.type";
import {debounceTime} from "rxjs";
import {ActiveParamsUtils} from "../../utils/active-params.utils";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoryService} from "../../services/category.service";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {CommentType} from "../../../../types/comment.type";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() categories: CategoryType[] = [];
  @Input() category!: CategoryType;
  @Input() article!: ArticleType;

  serverStaticPath = environment.serverStaticPath;

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private router: Router,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    // this.activatedRoute.params.subscribe(params => {
    //   this.articleService.getArticle(this.article.url)
    //     .subscribe(data => {
    //       this.article = data;
    //     })
    //
    //   this.categoryService.getCategories()
    //     .subscribe(data => {
    //     this.categories = data as CategoryType[];
    //   })
    //
    //   if (this.article.category && this.article.category === 'Фриланс') {
    //    this.category.url = 'frilans';
    //   }
    //
    //
    //
    //
    //   this.articleService.getRelatedArticles(this.article.url)
    //     .subscribe(data => {
    //       this.relatedArticles = data;
    //
    //       if (!this.relatedArticles) {
    //         this.router.navigate(['/']);
    //       }
    //     });
    //
    //
    //
    //   //       this.articleService.getRelatedArticles(this.article.url)
    //   //           if (this.authService.getIsLoggedIn()) {
    //   //             this.articleService.getRelatedArticles(this.article.url)
    //   //               .subscribe((data: ArticleType[]) => {
    //   //                 this.relatedArticles = data;
    //   //               });
    //   //           }
    //   //     });
    //   //
    //   // });
    // });
  }
}
