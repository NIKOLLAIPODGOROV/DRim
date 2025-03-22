import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent {

  action: string = '';
  @Input() dislikesCount: number = 0;
  @Input() likesCount: number = 0;
  @Input() violatesCount: number = 0;

  @Input()comments: CommentType[] = [];
  @Input()comment: CommentType | null = null;

  isActive: boolean = false;
  @Output() onCountLikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountDislikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountViolatesChange: EventEmitter<number> = new EventEmitter<number>();



  constructor(private _snackBar: MatSnackBar) {
  }

  countChangeLike() {
    this.onCountLikesChange.emit(this.likesCount);
  }

  countChangeDisLike() {
    this.onCountDislikesChange.emit(this.dislikesCount);
  }

  countChangeViolate() {
    this.onCountViolatesChange.emit(this.violatesCount);
  }

  dislikeCount(isActive: boolean) {
    if (this.likesCount > 0 && !isActive) {
      this.likesCount--;
    }
    this.dislikesCount++;
    this.action = 'dislike';
    this.countChangeDisLike();
    this._snackBar.open('Ваш голос учтен');
  }

  likeCount(isActive: boolean) {
    this.isActive = true;
    if (this.dislikesCount > 0 && !isActive) {
      this.dislikesCount--;
    }
    this.likesCount++;
    this.action = 'like';
    this.countChangeLike();
    this._snackBar.open('Ваш голос учтен');
  }

  violateCount() {
    this.violatesCount++;
    this.action = 'violate';
    this.countChangeViolate();
    this._snackBar.open('Жалоба отправлена');
  }

}
