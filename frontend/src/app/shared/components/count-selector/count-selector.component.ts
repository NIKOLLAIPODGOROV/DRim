import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../services/article.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
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
  isLoggedIn: boolean = false;
  @Output() onCountLikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountDislikesChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private commentService: CommentService) {
  }

  ngOnInit(): void {
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
          this.countDislike = this.action;
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
