export interface CategoriesState {
  categories: Category[]
  category: Category
  categoryForm: CategoryForm
  recentCategories: Category[]
}

export interface Category {
  id: number
  cate_name: string
  cate_parent_id?: number | null
  cate_level: number
  cate_order: number
  children: Category[]
  parents: number[]
}

export interface CategoryForm {
  cate_name: string
  cate_parent_id?: number | null
  cate_level?: number | null
  cate_order?: number | null
}

export interface CategoriesOrder {
  id: number
  cate_order: number
}
