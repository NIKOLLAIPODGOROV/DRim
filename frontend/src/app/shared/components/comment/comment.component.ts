import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../services/article.service";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {


  count: number = 1;
  article!: ArticleType;
  @Input() comments: CommentType[] = [];
  @Input() comment: CommentType | null = null;
  @Input() offset: number | null = null;

  constructor(private authService: AuthService,
              private commentService: CommentService,
              private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    // this.activatedRoute.params.subscribe(params => {
    //
    //   this.articleService.getArticle(this.article.url)
    //     .subscribe(data => {
    //       this.article.comments = data.comments as CommentType[];
    //
    //     });
    //
    //   if (this.offset && this.offset > 0) {
    //     this.commentService.getComments(3, this.article.id,)
    //       .subscribe(data => {
    //
    //         this.article.comments = data.comments as CommentType[];
    //         this.comments = this.article.comments;
    //
    //       });
    //   }
    //
    // });

  }
}
