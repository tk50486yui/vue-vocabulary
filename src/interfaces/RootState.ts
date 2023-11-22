import { WordsState } from '@/interfaces/Words'
import { CategoriesState } from '@/interfaces/Categories'
import { ArticlesState } from '@/interfaces/Articles'
import { TagsState } from '@/interfaces/Tags'
import { TagsColorState } from '@/interfaces/TagsColor'
import { WordsGroupsState } from '@/interfaces/WordsGroups'

export interface RootState {
  WordsModule: WordsState
  CategoriesModule: CategoriesState
  ArticlesModule: ArticlesState
  TagsModule: TagsState
  TagsColorModule: TagsColorState
  WordsGroupsModule: WordsGroupsState
}
