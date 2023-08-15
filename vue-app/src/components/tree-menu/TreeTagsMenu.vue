<template>
    <div>
        <template v-for="item in data.children" :key="item.id">
            <template v-if="item.children && item.children.length">
                <a-sub-menu :key="item.id" :title="item.ts_name">
                    <TreeTagsMenu :data="item" />
                </a-sub-menu>
            </template>
            <template v-else>
                <a-menu-item :key="item.id"># {{ item.ts_name }}</a-menu-item>
            </template>
        </template>
    </div>
</template>

<script>
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
export default {
  name: 'TreeTagsMenu',
  props: {
    data: Object,
    parentId: String
  },
  components: {
    TreeTagsMenu
  }
}
</script>
<style scoped>
.card-router-link {
  display: inline !important;
}
</style>
