import {CommentType} from "./comment.type";
import {ArticleType} from "./article.type";

export type ArticleWithCommentType = {
text: string,
  comments: CommentType[],
  article: ArticleType[],
}
