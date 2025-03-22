import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../shared/services/category.service";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime, Subscription,} from "rxjs";
import {AuthService} from "../../../core/auth/auth.service";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {style} from "@angular/animations";

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})

export class ArticlesComponent implements OnInit, OnDestroy  {

  articles: ArticleType[] = [];
  categoriesWithType: CategoryWithTypeType[] = [];
  categoryWithType: CategoryWithTypeType | null = null;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];

   category: CategoryType | null = null;
   categories: CategoryType[] = [];
  article!: ArticleType;

  type: string | null = null;
  pages: number[] = [];
  open: boolean = false;
  isActive: boolean = false;
  popularArticles: ArticleType[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
  }

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticles(params['url'])
        .subscribe(data => {
          this.articles = data.items as ArticleType[];
          this.processCatalog();
        });
    });

    this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data as CategoryType[];
      })

    this.activatedRoute.queryParams.subscribe(params => {
      this.activeParams = ActiveParamsUtils.processParams(params);

      if (this.category && params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
      }
      if (this.categoryWithType && this.categoryWithType.categories
        && this.categoryWithType.categories.length > 0 &&
        this.categoryWithType.categories.some(category => this.activeParams.categories.find(item => category.url === item))) {
        this.open = true;
      }

      if (this.category) {
        this.open = !!(this.activeParams.categories);
      } else if (this.type) {
        this.open = !!(this.activeParams.categories);
      }
    });
    this.processCatalog();
  }

  processCatalog() {
    this.categoryService.getCategoriesWithFilter()
      .subscribe(data => {
        this.categoriesWithType = data as CategoryWithTypeType[];
       // console.log(data);
      })

    this.activatedRoute.queryParams
      // .pipe(
      //   debounceTime(500)
      // )
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

            this.articles = data.items as ArticleType[];

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

    this.activatedRoute.queryParams.subscribe(params => {
      this.activeParams = ActiveParamsUtils.processParams(params);

      if (this.category && params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
      }
      if (this.categoryWithType && this.categoryWithType.categories
        && this.categoryWithType.categories.length > 0 &&
        this.categoryWithType.categories.some(category => this.activeParams.categories.find(item => category.url === item))) {
        this.open = true;
      }
    });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.url && this.category?.url === 'dizain' ) {
       // delete this.activeParams[appliedFilter.url];
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

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, isActive: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !isActive) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && isActive) {
        this.activeParams.categories.push(url);
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (isActive) {
      this.activeParams.categories = [url];
      this.activeParams.categories = [''];
    } else {
      this.activeParams.categories = [''];
    }

    this.activeParams.pages = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
