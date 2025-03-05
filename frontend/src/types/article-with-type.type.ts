export type ArticleWithType = {
  count: number,
  pages: number,
  items: [
    {
      id: string,
      title: string,
      description: string,
      imag: string,
      date: string,
      category: string,
      url: string,
    }
  ]
  type: string,
}
