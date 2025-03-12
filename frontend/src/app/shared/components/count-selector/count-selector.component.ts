import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../services/article.service";
import {pipe} from "rxjs";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {


  @Input() action: string = '';
  @Input() dislikesCount: number = 0;
  @Input() likesCount: number = 0;
  @Input() countLike: string = 'like';
  @Input() countDislike: string = 'dislike';
  article!: ArticleType;

  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;
  @Input() offset: number | null = null;
  @Input() allCounts: number[] = [];
  noComments: boolean = false;
  isLoggedIn: boolean = false;
  @Output() onCountLikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountDislikesChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.activatedRoute.params?.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe(data => {
          this.article.comments = data.comments as CommentType[];
        });

    });

  }

  countChangeLike() {
    this.onCountLikesChange.emit(this.likesCount);
  }

  countChangeDisLike() {
    this.onCountDislikesChange.emit(this.dislikesCount);
  }

  dislikeCount() {
    this.dislikesCount++;
    this.action = 'dislike';
    this.countChangeDisLike();
    if (this.comment) {
      this.isLoggedIn = true;
      this.commentService.applyAction(this.comment.id, this.action)
        .subscribe((data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.countLike = this.action;
        });
    }
  }

  likeCount() {
    this.likesCount++;
    this.action = 'like';
    this.countChangeLike()
    if (this.comment) {
      this.commentService.applyAction(this.comment.id, this.action)
        .subscribe((data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.countLike = this.action;
        });
    }
  }

}
