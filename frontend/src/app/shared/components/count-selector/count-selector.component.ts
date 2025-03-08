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
export class CountSelectorComponent implements OnInit  {


  likesCount!: number;
  action: string = '';
  @Input()countDis: number = 0;
  @Input()countLk: number = 0;
  @Input() countLike: string = 'like';
  @Input() countDislike: string = 'dislike';
  article!: ArticleType;
  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private authService: AuthService,
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

   countChangeLike() {
     this.onCountChange.emit(this.countLk);
  }

  countChangeDisLike() {
    this.onCountChange.emit(this.countDis);
  }

  dislikeCount() {
      this.countDis++;
    this.action = 'dislike';
      this.countChangeDisLike();

    // this.commentService.applyAction(this.dislike)
  }

  likeCount() {
    this.countLk++;
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
