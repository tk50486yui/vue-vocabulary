<template>
    <!-- 主搜尋列 -->
    <transition name="fade" mode="out-in">
    <template v-if="$searchShow">
      <div>
      <div class="row">
          <div class="col-lg-4 col-md-12 d-flex
              justify-content-lg-end justify-content-md-start align-items-center">
              <div class="radio-button-theme" :class="$theme">
                  <a-radio-group v-model:value="searchRadio" @change="onSearchRadio()">
                  <a-radio-button value="word">單字</a-radio-button>
                  <a-radio-button value="article">文章</a-radio-button>
                  </a-radio-group>
              </div>
          </div>
          <div class="col-lg-8 col-md-12 d-flex justify-content-start">
              <div class="input-theme input-search" :class="$theme">
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
              <div class="checkbox-theme checkbox-group" :class="$theme">
                  <a-checkbox-group v-model:value="wordCheckbox" :options="wordOptions" @change="onWordChecked()"/>
              </div>
              </template>
              <template v-else>
              <div class="checkbox-theme checkbox-group" :class="$theme">
                  <a-checkbox-group v-model:value="articleCheckbox" :options="articleOptions" @change="onArticleChecked()"/>
              </div>
              </template>
          </div>
      </div>
      <a-divider class="divider-theme" />
      </div>
    </template>
  </transition>
  <template v-if="!$searchShow">
    <p></p>
  </template>
</template>
<script>
import { ref } from 'vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SearchView',
  computed: {
    ...mapState('Theme', ['$theme']),
    ...mapState('Search', ['$searchShow'])
  },
  methods: {
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Search', ['updateFilters']),
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
    }
  },
  setup () {
    const searchValue = ref('')
    const searchRadio = ref('word')
    const wordCheckbox = ref(['ws_name', 'ws_pronunciation'])
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
        label: '中譯',
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

    return {
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

.divider-theme {
  height: 2px;
  background: #515959
}
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

/* <transition name="fade">  */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
