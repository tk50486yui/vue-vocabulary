<template>
  <div class="main-body" :class="this.$theme">
    <HeaderView />
    <!-- Breadcrumb Begin -->
    <div class="breadcrumb-option" :class="[this.$theme]">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__links" :class="[this.$theme]">
                      <router-link :to="{ name: 'words' }">
                        <font-awesome-icon :icon="['fas', 'house']" /> Home
                      </router-link>
                      <span class="breadcrumb-separator"><font-awesome-icon :icon="['fas', 'chevron-right']" size="xs"/></span>
                      <span>單字表</span>
                      <div class="breadcrumb__switch">
                        <a-switch
                          :checked="this.$theme === 'dark'"
                          checked-children="暗黑模式"
                          un-checked-children="明亮模式"
                          @change="changeTheme"
                        />
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 主頁面 -->
    <div class="spad" :class="[this.$theme]">
      <div class="container">
        <div class="d-flex justify-content-center">
          <div class="input-theme input-search" :class="this.$theme">
              <a-input-search
                  v-model:value="searchValue"
                  placeholder="搜尋"
                  @search="onSearch"
                  size="large"
              />
          </div>
        </div>
        <p></p>
        <a-divider class="divider-theme" />
        <div class="row">
          <!-- 左側 Left -->
          <div class="col-lg-3 col-md-3">
            <CategoriesMenuView />
          </div>
          <!-- 右側 Right -->
          <div class="col-lg-9 col-md-9">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>

    <FooterView />

  </div>
</template>
<script>
import CategoriesMenuView from '@/views/CategoriesMenuView.vue'
import HeaderView from '@/views/HeaderView.vue'
import FooterView from '@/views/FooterView.vue'
import { ref, onMounted } from 'vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    HeaderView,
    CategoriesMenuView,
    FooterView
  },
  computed: {
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile'])
  },
  watch: {
    isScreenSmall: function (val) {
      if (val) {
        this.updateMobile(true)
      } else {
        this.updateMobile(false)
      }
    }
  },
  methods: {
    ...mapActions('Theme', ['updateTheme']),
    ...mapActions('Screen', ['updateMobile']),
    ...mapActions('Search', ['updateKeyword']),
    changeTheme (checked) {
      const theme = checked ? 'dark' : 'light'
      this.updateTheme(theme)
    },
    changeScreen (screen) {
      console.log(screen)
    },
    onSearch () {
      this.updateKeyword(this.searchValue)
      this.$router.push({ name: 'wordsGrid' })
    }
  },
  setup () {
    const isScreenSmall = ref(false)
    const mediaQuery = window.matchMedia('(max-width: 576px)')
    const searchValue = ref('')

    const handleMediaQueryChange = () => {
      isScreenSmall.value = mediaQuery.matches
    }

    onMounted(() => {
      isScreenSmall.value = mediaQuery.matches
      mediaQuery.addEventListener('change', handleMediaQueryChange)
    })

    return {
      isScreenSmall,
      searchValue
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
}

/*---------------------
  Breadcrumb
-----------------------*/

.breadcrumb-separator {
  margin-right: 10px;
  margin-left: -5px;
  position: relative;
  display: inline-block;
}
.breadcrumb-separator font-awesome-icon {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
}

.breadcrumb__links a i {
  margin-right: 5px;
}

.breadcrumb__switch {
  margin-left: auto;
}

.input-search{
  width: 450px;
}
@media only screen and (max-width: 480px) {
  .input-search{
    width: 240px;
  }
}

.divider-theme {
  height: 2px;
  background: #515959
}

</style>
