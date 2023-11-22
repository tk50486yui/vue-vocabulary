<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>單字總覽</h4>
      <a class="float-end text-warning" @click="filterShow = !filterShow">
        <font-awesome-icon :icon="['fas', 'filter']" />
      </a>
    </div>
    <!-- 過濾器 -->
    <template v-if="filterShow">
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
                key: 'id'
              }"
              @change="handleTagsChange()"
              multiple
            />
          </a-col>
          <a-col :span="2" class="d-flex align-items-center">
            <template v-if="$filtersTags.length > 0">
              <CloseBtn
                class="d-flex align-items-center"
                @click="onResetTags()"
              />
            </template>
          </a-col>
        </a-row>
      </a-input-group>
      <p></p>
      <!-- 第二層 tags filter -->
      <span class="d-flex align-items-center">
        <el-tag effect="dark" type="warning" :color="labelColor" round>
          標籤條件
        </el-tag>
        <span style="margin-left: 8px">
          <OperatorRadio
            v-model:value="tagsOperator"
            @change="setFilterItems()"
          />
        </span>
      </span>
      <p></p>
      <!-- 第三層 heart star -->
      <span class="d-flex align-items-center">
        <el-tag effect="dark" type="warning" :color="labelColor" round>
          標記條件
        </el-tag>
        <span style="margin-left: 8px">
          <OperatorRadio
            v-model:value="choiceOperator"
            @change="setFilterItems()"
          />
          <a-checkbox-group
            v-model:value="choiceArray"
            :options="choiceArrayOptions"
            @change="setFilterItems()"
          >
            <template #label="{ value }">
              <span class="icon-theme" :class="$theme">
                <div class="choice-container">
                  <template v-if="value === 'ws_is_important'">
                    <span class="icon-heart">
                      <a class="choice-heart">
                        <HeartFilled />
                      </a>
                    </span>
                  </template>
                  <template v-if="value === 'ws_is_common'">
                    <span class="icon-star">
                      <a class="choice-star">
                        <StarFilled />
                      </a>
                    </span>
                  </template>
                </div>
              </span>
            </template>
          </a-checkbox-group>
        </span>
      </span>
      <p></p>
      <!-- 第四層 show -->
      <span class="d-flex align-items-center">
        <el-tag effect="dark" type="warning" :color="labelColor" round>
          顯示項目
        </el-tag>
        <span class="checkbox-theme" style="margin-left: 8px" :class="$theme">
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
      </span>
      <p></p>
    </template>
    <!-- groups add -->
    <a-button
      class="btn btn-dark btn-outline-light btn-sm rounded"
      @click="clickGroupAdd()"
      :disabled="btnDisibled"
    >
      <template v-if="checkboxShow === false">
        <font-awesome-icon :icon="['fas', 'plus']" /> 單詞群組
      </template>
      <template v-else>
        <template v-if="$WordsGroupsView.groupArray.length === 0">
          請勾選單詞或點擊取消
        </template>
        <template v-else> 請繼續勾選單詞 </template>
      </template>
    </a-button>
    <PlusBtn
      class="btn btn-primary btn-outline-light btn-sm float-end me-md-3"
      @click="onDrawerShow()"
    />
    <!-- 主頁面 card -->
    <a-spin :spinning="ReadySpinning">
      <div class="list-card-theme" :class="$theme" ref="listCard">
        <a-list
          :data-source="filterWordsResult"
          :pagination="pagination"
          :grid="{
            gutter: 0,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
            xxxl: 3
          }"
        >
          <!-- card header -->
          <template #header>
            <div
              class="select-theme d-flex align-items-center"
              :class="$theme"
              ref="selectMod"
            >
              每頁：
              <a-select
                v-model:value="selectPageSize"
                :getPopupContainer="() => $refs.selectMod"
                size="small"
                style="width: 80px"
                @change="setPageSize()"
              >
                <a-select-option value="10">10 筆</a-select-option>
                <a-select-option value="20">20 筆</a-select-option>
                <a-select-option value="50">50 筆</a-select-option>
                <a-select-option value="100">100 筆</a-select-option>
                <a-select-option :value="words.length">全部</a-select-option>
              </a-select>
              <span style="margin-left: 8px">當前：</span>
              <a-select
                v-model:value="currentPage"
                :getPopupContainer="() => $refs.selectMod"
                size="small"
                style="width: 80px"
                @change="setPaginationCurrent()"
              >
                <template
                  v-for="index in Math.ceil(
                    words.length / Number(selectPageSize)
                  )"
                  :key="index"
                >
                  <a-select-option :value="index"
                    >第 {{ index }} 頁</a-select-option
                  >
                </template>
              </a-select>
              <span style="margin-left: 8px">
                <el-tag
                  class="d-flex align-items-center"
                  effect="dark"
                  size="small"
                  type="success"
                  color="black"
                  round
                >
                  關鍵字：
                  <template v-if="$keyword != '' && $filters.length > 0">
                    <template
                      v-if="
                        $filters.length === 1 && $filters.includes('cate_name')
                      "
                    >
                      `
                      <span class="category-keyword-text">{{ $keyword }} </span
                      >`
                    </template>
                    <template v-else>
                      ` <span class="keyword-text">{{ $keyword }} </span>`
                    </template>
                  </template>
                  <template v-else> 無 </template>
                </el-tag>
              </span>
              <span style="margin-left: 8px">
                <el-tag
                  class="d-flex align-items-center"
                  effect="dark"
                  size="small"
                  color="black"
                  round
                >
                  共 {{ filterWordsResult.length }} 筆
                </el-tag>
              </span>
              <span style="margin-left: 6px">
                <template v-if="$keyword != ''">
                  <CloseBtn
                    class="d-flex align-items-center"
                    @click="onResetSearch()"
                  />
                </template>
              </span>
            </div>
          </template>
          <!-- card main -->
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
                    <template
                      v-if="item.cate_name == null || item.cate_name == ''"
                    >
                      --
                    </template>
                    <template v-else>
                      <template
                        v-if="
                          $keyword != '' &&
                          $filters.includes('cate_name') &&
                          item.cate_name.includes($keyword)
                        "
                      >
                        <a @click="handleCategoryFilter(item.cate_name)">
                          <template
                            v-for="(char, index) in item.cate_name"
                            :key="char + index"
                          >
                            <span
                              :class="{
                                'category-keyword-text': $keyword.includes(char)
                              }"
                            >
                              {{ char }}
                            </span>
                          </template>
                        </a>
                      </template>
                      <template v-else>
                        <a @click="handleCategoryFilter(item.cate_name)">
                          {{ item.cate_name }}
                        </a>
                      </template>
                    </template>
                  </template>
                </template>
                <!-- checkbox -->
                <template
                  v-if="
                    $WordsGroupsDetailsView.updateNow === true ||
                    checkboxShow === true
                  "
                >
                  <a-checkbox
                    v-model:checked="checkboxArray[item.id]"
                    @change="changeCheckbox(item.id, item.ws_name)"
                  ></a-checkbox>
                  <p></p>
                </template>
                <!-- Icon Star Heart -->
                <span class="icon-theme" :class="$theme">
                  <template v-if="item.ws_is_common">
                    <span class="icon-star">
                      <a @click="onUpdateCommon(item.id, item)">
                        <StarFilled />
                      </a>
                    </span>
                  </template>
                  <template v-else>
                    <span class="icon-star-false">
                      <a @click="onUpdateCommon(item.id, item)">
                        <StarFilled />
                      </a>
                    </span>
                  </template>
                  <template v-if="item.ws_is_important">
                    <span class="icon-heart">
                      <a @click="onUpdateImportant(item.id, item)">
                        <HeartFilled />
                      </a>
                    </span>
                  </template>
                  <template v-else>
                    <span class="icon-heart-false">
                      <a @click="onUpdateImportant(item.id, item)">
                        <HeartFilled />
                      </a>
                    </span>
                  </template>
                  <span class="icon-delete">
                    <DeleteBtn @confirm="onDelete(item.id)" />
                  </span>
                </span>
                <p></p>
                <!-- ws_name -->
                <template
                  v-if="
                    $keyword != '' &&
                    $filters.includes('ws_name') &&
                    item.ws_name.includes($keyword)
                  "
                >
                  <router-link
                    :to="{ name: 'wordDetails', params: { id: item.id } }"
                    @click="setDetailsClick()"
                  >
                    <template
                      v-for="(char, index) in item.ws_name"
                      :key="char + index"
                    >
                      <span
                        :class="{ 'keyword-text': $keyword.includes(char) }"
                      >
                        {{ char }}
                      </span>
                    </template>
                  </router-link>
                </template>
                <template v-else>
                  <router-link
                    :to="{ name: 'wordDetails', params: { id: item.id } }"
                  >
                    {{ item.ws_name }}
                  </router-link>
                </template>
                <!-- ws_pronunciation -->
                <template v-if="isPronunciation">
                  <p></p>
                  <template
                    v-if="
                      item.ws_pronunciation == null ||
                      item.ws_pronunciation == ''
                    "
                  >
                    <br />
                  </template>
                  <template v-else>
                    <template
                      v-if="
                        $keyword != '' &&
                        $filters.includes('ws_pronunciation') &&
                        item.ws_pronunciation.includes($keyword)
                      "
                    >
                      <template
                        v-for="(char, index) in item.ws_pronunciation"
                        :key="char + index"
                      >
                        <span
                          :class="{ 'keyword-text': $keyword.includes(char) }"
                        >
                          {{ char }}
                        </span>
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
                  <template
                    v-if="
                      item.ws_definition == null || item.ws_definition == ''
                    "
                  >
                    <br />
                  </template>
                  <template v-else>
                    <template
                      v-if="
                        $keyword != '' &&
                        $filters.includes('ws_definition') &&
                        item.ws_definition.includes($keyword)
                      "
                    >
                      <template
                        v-for="(char, index) in item.ws_definition"
                        :key="char + index"
                      >
                        <span
                          :class="{ 'keyword-text': $keyword.includes(char) }"
                        >
                          {{ char }}
                        </span>
                      </template>
                    </template>
                    <template v-else>
                      {{ item.ws_definition }}
                    </template>
                  </template>
                </template>
                <!-- ws_slogan -->
                <template v-if="isSlogan">
                  <template
                    v-if="item.ws_slogan != null && item.ws_slogan != ''"
                  >
                    <p></p>
                    {{ item.ws_slogan }}
                  </template>
                </template>
                <!-- tags -->
                <template v-if="isTag">
                  <template
                    v-if="
                      item.words_tags.values != null &&
                      item.words_tags.values.length > 0
                    "
                  >
                    <p></p>
                    <template
                      v-for="(subItem, index) in item.words_tags.values"
                      :key="index"
                    >
                      <a @click="handleTagsLink(subItem.ts_id)">
                        <template
                          v-if="
                            subItem.tc_color &&
                            subItem.tc_background &&
                            subItem.tc_border
                          "
                        >
                          <a-tag
                            class="tag-align"
                            :style="
                              'background:' +
                              subItem.tc_background +
                              ';color:' +
                              subItem.tc_color +
                              ';border-color:' +
                              subItem.tc_border
                            "
                          >
                            {{ subItem.ts_name }}
                          </a-tag>
                        </template>
                        <template v-else>
                          <a-tag
                            class="tag-align"
                            color="default"
                            style="color: #fff"
                          >
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
  <WordsDrawerView
    ref="wordsDrawerRef"
    :open="wordsDrawerVisible"
    @close="wordsDrawerVisible = false"
  />
</template>

<script lang="ts">
import { ref, reactive, toRefs, defineComponent } from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'
import { PlusBtn, DeleteBtn, CloseBtn } from '@/components/button'
import OperatorRadio from '@/components/radio/OperatorRadio.vue'
import WordsDrawerView from '@/views/WordsDrawerView.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import { Word } from '@/interfaces/Words'

export default defineComponent({
  name: 'WordsGridView',
  components: {
    WordsDrawerView,
    TagsTreeSelect,
    PlusBtn,
    DeleteBtn,
    CloseBtn,
    OperatorRadio
  },
  computed: {
    filterWordsResult() {
      return this.filterWords(
        this.$keyword,
        this.$filters,
        this.$filtersTags,
        this.tagsOperator,
        this.choiceArray,
        this.choiceOperator
      )
    },
    checkboxArray() {
      const newArray: Record<number, boolean> = {}
      for (const item of this.$WordsGroupsView.groupArray) {
        newArray[item.ws_id] = item.checked
      }
      return newArray
    },
    btnDisibled() {
      return this.$WordsGroupsDetailsView.updateNow || this.checkboxBtn
    },
    ...mapGetters('WordsStore', ['words', 'filterWords']),
    ...mapState('Search', [
      '$keyword',
      '$searchClass',
      '$filters',
      '$filtersTags'
    ]),
    ...mapState('Views', [
      '$WordsGrid',
      '$WordsGroupsView',
      '$WordsGroupsDetailsView'
    ]),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$desktop'])
  },
  methods: {
    ...mapActions('WordsStore', [
      'fetch',
      'updateCommon',
      'updateImportant',
      'deleteById'
    ]),
    ...mapActions('Search', [
      'updateKeyword',
      'updateFilters',
      'updateFiltersTags',
      'pushFiltersTags',
      'updateSearchClass'
    ]),
    ...mapActions('Views', ['updateWordsGrid', 'updateWordsGroupsView']),
    // ---- actions ----
    async onUpdateCommon(id: number, data: Word): Promise<void> {
      try {
        data.ws_is_common = !data.ws_is_common
        await this.updateCommon({ id: id, data: data })
      } catch (error) {
        //
      }
    },
    async onUpdateImportant(id: number, data: Word): Promise<void> {
      try {
        data.ws_is_important = !data.ws_is_important
        await this.updateImportant({ id: id, data: data })
      } catch (error) {
        //
      }
    },
    async onDelete(id: number): Promise<void> {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.deleteById(id)
      } catch (error) {
        //
      }
    },
    // ---- filter ----
    async handleCategoryFilter(cateName: string): Promise<void> {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      await new Promise((resolve) => setTimeout(resolve, 100))
      window.scrollTo({ top: 180, behavior: 'instant' })
    },
    async handleTagsChange(): Promise<void> {
      await this.updateFiltersTags(this.tagsArray)
    },
    async handleTagsLink(val: number): Promise<void> {
      await this.onResetAll()
      this.tagsArray.push(val)
      await this.updateFiltersTags(this.tagsArray)
      await new Promise((resolve) => setTimeout(resolve, 100))
      window.scrollTo({ top: 180, behavior: 'instant' })
    },
    // ---- set value in vuex ----
    setItemShow(): void {
      this.updateWordsGrid({
        variable: 'isItemsState',
        data: this.isItemsState
      })
    },
    setFilterItems(): void {
      this.updateWordsGrid({
        variable: 'filterItemsState',
        data: this.filterItemsState
      })
    },
    // ---- clear button ----
    async onResetSearch(): Promise<void> {
      this.updateKeyword('')
    },
    async onResetTags(): Promise<void> {
      this.tagsArray = []
      await this.updateFiltersTags([])
    },
    async onResetAll(): Promise<void> {
      this.onResetSearch()
      this.onResetTags()
      this.choiceArray = []
      this.setFilterItems()
    },
    // ---- set page ----
    setPageSize(): void {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    setPaginationCurrent(): void {
      this.pagination.current = Number(this.currentPage)
    },
    // ---- scroll setting ----
    setDetailsClick(): void {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.updateWordsGrid({ variable: 'currentScrollY', data: scrollY })
      this.updateWordsGrid({ variable: 'currentPage', data: this.currentPage })
      this.updateWordsGrid({ variable: 'jumpPage', data: false })
      this.updateWordsGrid({
        variable: 'currentPageSize',
        data: this.selectPageSize
      })
    },
    // ---- set default ----
    setPagination(): void {
      this.pagination.pageSize = Number(this.$WordsGrid.currentPageSize)
      this.selectPageSize = this.$WordsGrid.currentPageSize
      this.pagination.current = Number(this.$WordsGrid.currentPage)
      this.currentPage = this.pagination.current
    },
    setDefaultFromState(): void {
      this.tagsArray = this.$filtersTags
      const filterItemsStateProperty = Object.keys(this.filterItemsState)
      filterItemsStateProperty.forEach((property) => {
        const propName = property as keyof typeof this.filterItemsState
        this.filterItemsState[propName] =
          this.$WordsGrid.filterItemsState[property]
      })
      const isItemsStateProperty = Object.keys(this.isItemsState)
      isItemsStateProperty.forEach((property) => {
        const propName = property as keyof typeof this.isItemsState
        this.isItemsState[propName] = this.$WordsGrid.isItemsState[property]
      })
      this.AfterReady = true
    },
    // ---- words groups ----
    clickGroupAdd(): void {
      if (
        this.checkboxShow === true &&
        this.$WordsGroupsView.groupArray.length === 0
      ) {
        this.checkboxShow = false
      } else {
        this.checkboxShow = true
      }
    },
    changeCheckbox(id: number, wsName: string) {
      if (this.checkboxArray[id]) {
        this.updateWordsGroupsView({
          variable: 'groupArray',
          data: { ws_id: id, ws_name: wsName, checked: true }
        })
      } else {
        this.updateWordsGroupsView({
          variable: 'groupArray',
          data: { ws_id: id, ws_name: wsName, checked: false }
        })
      }
      this.setCheckbox()
    },
    setCheckbox() {
      if (this.$WordsGroupsView.groupArray.length > 0) {
        this.checkboxShow = true
        this.checkboxBtn = true
      }
    },
    // drawer
    onDrawerShow() {
      this.wordsDrawerRef.setDrawerStyle()
      this.wordsDrawerVisible = true
    }
  },
  async created() {
    try {
      await this.fetch()
      this.setDefaultFromState()
      this.Ready = true
    } catch (error) {
      //
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setDetailsClick()
    next()
  },
  watch: {
    Ready(newVal: boolean) {
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
    AfterReady(newVal: boolean) {
      if (newVal) {
        this.$nextTick(() => {
          // run scroll after page setting
          if (this.$WordsGrid.jumpScroll === true) {
            window.scrollTo({
              top: this.$WordsGrid.currentScrollY,
              behavior: 'instant'
            })
            this.updateWordsGrid({ variable: 'jumpScroll', data: false })
          }
        })
      }
    },
    // tags filters
    '$filtersTags.length'(val: number) {
      if (val !== this.tagsArray.length) {
        this.tagsArray = this.$filtersTags
      }
    },
    // words groups checkbox
    checkboxArray(val) {
      if (Object.keys(val).length === 0) {
        this.checkboxShow = false
        this.checkboxBtn = false
      }
    }
  },
  setup() {
    const Ready = ref(false)
    const AfterReady = ref(false)
    const ReadySpinning = ref(false)
    const filterShow = ref(true)
    const tagsArray = ref<number[]>([])
    const selectPageSize = ref('20')
    const currentPage = ref(1)
    const dataSize = ref(0)
    const checkboxShow = ref(false)
    const checkboxBtn = ref(false)
    const wordsDrawerRef = ref()
    const wordsDrawerVisible = ref(false)
    const labelColor = ref('rgba(59, 39, 12, 1)')

    const pagination = reactive({
      onChange: (page: number) => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'bottom',
      showSizeChanger: false,
      current: currentPage.value
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
      wordsDrawerRef,
      wordsDrawerVisible,
      labelColor,
      filterItemsState,
      ...toRefs(filterItemsState),
      isItemsState,
      ...toRefs(isItemsState)
    }
  }
})
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
  content: '';
}

.section-title a {
  cursor: pointer;
}

.keyword-text {
  color: $keyword-color;
}

.category-keyword-text {
  color: $category-keyword-color;
}

.icon-star {
  padding-left: 2px;
  padding-right: 8px;
}

.icon-star-false {
  padding-left: 2px;
  padding-right: 8px;
}

.icon-delete {
  float: right;
}

.choice-container {
  display: flex;
  align-items: center;
}

.choice-heart {
  display: flex;
}

.choice-star {
  display: flex;
}

.tag-align {
  margin-top: 6px;
}
</style>