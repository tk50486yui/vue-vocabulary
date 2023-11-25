import { groupArray } from '@/interfaces/WordsGroups'
export interface ViewsState {
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
      sortValue: string | null
    }
    isItemsState: {
      isPronunciation: boolean
      isDefinition: boolean
      isSlogan: boolean
      isCate: boolean
      isTag: boolean
      isForget: boolean
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
  variable: keyof ViewsState['$WordsGrid']
  data:
    | string
    | boolean
    | number
    | {
        choiceArray: string[]
        choiceOperator: string
        tagsOperator: string
        sortValue: string | null
      }
    | {
        isPronunciation: boolean
        isDefinition: boolean
        isSlogan: boolean
        isCate: boolean
        isTag: boolean
        isForget: boolean
      }
}

export interface ArticlesViewType {
  variable: keyof ViewsState['$ArticlesView']
  data: string | boolean | number
}

export interface WordsGroupsViewType {
  variable: keyof ViewsState['$WordsGroupsView']
  data: string | number | groupArray | boolean
}

export interface WordsGroupsDetailsViewType {
  variable: keyof ViewsState['$WordsGroupsDetailsView']
  data: boolean
}
