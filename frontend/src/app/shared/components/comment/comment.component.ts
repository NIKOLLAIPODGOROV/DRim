import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../services/article.service";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  action: string = '';
idCom: string | null = null;

  @Input() allCounts: number[] = [];
  @Input()countDis: number = 0;
  @Input()countLk: number = 0;
  @Input() countLike: string = '';
  @Input() countDislike: string = '';
  article!: ArticleType;
  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;
  @Input() offset: number | null = null;

  noComments: boolean = false;
  constructor(private authService: AuthService,
              private commentService: CommentService,
              private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe(data => {
          this.article.comments = data.comments as CommentType[];
        });

    if (this.offset && this.offset > 0) {
      if (this.comment?.id) {
        this.commentService.getComments(3, this.comment.id)
          .subscribe(data => {
            this.allCounts = [];
            for (let i = 1; i <= data.allCounts; i++) {
              this.allCounts.push(i);
            }
            if (!this.comments) {
              this.noComments = true;
            }
            console.log(this.comments);
            return this.comments = data.comments;

          });
      }
      }
        });

  }


  addLike() {
  //   this.commentService.applyAction(this.comment.id, this.action)
  //     .subscribe((data: DefaultResponseType) => {
  //       if ((data as DefaultResponseType).error !== undefined) {
  //         throw new Error((data as DefaultResponseType).message);
  //       }
  //       this.countLike = this.action;
  //     });
   }

  updateCount(value: number) {
    this.countLk = value;
    if (this.countLike) {
       this.action = 'like';
      // this.commentService.applyAction(this.comments.id, this.action)
      //   .subscribe((data: DefaultResponseType) => {
      //     if ((data as DefaultResponseType).error !== undefined) {
      //       throw new Error((data as DefaultResponseType).message);
      //     }
      //
      //      this.countInCart = this.count;
      //   });
    }
  }


}
