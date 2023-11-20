<template>
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
</template>
<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { mapState, mapActions } from 'vuex'
import HeaderView from '@/views/HeaderView.vue'
import SearchView from '@/views/SearchView.vue'
import BreadcrumbView from '@/views/BreadcrumbView.vue'
import SideMenuView from '@/views/SideMenuView.vue'
import FooterView from '@/views/FooterView.vue'

export default defineComponent({
  name: 'App',
  components: {
    HeaderView,
    SearchView,
    BreadcrumbView,
    FooterView,
    SideMenuView
  },
  computed: {
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile'])
  },
  methods: {
    ...mapActions('Screen', ['updateDesktop', 'updateTablet', 'updateMobile'])
  },
  watch: {
    isScreenSmall: function (val) {
      this.updateMobile(!!val)
    },
    isScreenMedium: function (val) {
      this.updateTablet(!!val)
    },
    isScreenLarge: function (val) {
      this.updateDesktop(!!val)
    }
  },
  setup() {
    const isScreenSmall = ref(false)
    const isScreenMedium = ref(false)
    const isScreenLarge = ref(false)
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

    return {
      isScreenSmall,
      isScreenMedium,
      isScreenLarge
    }
  }
})
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
