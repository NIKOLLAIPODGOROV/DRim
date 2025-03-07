import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../services/article.service";
import {pipe} from "rxjs";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent {

  comments: CommentType[] = [];
  likesCount!: number;

  @Input()countDis: number = 0;
  @Input()countLk: number = 0;
  @Input() countLike: string = 'like';
  @Input() countDislike: string = 'dislike';

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private articleService: ArticleService,
              private commentService: CommentService) {
  }

   countChangeLike() {
     this.onCountChange.emit(this.countLk);
  }

  countChangeDisLike() {
    this.onCountChange.emit(this.countDis);
  }

  dislikeCount() {
      this.countDis++;
      this.countChangeDisLike();

    // this.commentService.applyAction(this.dislike)
  }

  likeCount() {
    this.countLk++;
    this.countChangeLike()
    // this.commentService.applyAction(this.countLike)
  }

}
