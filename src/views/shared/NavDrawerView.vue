<template>
  <div class="nav-menu-theme" :class="$theme">
    <a-menu mode="inline">
      <a-sub-menu :key="0">
        <template #title>
          <router-link :to="{ name: 'wordsGrid' }"> 單字 </router-link>
        </template>
        <a-menu-item :key="11">
          <router-link :to="{ name: 'wordsGrid' }">單字總覽</router-link>
        </a-menu-item>
        <a-menu-item :key="12">
          <router-link :to="{ name: 'words' }">單字表</router-link>
        </a-menu-item>
        <a-menu-item :key="13">
          <router-link :to="{ name: 'wordsAdd' }">單字新增</router-link>
        </a-menu-item>
        <a-menu-item :key="14">
          <router-link :to="{ name: 'wordsUpload' }">圖片總覽</router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item :key="1">
        <router-link :to="{ name: 'articles' }">文章</router-link>
      </a-menu-item>
      <a-menu-item :key="2">
        <router-link :to="{ name: 'tags' }">標籤</router-link>
      </a-menu-item>
      <a-menu-item :key="3">
        <router-link :to="{ name: 'categories' }">類別</router-link>
      </a-menu-item>
      <a-menu-item :key="4">
        <router-link :to="{ name: 'wordsGroups' }">群組</router-link>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.nav-menu-theme a {
  text-decoration: none;
}
/*---------------------
    SideNav Menu in drawer
-----------------------*/
.nav-menu-theme {
  // 主顏色
  &.dark :deep(.ant-menu) {
    background: var(--table-background);
    color: var(--head-text);
  }
  &.light :deep(.ant-menu) {
    background: var(--table-background);
    color: var(--head-text);
  }
  // 子層級顏色
  &.dark :deep(.ant-menu .ant-menu-sub) {
    background: var(--table-background);
  }
  &.light :deep(.ant-menu .ant-menu-sub) {
    background: var(--table-background);
  }

  // title hover 顏色
  &.dark :deep(.ant-menu .ant-menu-submenu-title:hover) {
    color: var(--head-text);
  }

  // item hover 顏色
  &.dark :deep(.ant-menu .ant-menu-item:hover) {
    color: var(--head-text);
  }

  // 展開時title的顏色
  &.dark :deep(.ant-menu .ant-menu-submenu-open) {
    color: var(--head-text);
  }

  &.dark :deep(.ant-menu .ant-menu-submenu-open:hover) {
    color: var(--head-text);
  }

  // a
  &.dark :deep(.ant-menu .ant-menu-title-content a:not(:hover)) {
    color: var(--head-text);
  }
  // 選中時的a
  &.dark :deep(.ant-menu .ant-menu-item-selected .ant-menu-title-content a:not(:hover)) {
    color: var(--body-background);
    background: var(--head-text);
  }

  // 選中時的顏色
  &.dark :deep(.ant-menu .ant-menu-item-selected) {
    color: var(--body-background);
    background: var(--head-text);
  }
  // 選中時的顏色
  &.dark :deep(.ant-menu .ant-menu-item-selected:hover) {
    color: var(--body-background);
    background: var(--head-text);
  }

  // 主箭頭
  &.dark :deep(.ant-collapse-arrow) {
    color: var(--head-text);
  }

  // 子箭頭
  &.dark :deep(.ant-menu-submenu-arrow) {
    color: var(--head-text);
  }

  // 子箭頭 hover 顏色
  &.dark :deep(.ant-menu .ant-menu-submenu:hover .ant-menu-submenu-title .ant-menu-submenu-arrow) {
    color: var(--menu-text-hover);
  }
}
</style>
