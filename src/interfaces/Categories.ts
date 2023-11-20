export interface RootState {
  categories: Category[];
  category: Category;
  categoryForm: CategoryForm;
  recentCategories: Category[];
}

export interface Category {
  id: number;
  cate_name: string;
  cate__parent_id?: number | null;
  cate__level: number;
  cate__order: number;
  children: Category[];
  parents: number[];
}

export interface CategoryForm {
  cate_name: string;
  cate__parent_id?: number | null;
  cate__level?: number | null;
  cate__order?: number | null;
}

export interface CategoriesOrder {
  id: number;
  cate_order: number;
}
