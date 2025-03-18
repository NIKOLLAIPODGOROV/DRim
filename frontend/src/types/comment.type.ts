export type CommentType = {
      id: string,
      text: string,
      date: string,
      likesCount: number | null,
      dislikesCount: number | null,
      violatesCount?: number | null,
      user: {
        id: string,
        name: string,
      }
      action?: string,
}
