<template>
    <template v-if="Ready">
        <a-back-top />
        <!-- 上層 -->
        <div class="select-theme" :class="this.$theme">
            每頁顯示：
            <a-select
                ref="select"
                v-model:value="selectPageSize"
                size="small"
                style="width: 80px"
                @change="handlePageSize()"
                >
                <a-select-option value="10">10 筆</a-select-option>
                <a-select-option value="20">20 筆</a-select-option>
                <a-select-option value="50">50 筆</a-select-option>
                <a-select-option value="100">100 筆</a-select-option>
                <a-select-option :value="this.words.length">全部</a-select-option>
            </a-select>
            <span style="padding-left: 6px;">當前：</span>
              <a-select
                  ref="selectCurrent"
                  v-model:value="currentPage"
                  size="small"
                  style="width: 80px"
                  @change="handleCurrentPage()"
                  >
                  <template v-for="index in Math.ceil(this.words.length/this.selectPageSize)" :key="index">
                    <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                  </template>
              </a-select>
            <span style="padding-left: 6px;">
                <template v-if="this.$keyword != '' && this.$filters.length > 0">
                    <span style="padding-right: 6px;">
                      搜尋條件：含 ` {{ this.$keyword }} ` 的結果
                    </span>
                </template>
                <template v-else>
                    <span style="padding-right: 6px;">
                      搜尋條件：無
                    </span>
                </template>
            共  {{ this.filterWords(this.$keyword, this.$filters).length }} 筆
            </span>
            <span style="padding-left: 6px;">
                <template v-if="this.$keyword != ''">
                  <a-button type="primary" size="small" shape="round" @click="onResetSearch()" danger>清除搜尋</a-button>
                </template>
            </span>
        </div>
        <p></p>
        <!-- 上層  第二層 -->
        <a-button type="primary" size="small" shape="round" @click="clickGroupAdd()" :disabled="btnDisibled">
          <template v-if="checkboxShow === false">
            新增單字組別
          </template>
          <template v-else>
            <template v-if="this.$WordsGroupsView.groupArray.length === 0">
              請勾選單字或取消
            </template>
            <template v-else>
              請繼續勾選單字
            </template>
          </template>
        </a-button>
        <p></p>
        <!-- 主頁面 card -->
        <a-spin :spinning="ReadySpinning">
            <div class="list-card-theme" :class="this.$theme" ref="listCard">
                <a-list :data-source="this.filterWords(this.$keyword, this.$filters)" :pagination="pagination"
                    :grid="{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3, xxxl: 4 }"
                >
                    <template #renderItem="{ item }">
                    <a-list-item>
                        <a-card>
                            <!-- cate_name -->
                            <template #title>
                              <template v-if="item.cate_name == null || item.cate_name == ''">
                                  --
                              </template>
                              <template v-else>
                                  <template v-if="this.$keyword != '' && this.$filters.includes('cate_name') && item.cate_name.includes(this.$keyword)">
                                      <a @click="handleCategoryFilter(item.cate_name)">
                                      <template v-for="(char, index) in item.cate_name" :key="char + index">
                                          <span :class="{'keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                                      </template>
                                      </a>
                                  </template>
                                  <template v-else>
                                      <a @click="handleCategoryFilter(item.cate_name)">{{ item.cate_name }} </a>
                                  </template>
                              </template>
                            </template>
                            <!-- checkbox -->
                            <template v-if="this.$WordsGroupsDetailsView.updateNow === true || checkboxShow === true">
                              <a-checkbox  v-model:checked="checkboxArray[item.id]" @change="changeCheckbox(item.id, item.ws_name)"></a-checkbox>
                              <p></p>
                            </template>
                            <template v-if="item.ws_is_common">
                              <span class="icon-star">
                                <a @click="onUpdateCommon(item.id, item)"><StarFilled /></a>
                              </span>
                            </template>
                            <template v-else>
                              <span class="icon-star-false">
                                <a @click="onUpdateCommon(item.id, item)"><StarFilled /></a>
                              </span>
                            </template>
                            <template v-if="item.ws_is_important">
                              <span class="icon-heart">
                                <a @click="onUpdateImportant(item.id, item)"><HeartFilled /></a>
                              </span>
                            </template>
                            <template v-else>
                              <span class="icon-heart-false">
                                <a @click="onUpdateImportant(item.id, item)"><HeartFilled /></a>
                              </span>
                            </template>
                            <p></p>
                            <!-- ws_name -->
                            <template v-if="this.$keyword != '' && this.$filters.includes('ws_name') && item.ws_name.includes(this.$keyword)">
                                <router-link :to="{ name: 'wordDetails', params: { id: item.id } }" @click="handleDetailsClick()">
                                    <template v-for="(char, index) in item.ws_name" :key="char + index">
                                        <span :class="{'keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                                    </template>
                                </router-link>
                            </template>
                            <template v-else>
                                <router-link :to="{ name: 'wordDetails', params: { id: item.id } }">{{ item.ws_name }}</router-link>
                            </template>
                            <p></p>
                            <!-- ws_pronunciation -->
                            <template v-if="item.ws_pronunciation == null || item.ws_pronunciation == ''">
                                <br>
                            </template>
                            <template v-else>
                                <template v-if="this.$keyword != '' && this.$filters.includes('ws_pronunciation') && item.ws_pronunciation.includes(this.$keyword)">
                                    <template v-for="(char, index) in item.ws_pronunciation" :key="char + index">
                                        <span :class="{'keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                                    </template>
                                </template>
                                <template v-else>
                                    {{ item.ws_pronunciation }}
                                </template>
                            </template>
                            <p></p>
                            <!-- ws_definition -->
                            <template v-if="item.ws_definition == null || item.ws_definition == ''">
                                <br>
                            </template>
                            <template v-else>
                                <template v-if="this.$keyword != '' && this.$filters.includes('ws_definition') && item.ws_definition.includes(this.$keyword)">
                                    <template v-for="(char, index) in item.ws_definition" :key="char + index">
                                        <span :class="{'keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                                    </template>
                                </template>
                                <template v-else>
                                    {{ item.ws_definition }}
                                </template>
                            </template>
                        </a-card>
                    </a-list-item>
                    </template>
                </a-list>
            </div>
        </a-spin>
    </template>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref, reactive } from 'vue'
import { StarFilled, HeartFilled } from '@ant-design/icons-vue'

export default {
  name: 'WordsGridView',
  components: {
    StarFilled,
    HeartFilled
  },
  computed: {
    checkboxArray () {
      const newArray = {}
      for (const item of this.$WordsGroupsView.groupArray) {
        newArray[item.ws_id] = item.checked
      }
      return newArray
    },
    btnDisibled () {
      return this.$WordsGroupsDetailsView.updateNow || this.checkboxBtn
    },
    ...mapGetters('WordsStore', ['words']),
    ...mapGetters('WordsStore', ['filterWords']),
    ...mapState('Search', ['$keyword']),
    ...mapState('Search', ['$searchClass']),
    ...mapState('Search', ['$filters']),
    ...mapState('Views', ['$WordsGrid']),
    ...mapState('Views', ['$WordsGroupsView']),
    ...mapState('Views', ['$WordsGroupsDetailsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    ...mapActions('WordsStore', {
      updateCommon: 'updateCommon'
    }),
    ...mapActions('WordsStore', {
      updateImportant: 'updateImportant'
    }),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Views', ['updateWordsGrid']),
    ...mapActions('Views', ['updateWordsGroupsView']),
    async onUpdateCommon (id, data) {
      try {
        data.ws_is_common = !data.ws_is_common
        await this.updateCommon({ id: id, data: data })
        await this.fetch()
      } catch (error) {}
    },
    async onUpdateImportant (id, data) {
      try {
        data.ws_is_important = !data.ws_is_important
        await this.updateImportant({ id: id, data: data })
        await this.fetch()
      } catch (error) {}
    },
    onResetSearch () {
      this.updateKeyword('')
    },
    handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      window.scrollTo({ top: 100, behavior: 'auto' })
    },
    /* select pagination */
    handlePageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    handleCurrentPage () {
      this.pagination.current = Number(this.currentPage)
    },
    setCurrentPage () {
      this.pagination.pageSize = Number(this.$WordsGrid.currentPageSize)
      this.selectPageSize = this.$WordsGrid.currentPageSize
      this.pagination.current = Number(this.$WordsGrid.currentPage)
      this.currentPage = this.pagination.current
      this.AfterReady = true
    },
    /* scroll */
    handleDetailsClick () {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      this.updateWordsGrid({ variable: 'currentScrollY', data: scrollY })
      this.updateWordsGrid({ variable: 'currentPage', data: this.currentPage })
      this.updateWordsGrid({ variable: 'jumpPage', data: false })
      this.updateWordsGrid({ variable: 'currentPageSize', data: this.selectPageSize })
    },
    /* checkbox */
    changeCheckbox (id, wsName) {
      if (this.checkboxArray[id]) {
        this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: true } })
      } else {
        this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: false } })
      }
      this.setCheckbox()
    },
    clickGroupAdd () {
      if (this.checkboxShow === true && this.$WordsGroupsView.groupArray.length === 0) {
        this.checkboxShow = false
      } else {
        this.checkboxShow = true
      }
    },
    setCheckbox () {
      if (this.$WordsGroupsView.groupArray.length > 0) {
        this.checkboxShow = true
        this.checkboxBtn = true
      }
    }
  },
  async created () {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  beforeRouteLeave (to, from, next) {
    this.handleDetailsClick()
    next()
  },
  watch: {
    Ready (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$WordsGrid.jumpPage === true) {
            this.setCurrentPage()
          }
          this.setCheckbox()
        })
      }
    },
    AfterReady (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$WordsGrid.jumpScroll === true) {
            window.scrollTo({ top: this.$WordsGrid.currentScrollY, behavior: 'instant' })
            this.updateWordsGrid({ variable: 'jumpScroll', data: false })
          }
        })
      }
    },
    checkboxArray (val) {
      if (Object.keys(val).length === 0) {
        this.checkboxShow = false
        this.checkboxBtn = false
      }
    }
  },
  setup () {
    const Ready = ref(false)
    const AfterReady = ref(false)
    const ReadySpinning = ref(false)
    const selectPageSize = ref('20')
    const currentPage = ref(1)
    const dataSize = ref(0)
    const checkboxShow = ref(false)
    const checkboxBtn = ref(false)
    const pagination = reactive({
      onChange: page => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'top'
    })

    return {
      Ready,
      AfterReady,
      ReadySpinning,
      pagination,
      selectPageSize,
      currentPage,
      dataSize,
      checkboxShow,
      checkboxBtn
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.keyword-text{
    color:$keyword-color;
}

.icon-star{
  padding-left: 2px;
  padding-right: 8px;
}
.icon-star-false{
  padding-left: 2px;
  padding-right: 8px;
}
</style>
