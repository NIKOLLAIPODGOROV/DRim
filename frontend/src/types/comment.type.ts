export type CommentType = {
      id: string,
      text: string,
      date: string,
      likesCount: number,
      dislikesCount: number,
      violatesCount?: number,
      user: {
        id: string,
        name: string,
      }
      action?: string,
}
