export interface RootState {
  wordsGroups: WordsGroup[]
  wordsGroup: WordsGroup
  wordsGroupsForm: WordsGroupsForm
}
export interface WordsGroup {
  id: number
  wg_name: string
  details: WordsGroupsDetails[]
}

export interface WordsGroupsForm {
  wg_name: string
  words_groups_details: number[]
}

export interface WordsGroupsDetails {
  id: number
  ws_name: string
  ws_id: number
  wg_id: number
  wgd_content: string
}

export interface groupArray {
  ws_id: number
  ws_name: string
  checked: boolean
}
