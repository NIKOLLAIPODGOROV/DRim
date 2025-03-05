import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../services/article.service";
import {pipe} from "rxjs";
import {CommentType} from "../../../../types/comment.type";

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {

  comments: CommentType[] = [];
  likesCount!: number;

  @Input() count: number = 1;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {

  }

   countChange() {
    this.onCountChange.emit(this.count);
  }

  dislikeCount() {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  likeCount() {
    this.count++;
    this.countChange();
  }
}
