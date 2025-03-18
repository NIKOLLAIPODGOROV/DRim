import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent {

  action: string = '';
  @Input() dislikesCount: number = 0;
  @Output() likesCount: number = 0;
  @Input() countLike: string = 'like';
  @Input() countDislike: string = 'dislike';

  isLoggedIn: boolean = false;
  @Output() onCountLikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountDislikesChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
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
  }

  likeCount() {
    this.likesCount++;
    this.action = 'like';
    this.countChangeLike();
  }
}
