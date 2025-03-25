import {Component, EventEmitter, Input, Output} from '@angular/core';
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

  @Output() onCountLikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountDislikesChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountViolatesChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _snackBar: MatSnackBar) { }

  countChangeLike() {
    this.onCountLikesChange.emit(this.likesCount);
  }

  countChangeDisLike() {
    this.onCountDislikesChange.emit(this.dislikesCount);
  }

  countChangeViolate() {
    this.onCountViolatesChange.emit(this.violatesCount);
  }

  dislikeCount() {
    this.action = 'dislike';
    this.countChangeDisLike();
    this._snackBar.open('Ваш голос учтен');
  }

  likeCount() {
    this.action = 'like';
    this.countChangeLike();
    this._snackBar.open('Ваш голос учтен');
  }

  violateCount() {
    this.action = 'violate';
    this.countChangeViolate();
    this._snackBar.open('Жалоба отправлена');

    if (this.action) {
      throw new Error('Жалоба уже отправлена');
    }
    this._snackBar.open('Жалоба уже отправлена');
  }
}
