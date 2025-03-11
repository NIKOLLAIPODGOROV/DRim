import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../services/article.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {EActions} from "../../../constants/enums";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  action: string = '';

  @Input() allCounts: number[] = [];
  @Input() likesCount: number = 0;
  @Input() dislikesCount: number = 0;
  @Input() countLike: string = '';
  @Input() countDislike: string = '';
  article!: ArticleType;
  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;
  @Input() offset: number | null = null;
  isLoggedIn: boolean = false;
  noComments: boolean = false;

  constructor(private authService: AuthService,
              private commentService: CommentService,
              private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe(data => {
          this.article.comments = data.comments as CommentType[];
        });

    });

  }

  updateCount(value: number, action: string) {
    if (this.authService.getIsLoggedIn()) {
      this.likesCount = value;
      this.action = action;
      if (this.likesCount && this.comment) {
            this.commentService.applyAction(this.comment.id, this.action)
              .subscribe((data: DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  throw new Error((data as DefaultResponseType).message);
                }
                return this.action;
              });
          }
      }
    }

  protected readonly EActions = EActions;
}
