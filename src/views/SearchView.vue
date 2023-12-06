<template>
  <!-- 主搜尋列 -->
  <transition name="fade" mode="out-in">
    <template v-if="$searchShow">
      <div>
        <div class="row">
          <div
            class="col-lg-4 col-md-12 d-flex justify-content-lg-end justify-content-md-start align-items-center"
          >
            <div class="radio-button-theme" :class="$theme">
              <a-radio-group v-model:value="searchRadio" @change="onSearchRadio()">
                <a-radio-button value="word">單字</a-radio-button>
                <a-radio-button value="article">文章</a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="col-lg-8 col-md-12">
            <div class="input-theme input-search" :class="$theme">
              <a-input-search
                v-model:value="searchValue"
                placeholder="搜尋"
                @search="onSearch"
                size="large"
                allow-clear
              >
                <template #enterButton>
                  <a-button><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></a-button>
                </template>
              </a-input-search>
            </div>
          </div>
        </div>
        <!-- 搜尋條件 checkbox -->
        <div class="row">
          <div class="col d-flex justify-content-center align-items-center">
            <template v-if="searchRadio == 'word'">
              <div class="checkbox-theme checkbox-group" :class="$theme">
                <a-checkbox-group
                  v-model:value="wordCheckbox"
                  :options="wordOptions"
                  @change="onWordChecked()"
                />
              </div>
            </template>
            <template v-else>
              <div class="checkbox-theme checkbox-group" :class="$theme">
                <a-checkbox-group
                  v-model:value="articleCheckbox"
                  :options="articleOptions"
                  @change="onArticleChecked()"
                />
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
<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $searchShow } = toRefs(store.state.Search)

const $router = useRouter()

const searchValue = ref<string>('')
const searchRadio = ref<string>('word')
const wordCheckbox = ref<string[]>(['ws_name', 'ws_pronunciation'])
const articleCheckbox = ref<string[]>(['arti_title'])

const onSearch = () => {
  onWordChecked()
  onArticleChecked()
  onSearchRadio()
  store.dispatch('Search/updateKeyword', searchValue.value)
  if (searchRadio.value === 'word') {
    $router.push({ name: 'wordsGrid' })
  } else {
    $router.push({ name: 'articles' })
  }
}

const onSearchRadio = () => {
  store.dispatch('Search/updateSearchClass', searchRadio.value)
}

const onWordChecked = () => {
  if (searchRadio.value === 'word') {
    store.dispatch('Search/updateFilters', wordCheckbox.value)
  }
}

const onArticleChecked = () => {
  if (searchRadio.value === 'article') {
    store.dispatch('Search/updateFilters', articleCheckbox.value)
  }
}

const wordOptions = [
  {
    label: '詞名',
    value: 'ws_name'
  },
  {
    label: '仮名',
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
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.divider-theme {
  height: 2px;
  background: #515959;
}

.input-search {
  width: 500px;
}

@media only screen and (max-width: 1400px) {
  .input-search {
    width: 560px;
    padding-left: 2px;
  }
}

@media only screen and (max-width: 1200px) {
  .input-search {
    width: 500px;
    padding-left: 2px;
    padding-top: 8px;
  }
}

@media only screen and (max-width: 720px) {
  .input-search {
    width: 450px;
    padding-left: 2px;
    padding-top: 8px;
  }
}

@media only screen and (max-width: 480px) {
  .input-search {
    width: 280px;
    padding-left: 2px;
    padding-top: 8px;
  }
}

.checkbox-group {
  padding-top: 8px;
}

/* <transition name="fade">  */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
