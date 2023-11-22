export interface TagsState {
  tags: Tag[]
  tag: Tag
  tagForm: TagForm
  recentTags: Tag[]
}

export interface Tag {
  id: number
  ts_name: string
  ts_parent_id: number | null
  ts_level: number
  ts_order: number
  ts_parent_name: string
  tc_id: number | null
  tc_color: string
  tc_background: string
  tc_border: string
  children: Tag[]
  parents: number[]
}

export interface TagForm {
  ts_name: string
  ts_parent_id: number | null
  ts_level?: number | null
  ts_order?: number | null
  tc_id: number | null
}

export interface TagsOrder {
  id: number
  ts_order: number
}
