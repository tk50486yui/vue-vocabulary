<template>
  <div class="main-body" :class="this.$theme">
    <!-- 頂端 導覽列 -->
    <HeaderView />

    <!-- Breadcrumb -->
    <BreadcrumbView/>

    <!-- 主頁面 -->
    <div class="spad" :class="this.$theme">
      <div class="container">

        <!-- 上方搜尋列 -->
        <div class="row">
          <div class="col-lg-4 col-md-12 d-flex
              justify-content-lg-end justify-content-md-start align-items-center">
              <div class="radio-button-theme" :class="this.$theme">
                <a-radio-group v-model:value="searchRadio" @change="onSearchRadio()">
                  <a-radio-button value="word">單字</a-radio-button>
                  <a-radio-button value="article">文章</a-radio-button>
                </a-radio-group>
              </div>
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

        <!-- 搜尋條件 checkbox -->
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

        <!-- 分隔線 -->
        <a-divider class="divider-theme" />

        <!-- 下方顯示頁面 -->
        <div class="row">

          <!-- 左側 -->
          <div class="col-lg-3 col-md-3">
            <div class="toggle-theme" :class="this.$theme">
              <a-radio-group v-model:value="sideGroup" @change="toggleSide()">
                <a-radio-button value="1">類別</a-radio-button>
                <a-radio-button value="2">群組</a-radio-button>
                <a-radio-button value="3">標籤</a-radio-button>
              </a-radio-group>
            </div>
            <p></p>
            <keep-alive>
              <template v-if="sideGroup === '1'">
                <CategoriesMenuView/>
              </template>
              <template v-else-if="sideGroup === '2'">
                <WordsGroupsView/>
              </template>
              <template v-else-if="sideGroup === '3'">
                333333
              </template>
            </keep-alive>
          </div>

          <!-- 右側 -->
          <div class="col-lg-9 col-md-9">
            <router-view></router-view>
          </div>

        </div>
      </div>
    </div>

    <!-- 底部 Footer -->
    <FooterView />

  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { mapState, mapActions } from 'vuex'
import HeaderView from '@/views/HeaderView.vue'
import BreadcrumbView from '@/views/BreadcrumbView.vue'
import FooterView from '@/views/FooterView.vue'
import CategoriesMenuView from '@/views/CategoriesMenuView.vue'
import WordsGroupsView from '@/views/WordsGroupsView.vue'

export default {
  name: 'App',
  components: {
    HeaderView,
    BreadcrumbView,
    FooterView,
    CategoriesMenuView,
    WordsGroupsView
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
    ...mapActions('Screen', ['updateMobile']),
    ...mapActions('Screen', ['updateTablet']),
    ...mapActions('Screen', ['updateDesktop']),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Search', ['updateFilters']),
    changeScreen (screen) {
      console.log(screen)
    },
    onSearch () {
      this.onWordChecked()
      this.onArticleChecked()
      this.onSearchRadio()
      this.updateKeyword(this.searchValue)
      if (this.searchRadio === 'word') {
        this.$router.push({ name: 'wordsGrid' })
      } else {
        this.$router.push({ name: 'articles' })
      }
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
    },
    toggleSide () {

    }
  },
  setup () {
    const isScreenSmall = ref(false)
    const isScreenMedium = ref(false)
    const isScreenLarge = ref(false)
    const mediaQuerySmall = window.matchMedia('(max-width: 576px)')
    const mediaQueryMedium = window.matchMedia('(min-width: 577px) and (max-width: 1024px)')
    const mediaQueryLarge = window.matchMedia('(min-width: 1025px)')
    const sideGroup = ref('1')
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
      sideGroup,
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

.breadcrumb-links a i {
  margin-right: 5px;
}

.breadcrumb-switch {
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

</style>
