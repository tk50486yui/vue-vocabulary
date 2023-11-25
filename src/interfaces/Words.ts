export interface WordsState {
  words: Word[]
  word: Word
  wordForm: WordForm
}
export interface Word {
  id: number
  ws_name: string
  ws_definition: string
  ws_pronunciation: string
  ws_description: string
  ws_slogan: string
  ws_is_important: boolean
  ws_is_common: boolean
  ws_forget_count: number
  ws_order?: number
  cate_id: number | null
  cate_name: string | null
  words_tags: {
    array: number[]
    values: TagsValue[]
  }
  created_at: Date
  updated_at: Date
}

export interface WordForm {
  ws_name: string
  ws_definition: string
  ws_pronunciation: string
  ws_description: string
  ws_slogan: string
  ws_is_important?: boolean
  ws_is_common?: boolean
  ws_forget_count?: number
  ws_order?: number
  cate_id?: number | null
  words_tags: {
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
