<template>
    <template v-if="Ready">
        <!-- 上層 -->
        <div class="select-theme" :class="this.$theme">
            每頁顯示：
            <a-select
                ref="select"
                v-model:value="selectPageSize"
                style="width: 80px"
                @change="handlePageSize()"
                >
                <a-select-option value="10">10</a-select-option>
                <a-select-option value="20">20</a-select-option>
                <a-select-option value="50">50</a-select-option>
                <a-select-option value="100">100</a-select-option>
            </a-select>
            <span style="padding-left: 20px;">
                <template v-if="this.$keyword != '' && this.$filters.length > 0">
                    <span style="padding-right: 10px;">
                    ` {{ this.$keyword }} `
                    </span>
                </template>
                <template v-else>
                    <span style="padding-right: 10px;">
                        全部
                    </span>
                </template>
            共  {{ this.filterWords(this.$keyword, this.$filters).length }} 筆
            </span>
            <span style="padding-left: 20px;">
                <template v-if="this.$keyword != ''">
                <a class="btn btn-sm btn-danger btn-outline-light" @click="onResetSearch()">清除搜尋</a>
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
                            <!-- ws_name -->
                            <template v-if="this.$keyword != '' && this.$filters.includes('ws_name') && item.ws_name.includes(this.$keyword)">
                                <router-link :to="{ name: 'wordDetails', params: { id: item.id } }" @click="handleDetailsClick()">
                                    <template v-for="(char, index) in item.ws_name" :key="char + index">
                                        <span :class="{'keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                                    </template>
                                </router-link>
                            </template>
                            <template v-else>
                                <router-link :to="{ name: 'wordDetails', params: { id: item.id } }" @click="handleDetailsClick()">{{ item.ws_name }}</router-link>
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
  components: {

  },
  computed: {
    ...mapGetters('WordsStore', ['words']),
    ...mapGetters('WordsStore', ['filterWords']),
    ...mapState('Search', ['$keyword']),
    ...mapState('Search', ['$searchClass']),
    ...mapState('Search', ['$filters']),
    ...mapState('Views', ['$WordsGrid']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Views', ['updateWordsGrid']),
    handlePageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
    },
    onResetSearch () {
      this.updateKeyword('')
    },
    handleDetailsClick () {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      this.updateWordsGrid({ variable: 'currentScrollY', data: scrollY })
    },
    handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      window.scrollTo({ top: 100, behavior: 'auto' })
    },
    handlePageItem () {
      const listItems = this.$refs.listCard.querySelectorAll('.ant-list-pagination ul li')
      listItems.forEach((item) => {
        const activeListItem = item.classList.contains('ant-pagination-item-active')
        if (activeListItem) {
          const title = item.getAttribute('title')
          this.updateWordsGrid({ variable: 'currentPage', data: title })
          this.updateWordsGrid({ variable: 'jumpPage', data: false })
        }
      })
    },
    setCurrentPage (page) {
      const listCard = this.$refs.listCard
      const listItems = listCard.querySelectorAll('.ant-list-pagination ul li')
      listItems.forEach((item) => {
        const title = item.getAttribute('title')
        if (title) {
          if (title === page) {
            const clickEvent = new Event('click', { bubbles: true })
            item.dispatchEvent(clickEvent)
          }
        }
      })
      this.AfterReady = true
    }
  },
  async created () {
    try {
      this.ReadySpinning = true
      await this.fetch()
      this.Ready = true
      this.ReadySpinning = false
    } catch (error) {}
  },
  watch: {
    Ready (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          const listCard = this.$refs.listCard
          const listItems = listCard.querySelectorAll('.ant-list-pagination ul li')
          listItems.forEach((item) => {
            item.addEventListener('click', () => this.handlePageItem())
          })
          if (this.$WordsGrid.jumpPage === true) {
            this.setCurrentPage(this.$WordsGrid.currentPage)
          }
        })
      }
    },
    AfterReady (newVal) {
      if (newVal) {
        if (this.$WordsGrid.jumpScroll === true) {
          window.scrollTo({ top: this.$WordsGrid.currentScrollY, behavior: 'auto' })
          this.updateWordsGrid({ variable: 'jumpScroll', data: false })
        }
      }
    }
  },
  setup () {
    const Ready = ref(false)
    const AfterReady = ref(false)
    const ReadySpinning = ref(true)
    const selectPageSize = ref(20)
    const dataSize = ref(0)
    const pagination = reactive({
      pageSize: selectPageSize.value
    })

    return {
      Ready,
      AfterReady,
      ReadySpinning,
      pagination,
      selectPageSize,
      dataSize
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
