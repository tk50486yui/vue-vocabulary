<template>
    <template v-if="Ready">
        <a-back-top />
        <div class="section-title">
          <h4>單字總覽</h4>
          <a class="float-end text-warning" @click="this.filterShow = !this.filterShow">
            <font-awesome-icon :icon="['fas', 'filter']" />
          </a>
        </div>
        <!-- 過濾器 -->
        <template v-if="this.filterShow">
          <!-- 第一層 tags select -->
          <a-input-group>
            <a-row :gutter="4">
              <a-col :span="18">
                <TagsTreeSelect
                  size="small"
                  ref="TagsTreeSelect"
                  placeholder="以標籤過濾資料"
                  style="width: 100%"
                  v-model:value="tagsArray"
                  :treeDefaultExpandedKeys="tagsArray"
                  :field-names="{
                      children: 'children',
                      label: 'ts_name',
                      value: 'id',
                      key: 'id'}"
                  @change="handleTagsChange()"
                  multiple
                />
              </a-col>
              <a-col :span="2">
                <template v-if="$filtersTags.length > 0">
                  <XmarkBtn @click="onResetTags()" />
                </template>
              </a-col>
            </a-row>
          </a-input-group>
          <p></p>
          <!-- 第二層 tags filter -->
          <span>
            標籤：
            （
            <span class="radio-theme" :class="$theme">
              <a-radio-group v-model:value="tagsOperator" @change="setFilterItems()">
                <a-radio value="or">OR</a-radio>
                <a-radio value="and">AND</a-radio>
                <a-radio value="none">NONE</a-radio>
              </a-radio-group>
            </span>
            ）
          </span>
          <p></p>
          <!-- 第三層 heart star -->
          <span>
            標記：
            （
            <span class="radio-theme" :class="$theme">
              <a-radio-group v-model:value="choiceOperator" @change="setFilterItems()">
                <a-radio value="or">OR</a-radio>
                <a-radio value="and">AND</a-radio>
                <a-radio value="none">NONE</a-radio>
              </a-radio-group>
            </span>
            ）
            <a-checkbox-group
              v-model:value="choiceArray"
              :options="choiceArrayOptions"
              @change="setFilterItems()"
            >
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
          </span>
          <p></p>
          <!-- 第四層 show -->
          <span class="checkbox-theme" :class="$theme">
            顯示項目：
            <a-checkbox v-model:checked="isPronunciation" @change="setItemShow()">
              假名
            </a-checkbox>
            <a-checkbox v-model:checked="isDefinition" @change="setItemShow()">
              中譯
            </a-checkbox>
            <a-checkbox v-model:checked="isSlogan" @change="setItemShow()">
              短句
            </a-checkbox>
            <a-checkbox v-model:checked="isCate" @change="setItemShow()">
              類別
            </a-checkbox>
            <a-checkbox v-model:checked="isTag" @change="setItemShow()">
              標籤
            </a-checkbox>
          </span>
          <p></p>
        </template>
        <!-- groups add -->
        <a-button class="btn btn-dark btn-outline-light btn-sm rounded" @click="clickGroupAdd()" :disabled="btnDisibled">
          <template v-if="checkboxShow === false">
            建立單詞組別
          </template>
          <template v-else>
            <template v-if="this.$WordsGroupsView.groupArray.length === 0">
              請勾選單詞或點擊取消
            </template>
            <template v-else>
              請繼續勾選單詞
            </template>
          </template>
        </a-button>
        <PlusBtn class="btn btn-primary btn-outline-light btn-sm float-end me-md-3" @click="onDrawerShow()"/>
        <!-- 主頁面 card -->
        <a-spin :spinning="ReadySpinning">
          <div class="list-card-theme" :class="this.$theme" ref="listCard">
            <a-list :data-source="this.filterWordsResult" :pagination="pagination"
                :grid="{ gutter: 10, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3, xxxl: 3 }"
            >
              <!-- header -->
              <template #header>
                <span class="select-theme" :class="$theme" ref="selectMod">
                  每頁：
                  <a-select
                    ref="select"
                    :getPopupContainer="()=>this.$refs.selectMod"
                    v-model:value="selectPageSize"
                    size="small"
                    style="width: 80px"
                    @change="setPageSize()"
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
                      :getPopupContainer="()=>this.$refs.selectMod"
                      v-model:value="currentPage"
                      size="small"
                      style="width: 80px"
                      @change="setPaginationCurrent()"
                    >
                      <template v-for="index in Math.ceil(this.words.length/this.selectPageSize)" :key="index">
                        <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                      </template>
                    </a-select>
                  <span style="padding-left: 6px;">
                    <template v-if="this.$keyword != '' && this.$filters.length > 0">
                      <span style="padding-right: 6px;">
                        關鍵字：
                        <template v-if="this.$filters.length === 1 &&  this.$filters.includes('cate_name')">
                          ` <span class="category-keyword-text">{{ this.$keyword }} </span>`
                        </template>
                        <template v-else>
                          ` <span class="keyword-text">{{ this.$keyword }} </span>`
                        </template>
                      </span>
                    </template>
                    <template v-else>
                      <span style="padding-right: 6px;">
                        關鍵字：無
                      </span>
                    </template>
                    共  {{ this.filterWordsResult.length }} 筆
                  </span>
                  <span style="padding-left: 6px;">
                    <template v-if="this.$keyword != ''">
                      <XmarkBtn @click="onResetSearch()" />
                    </template>
                  </span>
                </span>
              </template>
              <!-- main -->
              <p></p>
              <template #renderItem="{ item, index }">
              <a-list-item>
                <template v-if="[0, 1, 2].includes(index) && $desktop">
                  <p></p>
                </template>
                <a-card>
                  <!-- cate_name -->
                  <template #title>
                    <template v-if="isCate">
                    <template v-if="item.cate_name == null || item.cate_name == ''">
                        --
                    </template>
                    <template v-else>
                        <template v-if="this.$keyword != '' && this.$filters.includes('cate_name') && item.cate_name.includes(this.$keyword)">
                            <a @click="handleCategoryFilter(item.cate_name)">
                            <template v-for="(char, index) in item.cate_name" :key="char + index">
                                <span :class="{'category-keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                            </template>
                            </a>
                        </template>
                        <template v-else>
                            <a @click="handleCategoryFilter(item.cate_name)">{{ item.cate_name }} </a>
                        </template>
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
                      <router-link :to="{ name: 'wordDetails', params: { id: item.id } }" @click="setDetailsClick()">
                          <template v-for="(char, index) in item.ws_name" :key="char + index">
                              <span :class="{'keyword-text': this.$keyword.includes(char)}">{{ char }}</span>
                          </template>
                      </router-link>
                  </template>
                  <template v-else>
                      <router-link :to="{ name: 'wordDetails', params: { id: item.id } }">{{ item.ws_name }}</router-link>
                  </template>
                  <!-- ws_pronunciation -->
                  <template v-if="isPronunciation">
                    <p></p>
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
                  </template>
                  <!-- ws_definition -->
                  <template v-if="isDefinition">
                    <p></p>
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
                  </template>
                  <!-- ws_slogan -->
                  <template v-if="isSlogan">
                    <template v-if="item.ws_slogan != null && item.ws_slogan != ''">
                      <p></p>
                      {{ item.ws_slogan }}
                    </template>
                  </template>
                  <!-- tags -->
                  <template v-if="isTag">
                    <template v-if="item.words_tags.values != null && item.words_tags.values.length > 0">
                      <p></p>
                      <template v-for="(subItem, index) in item.words_tags.values"  :key="index">
                        <a @click="handleTagsLink(subItem.ts_id)">
                          <template v-if="subItem.tc_color && subItem.tc_background && subItem.tc_border">
                            <a-tag class="tag-align" :style="
                                  'background:' + subItem.tc_background
                                  + ';color:'+ subItem.tc_color
                                  +';border-color:'+ subItem.tc_border">
                              {{ subItem.ts_name }}
                            </a-tag>
                          </template>
                          <template v-else>
                            <a-tag class="tag-align" color="default">
                              {{ subItem.ts_name }}
                            </a-tag>
                          </template>
                        </a>
                      </template>
                    </template>
                  </template>
                </a-card>
              </a-list-item>
              </template>
            </a-list>
          </div>
        </a-spin>
    </template>
    <!-- drawer words add -->
    <div class="drawer-theme" ref="wordsDrawer" :class="$theme">
      <a-drawer
          :getContainer = "()=>$refs.wordsDrawer"
          placement="left"
          :width="this.drawerWidth"
          :visible="this.drawerVisible"
          @close="this.drawerVisible = false"
        >
          <WordsAddView />
      </a-drawer>
    </div>

</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref, reactive, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { StarFilled, HeartFilled } from '@ant-design/icons-vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import WordsAddView from '@/views/WordsAddView.vue'
import PlusBtn from '@/components/button/PlusBtn.vue'
import DeleteBtn from '@/components/button/DeleteBtn.vue'
import XmarkBtn from '@/components/button/XmarkBtn.vue'

export default {
  name: 'WordsGridView',
  components: {
    StarFilled,
    HeartFilled,
    DeleteBtn,
    PlusBtn,
    XmarkBtn,
    TagsTreeSelect,
    WordsAddView
  },
  computed: {
    filterWordsResult () {
      return this.filterWords(
        this.$keyword, this.$filters, this.$filtersTags, this.choiceArray,
        this.tagsOperator, this.choiceOperator
      )
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
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$desktop']),
    ...mapState('Screen', ['$tablet']),
    ...mapState('Screen', ['$mobile'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    ...mapActions('WordsStore', ['updateCommon']),
    ...mapActions('WordsStore', ['updateImportant']),
    ...mapActions('WordsStore', ['deleteById']),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateFiltersTags']),
    ...mapActions('Search', ['pushFiltersTags']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Views', ['updateWordsGrid']),
    ...mapActions('Views', ['updateWordsGroupsView']),
    // ---- actions ----
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
    // ---- filter ----
    async handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      await new Promise(resolve => setTimeout(resolve, 100))
      window.scrollTo({ top: 180, behavior: 'instant' })
    },
    async handleTagsChange () {
      await this.updateFiltersTags(this.tagsArray)
    },
    async handleTagsLink (val) {
      await this.onResetAll()
      this.tagsArray.push(val)
      await this.updateFiltersTags(this.tagsArray)
      await new Promise(resolve => setTimeout(resolve, 100))
      window.scrollTo({ top: 180, behavior: 'instant' })
    },
    // ---- set value in vuex ----
    setItemShow () {
      this.updateWordsGrid({ variable: 'isItemsState', data: this.isItemsState })
    },
    setFilterItems () {
      this.updateWordsGrid({ variable: 'filterItemsState', data: this.filterItemsState })
    },
    // ---- clear button ----
    async onResetSearch () {
      this.updateKeyword('')
    },
    async onResetTags () {
      this.tagsArray = []
      await this.updateFiltersTags([])
    },
    async onResetAll () {
      this.onResetSearch()
      this.onResetTags()
      this.choiceArray = []
      this.setFilterItems()
    },
    // ---- set page ----
    setPageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    setPaginationCurrent () {
      this.pagination.current = Number(this.currentPage)
    },
    // ---- scroll setting ----
    setDetailsClick () {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      this.updateWordsGrid({ variable: 'currentScrollY', data: scrollY })
      this.updateWordsGrid({ variable: 'currentPage', data: this.currentPage })
      this.updateWordsGrid({ variable: 'jumpPage', data: false })
      this.updateWordsGrid({ variable: 'currentPageSize', data: this.selectPageSize })
    },
    // ---- set default ----
    setPagination () {
      this.pagination.pageSize = Number(this.$WordsGrid.currentPageSize)
      this.selectPageSize = this.$WordsGrid.currentPageSize
      this.pagination.current = Number(this.$WordsGrid.currentPage)
      this.currentPage = this.pagination.current
    },
    setDefaultFromState () {
      this.tagsArray = this.$filtersTags
      const filterItemsStateProperty = Object.keys(this.filterItemsState)
      filterItemsStateProperty.forEach(property => {
        this.filterItemsState[property] = this.$WordsGrid.filterItemsState[property]
      })
      const isItemsStateProperty = Object.keys(this.isItemsState)
      isItemsStateProperty.forEach(property => {
        this.isItemsState[property] = this.$WordsGrid.isItemsState[property]
      })
      this.AfterReady = true
    },
    // ---- words groups ----
    clickGroupAdd () {
      if (this.checkboxShow === true && this.$WordsGroupsView.groupArray.length === 0) {
        this.checkboxShow = false
      } else {
        this.checkboxShow = true
      }
    },
    changeCheckbox (id, wsName) {
      if (this.checkboxArray[id]) {
        this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: true } })
      } else {
        this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: false } })
      }
      this.setCheckbox()
    },
    setCheckbox () {
      if (this.$WordsGroupsView.groupArray.length > 0) {
        this.checkboxShow = true
        this.checkboxBtn = true
      }
    },
    // drawer
    onDrawerShow () {
      this.setDrawerStyle()
      this.drawerVisible = true
    },
    setDrawerStyle () {
      this.drawerWidth = this.drawerWidthMap[
        this.$desktop ? 'desktop' : this.$tablet ? 'tablet' : this.$mobile ? 'mobile' : 'desktop'
      ]
    }
  },
  async created () {
    try {
      await this.fetch()
      this.setDefaultFromState()
      this.Ready = true
    } catch (error) {}
  },
  beforeRouteLeave (to, from, next) {
    this.setDetailsClick()
    next()
  },
  watch: {
    Ready (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // set page checkbox
          if (this.$WordsGrid.jumpPage === true) {
            this.setPagination()
          }
          this.setCheckbox()
        })
      }
    },
    AfterReady (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // run scroll after page setting
          if (this.$WordsGrid.jumpScroll === true) {
            window.scrollTo({ top: this.$WordsGrid.currentScrollY, behavior: 'instant' })
            this.updateWordsGrid({ variable: 'jumpScroll', data: false })
          }
        })
      }
    },
    // tags filters
    '$filtersTags.length' (val) {
      if (val !== this.tagsArray.length) {
        this.tagsArray = this.$filtersTags
      }
    },
    // words groups checkbox
    checkboxArray (val) {
      if (Object.keys(val).length === 0) {
        this.checkboxShow = false
        this.checkboxBtn = false
      }
    },
    '$desktop' (val) {
      this.setDrawerStyle()
    },
    '$tablet' (val) {
      this.setDrawerStyle()
    },
    '$mobile' (val) {
      this.setDrawerStyle()
    }
  },
  setup () {
    const Ready = ref(false)
    const AfterReady = ref(false)
    const ReadySpinning = ref(false)
    const filterShow = ref(true)
    const tagsArray = ref([])
    const selectPageSize = ref('20')
    const currentPage = ref(1)
    const dataSize = ref(0)
    const checkboxShow = ref(false)
    const checkboxBtn = ref(false)
    const drawerVisible = ref(false)
    const drawerWidth = ref(500)
    const drawerWidthMap = {
      desktop: 500,
      tablet: 400,
      mobile: 300
    }

    const pagination = reactive({
      onChange: page => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'bottom',
      showSizeChanger: false
    })

    const filterItemsState = reactive({
      tagsOperator: 'or',
      choiceArray: [],
      choiceOperator: 'or'
    })
    const isItemsState = reactive({
      isPronunciation: true,
      isDefinition: true,
      isSlogan: false,
      isCate: false,
      isTag: true
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
      filterShow,
      tagsArray,
      choiceArrayOptions,
      checkboxShow,
      checkboxBtn,
      pagination,
      selectPageSize,
      currentPage,
      dataSize,
      drawerVisible,
      drawerWidth,
      drawerWidthMap,
      filterItemsState,
      ...toRefs(filterItemsState),
      isItemsState,
      ...toRefs(isItemsState)
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
.category-keyword-text{
    color:$category-keyword-color;
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
