<template>
    <template v-if="Ready">
        <a-back-top />
        <div class="section-title">
          <h4>單字總覽</h4>
        </div>
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
            共  {{ this.filterWordsResult.length }} 筆
            </span>
            <span style="padding-left: 6px;">
                <template v-if="this.$keyword != ''">
                  <a-button type="primary" size="small" shape="round" @click="onResetSearch()" danger>清除搜尋</a-button>
                </template>
            </span>
        </div>
        <p></p>
        <!-- 上層  第二層 tags select -->
        <a-input-group>
          <a-row :gutter="4">
            <a-col :span="18">
              <TagsTreeSelect
              size="small"
              ref="TagsTreeSelect"
              placeholder="以標籤過濾資料"
              style="width: 100%"
              v-model:value="selectTagsArray"
              :treeDefaultExpandedKeys="selectTagsArray"
              :field-names="{
                  children: 'children',
                  label: 'ts_name',
                  value: 'ts_name',
                  key: 'ts_name'}"
              multiple
              />
            </a-col>
            <a-col :span="2">
              <a-button  size="small" shape="round" @click="handleTagsFilter()" danger>確認</a-button>
            </a-col>
          </a-row>
        </a-input-group>
        <p></p>
        <!-- 上層  第三層 tags filter (OR) -->
        <span>
          <template v-if="this.tagsArray.length > 0">
              <span style="padding-right: 6px;">
                搜尋標籤（OR）：
                <template v-for="(tag, index) in tagsArray" :key="index">
                  {{ tag }}
                  <template v-if="(this.tagsArray.length-1) !== index">
                    ||
                  </template>
                </template>
          </span>
          </template>
          <template v-else>
              <span style="padding-right: 6px;">
                搜尋標籤：無
              </span>
        </template>
        </span>
        <template v-if="this.tagsArray.length > 0">
          <p></p>
          <a-button type="primary" size="small" shape="round" @click="onResetTags()" danger>重置標籤</a-button>
        </template>
        <p></p>
        <!-- 上層  第四層 heart star -->
        顯示（OR）：
        <a-checkbox-group v-model:value="choiceArray" :options="choiceArrayOptions">
          <template #label="{value}">
            <span class="icon-theme" :class="$theme">
              <div class="choice-container">
              <template v-if="value === 'ws_is_important'">
                <span class="icon-heart">
                  <a class="choice-heart"><HeartFilled /></a>
                </span>
              </template>
              <template v-if="value === 'ws_is_common'">
                <span class="icon-star">
                  <a class="choice-star"><StarFilled /></a>
                </span>
              </template>
              </div>
            </span>
          </template>
        </a-checkbox-group>
        <p></p>
        <!-- 上層  第五層  groups add -->
        <a-button type="primary" size="small" shape="round" @click="clickGroupAdd()" :disabled="btnDisibled">
          <template v-if="checkboxShow === false">
            新增單字組別
          </template>
          <template v-else>
            <template v-if="this.$WordsGroupsView.groupArray.length === 0">
              請勾選單字或點擊取消
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
                <a-list :data-source="this.filterWordsResult" :pagination="pagination"
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
                            <!-- Icon Star Heart -->
                            <span class="icon-theme" :class="this.$theme">
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
                              <span class="icon-delete">
                                <DeleteBtn  @confirm="onDelete(item.id)" />
                              </span>
                            </span>
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
                            <!-- tags -->
                            <template v-if="item.words_tags.values != null && item.words_tags.values.length > 0">
                              <p></p>
                              <template v-for="(subItem, index) in item.words_tags.values"  :key="index">
                                <a-tag class="tag-align" color="green"> {{ subItem.ts_name }} </a-tag>
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
import { message } from 'ant-design-vue'
import { StarFilled, HeartFilled } from '@ant-design/icons-vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import DeleteBtn from '@/components/button/DeleteBtn.vue'

export default {
  name: 'WordsGridView',
  components: {
    StarFilled,
    HeartFilled,
    DeleteBtn,
    TagsTreeSelect
  },
  computed: {
    filterWordsResult () {
      return this.filterWords(this.$keyword, this.$filters, this.tagsArray, this.choiceArray)
    },
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
    ...mapState('Search', ['$filtersTags']),
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
    ...mapActions('WordsStore', ['deleteById']),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateFiltersTags']),
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
    async onDelete (id) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.deleteById(id)
        await this.fetch()
      } catch (error) {}
    },
    onResetSearch () {
      this.updateKeyword('')
    },
    onResetTags () {
      this.selectTagsArray = []
      this.handleTagsFilter()
    },
    async handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      await new Promise(resolve => setTimeout(resolve, 100))
      window.scrollTo({ top: 180, behavior: 'instant' })
    },
    handleTagsFilter () {
      this.tagsArray = this.selectTagsArray
    },
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
    // scroll
    handleDetailsClick () {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      this.updateWordsGrid({ variable: 'currentScrollY', data: scrollY })
      this.updateWordsGrid({ variable: 'currentPage', data: this.currentPage })
      this.updateWordsGrid({ variable: 'jumpPage', data: false })
      this.updateWordsGrid({ variable: 'currentPageSize', data: this.selectPageSize })
    },
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
    const selectTagsArray = ref([])
    const tagsArray = ref([])
    const choiceArray = ref([])
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
      position: 'bottom',
      showSizeChanger: false
    })

    const choiceArrayOptions = [
      {
        value: 'ws_is_important'
      },
      {
        value: 'ws_is_common'
      }
    ]

    return {
      Ready,
      AfterReady,
      ReadySpinning,
      selectTagsArray,
      tagsArray,
      choiceArray,
      choiceArrayOptions,
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
.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #17b0f7;
  content: "";
}
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

.icon-delete {
  float: right;
}
.choice-container{
  display: flex;
  align-items: center;
}
.choice-heart{
  display: flex;
}
.choice-star{
  display: flex;
}
.tag-align {
  margin-top: 6px;
}
</style>
