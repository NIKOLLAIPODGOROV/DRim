import {Component, Input, OnInit} from '@angular/core';
import {CategoryService} from "../../../shared/services/category.service";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
 import {debounce, debounceTime} from "rxjs";
// import {CartService} from "../../../shared/services/cart.service";
// import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ArticleService} from "../../../shared/services/article.service";
import {BestArticlesService} from "../../../shared/services/best-articles.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {PopularArticleType} from "../../../../types/popular-article.type";
import {CommentType} from "../../../../types/comment.type";

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})

export class ArticlesComponent implements OnInit {

   categoriesWithType: CategoryWithTypeType[] = [];
   category: string | null = null;
@Input()categories: CategoryType[] = [];
  @Input()articles: ArticleType[] = [];
  @Input()article!: ArticleType;

  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  type: string | null = null;
  pages: number[] = [];
 // cart: any = null;
  open = false;
  isInFavorite = false;
  isActive = false;
  popularArticles: PopularArticleType[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              // private cartService: CartService,
              private bestArticlesService: BestArticlesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticles(params['url'])
        .subscribe(data => {
          this.articles = data.items;
        });

        this.articles = this.articles.map(article => {
          const productInFavorite = this.articles?.find(item => item.category === 'Фрилас');
          if (productInFavorite) {
            // article.isInFavorite = true;
          }
          return article;
        });




      this.articleService.getArticle(this.article.url)
        .subscribe(data => {
          this.article = data;
        });

      this.categoryService.getCategories()
        .subscribe(data  => {
          this.categories = data;
        })

      this.activatedRoute.queryParams.subscribe(params => {
        this.activeParams = ActiveParamsUtils.processParams(params);

        if (this.category) {
          this.open = !!(this.activeParams.categories);
        } else if (this.type) {
          this.open = !!(this.activeParams.categories);
        }
      });

    });


    // this.cartService.getCart()
    //   .subscribe((data: RequestsType | DefaultResponseType) => {
    //     if ((data as DefaultResponseType).error !== undefined) {
    //       throw new Error((data as DefaultResponseType).message);
    //     }
    //
    //     this.cart = data as RequestsType;

        if (this.authService.getIsLoggedIn()) {
          this.bestArticlesService.getPopularArticles()
            .subscribe(
              {
                next:  (data: ArticleType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error = (data as DefaultResponseType).message;
                    this.processCatalog();
                    throw new Error(error);
                  }

                  this.popularArticles = data as ArticleType[];
                  this.processCatalog();
                },
                error: (error) => {
                  this.processCatalog();
                }
              });
        } else {
          this.processCatalog();
        }
    //  });

  }

  toggle(): void {
    this.open = !this.open;
  }


  processCatalog() {
    this.categoryService.getCategoriesWithFilter()
      .subscribe(data => {
        this.categoriesWithType = data;
      })

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtils.processParams(params);

            //убираем дубли категорий
            this.appliedFilters = [];

            this.activeParams.categories.forEach(url => {
                const foundType = this.categoriesWithType.find(item => item.url === url);
                   if (foundType) {
               const filterItem = {
                  name: foundType.category,
                  url: foundType.url
                };

               //Проверяем если элемент уже есть
               if (!this.appliedFilters.some(item => item.url === filterItem.url)) {
                 this.appliedFilters.push(filterItem);
               }
              }
            });

            this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                // if (this.cart && this.cart.items.length > 0) {
                //   this.articles = data.items.map(article => {
                //     if (this.cart) {
                //       const productInCart = this.cart.items.find(item  => item.comments.id === article.id);
                //       if (productInCart) {
                //         article.countInCart = productInCart.quantity;
                //       }
                //     }
                //     return article;
                //   });
                // } else {
                   this.articles = data.items;
                //
                //
                //
                // }

                if (this.popularArticles) {
                  this.articles = this.articles.map(article => {
                    const productInFavorite = this.popularArticles?.find(item => item.id === article.id);
                    if (productInFavorite) {
                      // article.isInFavorite = true;
                    }
                    return article;
                  });
                }

              });
          });

     // });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.url) {
       //  delete this.activeParams[appliedFilter.categories.url];
    } else {
      this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.url);
    }

    this.activeParams.pages = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }


  openPage(page: number) {
    this.activeParams.pages = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.pages && this.activeParams.pages > 1) {
      this.activeParams.pages--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }
  openNextPage() {
    if (this.activeParams.pages && this.activeParams.pages < this.pages.length) {
      this.activeParams.pages++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }
}
