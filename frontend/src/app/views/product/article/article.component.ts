import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {CommentActionType} from "../../../../types/comment-action.type";


@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  article!: ArticleType;
  articles: ArticleType[] = [];
  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;
  relatedArticles: ArticleType[] = [];
  @Input() offset: number | null = null;
  @Input() allCounts: number[] = [];
  @Input() text!: string;
  @Input() action: string = '';
  commentAction: CommentActionType[] = [];

  likesCount: number | null = null;
  dislikesCount: number | null = null;
  isLogged: boolean = false;
  noComments: boolean = false;

  get hasComments() {
    return this.comments.length > 0;
  }

  textForm = this.fb.group({
    text: ['', Validators.required]
  });

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentService: CommentService,
              private router: Router,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    // this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
    //   this.isLogged = isLoggedIn;
    this.activatedRoute.params.subscribe(params => {
      this.subscription = this.articleService.getArticle(params['url'])
        .subscribe(data => {
          this.article = data as ArticleType;
          // if (this.hasComments) {
          //   this.noComments = true;
          // }

          this.subscription = this.subscription = this.articleService.getRelatedArticles(this.article.url)
            .subscribe((data: ArticleType[]) => {
              this.relatedArticles = data;
            });

          if (this.offset && this.offset > 0) {
            this.subscription = this.commentService.getComments(3, this.article.id)
              .subscribe(data => {
                this.allCounts = [];
                for (let i = 1; i <= data.allCounts; i++) {
                  this.allCounts.push(i);
                }
                if (this.hasComments) {
                  this.noComments = true;
                }
                this.comments = data.comments as CommentType[];
              });
          }
          if (data.comments) {
            this.comments = data.comments as CommentType[];

            this.subscription = this.commentService.getArticleCommentActions(this.article.id)
              .subscribe((data: DefaultResponseType | CommentActionType[]) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  throw new Error(((data as DefaultResponseType).message));
                }
                //здесь нужно сохранить данные о действиях и соотнести их с данными о коментариях по id
                this.commentAction = data as CommentActionType[];

                this.comments = this.comments.map(comment => {
                  const userAction = this.commentAction.find(action => action.comment === comment.id);
                  return {
                    ...comment, // Добавляем данные комментария
                    userLiked: userAction?.action === 'like', // Был ли лайкнут
                    userDisliked: userAction?.action === 'dislike' // Был ли дизлайкнут
                  };

                });

              });

          }
          if (this.comments) {
            this.article.comments = this.comments;
          }
          console.log(this.comments);
        });
    });
    // });
  }

  addComment() {
    if (this.isLogged) {
      if (this.article && this.textForm.valid && this.textForm.value.text) {
        this.subscription = this.commentService.addComment(this.textForm.value.text, this.article.id)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error(((data as DefaultResponseType).message));
              }
              this._snackBar.open('Комментарий добавлен');

              this.commentService.getComments(3, this.article.id)
                .subscribe(data => {
                  this.allCounts = [];
                  for (let i = 1; i <= data.allCounts; i++) {
                    this.allCounts.push(i);
                  }
                  this.comments = data.comments as CommentType[];
                });
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Ошибка добавления комментария');
              }
            }
          });
      } else {
        this.textForm.markAllAsTouched();
        this._snackBar.open('Заполните необходимые поля');
      }
    }

  }
  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
