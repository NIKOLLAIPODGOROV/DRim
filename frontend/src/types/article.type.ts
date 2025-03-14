import {CommentType} from "./comment.type";

export type ArticleType = {
text?: string,
  comments?: CommentType[],
  commentsCount?: string,
      id: string,
      title?: string,
      description?: string,
      image?: string,
      date: string,
      category: string,
      url: string,
}
