import { groupArray } from '@/interfaces/WordsGroups'
export interface RootState {
  $WordsGrid: {
    currentPage: string
    jumpPage: boolean
    currentScrollY: number
    jumpScroll: boolean
    currentPageSize: number
    filterItemsState: {
      choiceArray: string[]
      choiceOperator: string
      tagsOperator: string
    }
    isItemsState: {
      isPronunciation: boolean
      isDefinition: boolean
      isSlogan: boolean
      isCate: boolean
      isTag: boolean
    }
  }
  $ArticlesView: {
    currentPage: string
    jumpPage: boolean
    currentScrollY: number
    jumpScroll: boolean
    currentPageSize: number
  }
  $WordsGroupsView: {
    groupArray: groupArray[]
    wg_name: string
    id: number | null
    clear: boolean
    checked: boolean
  }
  $WordsGroupsDetailsView: {
    updateNow: boolean
  }
}

export interface WordsGridType {
  variable: keyof RootState['$WordsGrid']
  data:
    | string
    | boolean
    | number
    | {
        choiceArray: string[]
        choiceOperator: string
        tagsOperator: string
      }
    | {
        isPronunciation: boolean
        isDefinition: boolean
        isSlogan: boolean
        isCate: boolean
        isTag: boolean
      }
}

export interface ArticlesViewType {
  variable: keyof RootState['$ArticlesView']
  data: string | boolean | number
}

export interface WordsGroupsViewType {
  variable: keyof RootState['$WordsGroupsView']
  data: string | number | groupArray | boolean
}

export interface WordsGroupsDetailsViewType {
  variable: keyof RootState['$WordsGroupsDetailsView']
  data: boolean
}
