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
</style>
