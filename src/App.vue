<template>
  <a-config-provider :getPopupContainer="getPopupContainer">
    <div class="main-body" :class="$theme">
      <!-- 頂端 導覽列 -->
      <HeaderView />

      <!-- Breadcrumb -->
      <BreadcrumbView />

      <!-- 主頁面 -->
      <div class="spad" :class="$theme">
        <div class="container">
          <!-- 上方搜尋列 -->
          <SearchView />

          <!-- 下方顯示頁面 -->
          <div class="row">
            <!-- 左側 -->
            <div class="col-lg-3">
              <SideMenuView />
            </div>

            <!-- 右側 -->
            <div class="col-lg-9">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部 Footer -->
      <FooterView />
    </div>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, toRefs } from 'vue'
import { useStore } from 'vuex'
import HeaderView from '@/views/HeaderView.vue'
import SearchView from '@/views/SearchView.vue'
import BreadcrumbView from '@/views/BreadcrumbView.vue'
import SideMenuView from '@/views/SideMenuView.vue'
import FooterView from '@/views/FooterView.vue'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const isScreenSmall = ref<boolean>(false)
const isScreenMedium = ref<boolean>(false)
const isScreenLarge = ref<boolean>(false)

const mediaQuerySmall = window.matchMedia('(max-width: 576px)')
const mediaQueryMedium = window.matchMedia(
  '(min-width: 577px) and (max-width: 1024px)'
)
const mediaQueryLarge = window.matchMedia('(min-width: 1025px)')

const handleMediaQueryChange = () => {
  isScreenSmall.value = mediaQuerySmall.matches
  isScreenMedium.value = mediaQueryMedium.matches
  isScreenLarge.value = mediaQueryLarge.matches
}

onMounted(() => {
  isScreenSmall.value = mediaQuerySmall.matches
  isScreenMedium.value = mediaQueryMedium.matches
  isScreenLarge.value = mediaQueryLarge.matches
  mediaQuerySmall.addEventListener('change', handleMediaQueryChange)
  mediaQueryMedium.addEventListener('change', handleMediaQueryChange)
  mediaQueryLarge.addEventListener('change', handleMediaQueryChange)
})

watchEffect(() => {
  if (isScreenSmall.value) {
    store.dispatch('Screen/updateMobile', true)
  }
  if (isScreenMedium.value) {
    store.dispatch('Screen/updateTablet', true)
  }
  if (isScreenLarge.value) {
    store.dispatch('Screen/updateDesktop', true)
  }
})

// @ts-expect-error:  necessary
const getPopupContainer = (el, dialogContext) => {
  if (dialogContext) {
    return dialogContext.getDialogWrap()
  } else {
    return document.body
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.spad {
  padding-top: 10px;
  padding-bottom: 50px;
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
}
</style>
