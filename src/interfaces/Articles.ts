export interface RootState {
  articles: Article[]
  article: Article
  articleForm: ArticleForm
}

export interface Article {
  id: number
  arti_title: string
  arti_content: string
  arti_order: number | null
  cate_id: number | null
  articles_tags: {
    array: number[]
    values: TagsValue[]
  }
}

export interface ArticleForm {
  arti_title: string
  arti_content: string
  arti_order: number | null
  cate_id: number | null
  articles_tags: {
    array: number[]
    values: TagsValue[]
  }
}

export interface TagsValue {
  ts_id: number
  ts_name?: string
  ts_color?: string
  ts_background?: string
  ts_border?: string
}
