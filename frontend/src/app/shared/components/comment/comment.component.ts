import {Component, Input, OnDestroy, Output} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {EActions} from "../../../constants/enums";
import {Subscription} from "rxjs";
import {CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnDestroy {

  action: string = '';

  @Input() likesCount: number | null = null;
  @Input() dislikesCount: number | null = null;
  @Input() violatesCount: number | null = null;
  @Input() countLike: string = '';
  @Input() countDislike: string = '';
  @Input() comments: CommentType[] = [];
  @Input() comment!: CommentType;
  @Output() commentAction: CommentActionType[] = [];
  isLoggedIn: boolean = false;

  protected readonly EActions = EActions;
  constructor(private authService: AuthService,
              private commentService: CommentService) {
  }

  private subscription: Subscription | null = null;

  updateCount(value: number, action: string) {
      this.likesCount = value;
      this.action = action;
      if (this.likesCount && this.comment) {
        this.commentService.applyAction(this.comment.id, this.action)
          .subscribe((data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
          // return this.action;
          });
      }
      if (this.dislikesCount) {
        this.dislikesCount++
      } else if (this.violatesCount){
        this.violatesCount++;
      }
    return this.action;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
