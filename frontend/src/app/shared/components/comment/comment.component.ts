import {Component, Input, OnDestroy} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {EActions} from "../../../constants/enums";
import {Subscription} from "rxjs";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnDestroy {

  @Input() comment!: CommentType;
  @Input() userAction: string | undefined = undefined;

  protected readonly EActions = EActions;

  constructor(private commentService: CommentService) { }

  private subscription: Subscription | null = null;

  updateCount(action: 'like' | 'dislike' | 'violate') {
    const isRemoving = this.userAction === action; // Убираем реакцию, если уже была

    if (this.userAction === 'like' && this.comment.likesCount > 0) {
      this.comment.likesCount--; //Снимаем лайк, если был
    }
    if (this.userAction === 'dislike' && this.comment.dislikesCount > 0) {
      this.comment.dislikesCount--; // Снимаем дизлайк если, был
    }

    if (!isRemoving) {
      action === 'like' ? this.comment.likesCount++ : this.comment.dislikesCount++; // Добавляем новую реакцию
      this.userAction = action;
    } else {
      this.userAction = undefined; // Полностью убираем реакцию
    }

    this.subscription = this.commentService.applyAction(this.comment.id, isRemoving ? 'remove' : action)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
      });
  }
    ngOnDestroy() {
      this.subscription?.unsubscribe()
    }
}

