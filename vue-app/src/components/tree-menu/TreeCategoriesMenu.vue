<template>
    <div>
        <template v-for="item in data.children" :key="item.id">
            <template v-if="item.children && item.children.length">
                <a-sub-menu :key="item.id" :title="item.cate_name">
                    <TreeCategoriesMenu :data="item"></TreeCategoriesMenu>
                </a-sub-menu>
            </template>
            <template v-else>
                <a-menu-item :key="item.id"> {{ item.cate_name }}</a-menu-item>
            </template>
        </template>
    </div>
</template>

<script>
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
export default {
  name: 'TreeCategoriesMenu',
  props: {
    data: Object,
    parentId: String
  },
  components: {
    TreeCategoriesMenu
  }
}
</script>
<style scoped>
.card-router-link {
  display: inline !important;
}
</style>
