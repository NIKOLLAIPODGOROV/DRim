import {Component, Input, OnInit, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {ArticleService} from "../../../shared/services/article.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentTriviaType} from "@angular/compiler-cli/src/ngtsc/typecheck/src/comments";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsType} from "../../../../types/requests.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article!: ArticleType;
  articles: ArticleType[] = [];
  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;
  relatedArticles: ArticleType[] = [];
  @Input() offset: number | null = null;
  @Input() allCounts: number[] = [];
  @Input() text!: string;

  serverStaticPath = environment.serverStaticPath;

  isLoggedIn: boolean = false;
  noComments: boolean = false;

  textForm = this.fb.group({
    text: ['', Validators.required],

  })
  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentService: CommentService,
              private router: Router,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe(data => {
          this.article = data;

          this.articleService.getRelatedArticles(this.article.url)
            .subscribe(data => {
              this.relatedArticles = data as ArticleType[];

              if (!this.relatedArticles) {
                this.router.navigate(['/']);
              }
            });


      if (this.offset && this.offset > 0) {
        this.commentService.getComments(3, this.article.id)
          .subscribe(data => {
            this.allCounts = [];
            for (let i = 1; i <= data.allCounts; i++) {
              this.allCounts.push(i);
            }
            if (!this.comments) {
              this.noComments = true;
            }
            console.log(this.comments);
            return this.comments = data.comments;

          });
      }
    });

    });

    // });

  }

  addComment() {
    if (this.authService.getIsLoggedIn()) {
    if (this.textForm.valid && this.textForm.value.text) {
      const paramsObject = {
        article: this.article.id,
        text: this.textForm.value.text,
      };

      this.commentService.addComment(this.textForm.value.text,this.article.id)
        .subscribe({
          next: (data:DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error(((data as DefaultResponseType).message));
            }
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
      this.textForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }
  }

}
