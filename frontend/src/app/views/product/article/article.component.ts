import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {FormBuilder} from "@angular/forms";
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
  @Input()comments: CommentType[] = [];
  @Input()comment: CommentType | null = null;
  relatedArticles: ArticleType[] = [];
  @Input() offset: number | null = 3;
  allCounts: number[] = [];
  @Input() text!: string;
  @Input() action: string = '';
  @Output() commentAction: CommentActionType[] = [];

  commentsPerPage = 3;

  likesCount: number = 0;
  dislikesCount: number = 0;
  isLogged: boolean = false;

  get hasComments() {
    return this.comments.length > 0;
  }

get hasMoreThreeComments() {
  return this.comments.length > this.commentsPerPage;
}

  textForm = this.fb.group({
    text: ['']
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
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe(data => {
          this.article = data as ArticleType;
if (this.article.comments && this.article.comments.length > 0) {
  this.hasComments;
}
          if (this.article.comments && this.article.comments.length > 3) {
            this.hasMoreThreeComments;
          }

          this.articleService.getRelatedArticles(this.article.url)
            .subscribe((data: ArticleType[]) => {
              this.relatedArticles = data;
            });

          if (data.comments) {
            this.comments = data.comments as CommentType[];

            this.commentService.getArticleCommentActions(this.article.id)
              .subscribe((data: DefaultResponseType | CommentActionType[]) => {
                if ((data as DefaultResponseType).error) {
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
                // return this.comments;
              });
          }

           // if (this.offset && this.offset > 0) {
           //    this.subscription = this.commentService.getComments(3, this.article.id)
           //      .subscribe(data => {
           //        this.allCounts = [];
           //        for (let i = 1; i <= data.allCounts; i++) {
           //          this.allCounts.push(i);
           //        }
           //        if (this.hasComments) {
           //          this.noComments = true;
           //        }
           //        this.comments = data.comments as CommentType[];

           //      // return this.article.comments;
           //
           //      });
            //}

            return this.article.comments;
        });
    });
  }

  addComment() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавление коментария необходимо авторизоваться');
      return;
    }
      if (this.article && this.textForm.valid && this.textForm.value.text) {
        this.commentService.addComment(this.textForm.value.text, this.article.id)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if ((data as DefaultResponseType).error) {
                throw new Error(((data as DefaultResponseType).message));
              }
              this.textForm.reset();
              this.hasComments;
              this._snackBar.open('Комментарий добавлен');
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
        !this.hasComments;
        this.textForm.markAllAsTouched();
        this._snackBar.open('Заполните необходимые поля');
      }

    this.commentService.getComments(0, this.article.id)
      .subscribe(data => {
        this.allCounts = [];
        for (let i = 1; i <= data.allCounts; i++) {
          this.allCounts.push(i);
        }
          this.hasComments;

        this.comments = data.comments as CommentType[];
      });

   // return this.article.comments;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
