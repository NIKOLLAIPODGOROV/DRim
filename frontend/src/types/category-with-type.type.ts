export type CategoryWithTypeType = {
  id: string,
  category: string,
  url: string,
  categories: {
    id: string,
    name: string,
    url: string,
  }[];
  typesUrl?: string[],
}
