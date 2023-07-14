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
        <!-- 主頁面 card -->
        <a-spin :spinning="ReadySpinning">
            <div class="list-card-theme" :class="this.$theme" ref="listCard">
                <a-list :data-source="this.filterWords(this.$keyword, this.$filters)" :pagination="pagination"
                    :grid="{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4, xxxl: 4 }"
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
                            <a-checkbox  v-model:checked="checkboxArray[item.id]" @change="changeCheckbox(item.id, item.ws_name)"></a-checkbox>
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

export default {
  name: 'WordsGridView',
  computed: {
    ...mapGetters('WordsStore', ['words']),
    ...mapGetters('WordsStore', ['filterWords']),
    ...mapState('Search', ['$keyword']),
    ...mapState('Search', ['$searchClass']),
    ...mapState('Search', ['$filters']),
    ...mapState('Views', ['$WordsGrid']),
    ...mapState('Views', ['$WordsGroupsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Views', ['updateWordsGrid']),
    ...mapActions('Views', ['updateWordsGroupsView']),
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
    onResetSearch () {
      this.updateKeyword('')
    },
    handleDetailsClick () {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      this.updateWordsGrid({ variable: 'currentScrollY', data: scrollY })
      this.updateWordsGrid({ variable: 'currentPage', data: this.currentPage })
      this.updateWordsGrid({ variable: 'jumpPage', data: false })
      this.updateWordsGrid({ variable: 'currentPageSize', data: this.selectPageSize })
    },
    handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      window.scrollTo({ top: 100, behavior: 'auto' })
    },
    changeCheckbox (id, wsName) {
      if (this.checkboxArray[id]) {
        this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: true } })
      } else {
        this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: false } })
      }
    },
    setCheckbox () {
      if (this.$WordsGroupsView.groupArray.length > 0) {
        for (const item of this.$WordsGroupsView.groupArray) {
          this.checkboxArray[item.ws_id] = true
        }
      }
    },
    clearCheckbox () {
      this.checkboxArray = []
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
    '$WordsGroupsView.groupArray' (val) {
      console.log('watch')
      if (val.length === 0) {
        this.clearCheckbox()
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
    const checkboxArray = ref([])
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
      checkboxArray
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.keyword-text{
    color:$keyword-color;
}
</style>
