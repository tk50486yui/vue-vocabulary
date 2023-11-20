export interface RootState {
  tagsColor: TagsColor[]
  tagColor: TagsColor
  tagsColorForm: TagsColorForm
}

export interface TagsColor {
  id: number
  tc_color: string
  tc_background: string
  tc_border: string
}

export interface TagsColorForm {
  tc_color: string | null
  tc_background: string | null
  tc_border: string | null
}
