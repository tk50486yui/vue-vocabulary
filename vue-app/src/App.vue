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
        <div class="row">
          <div class="col-lg-4 col-md-12 d-flex
              justify-content-lg-end justify-content-md-start align-items-center">
              <a-radio-group v-model:value="searchRadio" @change="onSearchRadio()">
                <a-radio-button value="word">單字</a-radio-button>
                <a-radio-button value="article">文章</a-radio-button>
              </a-radio-group>
          </div>
          <div class="col-lg-8 col-md-12 d-flex justify-content-start">
            <div class="input-theme input-search" :class="this.$theme">
              <a-input-search
                  v-model:value="searchValue"
                  placeholder="搜尋"
                  @search="onSearch"
                  size="large"
                  allow-clear
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col d-flex justify-content-center align-items-center">
            <template v-if="this.searchRadio == 'word'">
              <div class="checkbox-theme checkbox-group" :class="this.$theme">
                <a-checkbox-group v-model:value="wordCheckbox" :options="wordOptions" @change="onWordChecked()"/>
              </div>
            </template>
            <template v-else>
              <div class="checkbox-theme checkbox-group" :class="this.$theme">
                <a-checkbox-group v-model:value="articleCheckbox" :options="articleOptions" @change="onArticleChecked()"/>
              </div>
            </template>
          </div>
        </div>
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
    },
    isScreenMedium: function (val) {
      if (val) {
        this.updateTablet(true)
      } else {
        this.updateTablet(false)
      }
    },
    isScreenLarge: function (val) {
      if (val) {
        this.updateDesktop(true)
      } else {
        this.updateDesktop(false)
      }
    }
  },
  methods: {
    ...mapActions('Theme', ['updateTheme']),
    ...mapActions('Screen', ['updateMobile']),
    ...mapActions('Screen', ['updateTablet']),
    ...mapActions('Screen', ['updateDesktop']),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Search', ['updateFilters']),
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
    },
    onSearchRadio () {
      this.updateSearchClass(this.searchRadio)
    },
    onWordChecked () {
      if (this.searchRadio === 'word') {
        this.updateFilters(this.wordCheckbox)
      }
    },
    onArticleChecked () {
      if (this.searchRadio === 'article') {
        this.updateFilters(this.articleCheckbox)
      }
    }
  },
  setup () {
    const isScreenSmall = ref(false)
    const isScreenMedium = ref(false)
    const isScreenLarge = ref(false)
    const mediaQuerySmall = window.matchMedia('(max-width: 576px)')
    const mediaQueryMedium = window.matchMedia('(min-width: 577px) and (max-width: 1024px)')
    const mediaQueryLarge = window.matchMedia('(min-width: 1025px)')
    const searchValue = ref('')
    const searchRadio = ref('word')
    const wordCheckbox = ref(['ws_name'])
    const articleCheckbox = ref(['arti_title'])
    const wordOptions = [
      {
        label: '詞名',
        value: 'ws_name'
      },
      {
        label: '假名',
        value: 'ws_pronunciation'
      },
      {
        label: '中文',
        value: 'ws_definition'
      },
      {
        label: '類別',
        value: 'cate_name'
      }
    ]
    const articleOptions = [
      {
        label: '標題',
        value: 'arti_title'
      },
      {
        label: '日期',
        value: 'created_at'
      }
    ]

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
      isScreenLarge,
      searchValue,
      searchRadio,
      wordCheckbox,
      articleCheckbox,
      wordOptions,
      articleOptions
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

/** Search **/
.input-search{
  width: 500px;

}

@media only screen and (max-width: 1400px) {
  .input-search{
    width: 560px;
    padding-left: 2px;
  }
}

@media only screen and (max-width: 1200px) {
  .input-search{
    width: 500px;
    padding-left: 2px;
    padding-top: 8px;
  }
}
@media only screen and (max-width: 720px) {
  .input-search{
    width: 450px;
    padding-left: 2px;
    padding-top: 8px;
  }
}
@media only screen and (max-width: 480px) {
  .input-search{
    width: 280px;
    padding-left: 2px;
    padding-top: 8px;
  }
}

.checkbox-group{
  padding-top: 8px;
}

.divider-theme {
  height: 2px;
  background: #515959
}

.ant-radio-button-wrapper{
  background:#152231;
  color:#fff;
}
.ant-radio-button-wrapper:hover{
  color:#d1def9;
  background:#f16728;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  color: #fff;
  background:#f16728;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover{
  color:#d1def9;
  background:#f16728;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child{
  border-color: #d4b7a2;
}

</style>
