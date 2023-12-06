<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>單字總覽</h4>
      <a
        class="float-end"
        @click="filterShow = !filterShow"
        :class="{ 'text-warning': !filterShow, 'text-secondary': filterShow }"
      >
        <font-awesome-icon :icon="['fas', 'filter']" />
      </a>
    </div>
    <!-- 過濾器 -->
    <div v-show="filterShow">
      <!-- 第一層 tags select -->
      <a-input-group>
        <a-row :gutter="4">
          <a-col :span="18">
            <TagsTreeSelect
              ref="filtersTagsTreeSelectRef"
              size="small"
              placeholder="以標籤過濾資料"
              style="width: 100%"
              v-model:value="tagsArray"
              :treeDefaultExpandedKeys="tagsArray"
              multiple
            />
          </a-col>
          <a-col :span="2" class="d-flex align-items-center">
            <template v-if="tagsArray.length > 0">
              <CloseBtn class="d-flex align-items-center" @click="onResetTags()" />
            </template>
          </a-col>
        </a-row>
      </a-input-group>
      <p></p>
      <!-- 第二層 tags filter -->
      <span class="d-flex align-items-center">
        <el-tag effect="dark" type="warning" :color="labelColor" round> 標籤條件 </el-tag>
        <span style="margin-left: 8px">
          <OperatorRadio v-model:value="tagsOperator" @change="setFilterItems" />
        </span>
      </span>
      <p></p>
      <!-- 第三層 heart star -->
      <span class="d-flex align-items-center">
        <el-tag effect="dark" type="warning" :color="labelColor" round> 標記條件 </el-tag>
        <span style="margin-left: 8px">
          <OperatorRadio v-model:value="choiceOperator" @change="setFilterItems" />
          <a-checkbox-group
            v-model:value="choiceArray"
            :options="choiceArrayOptions"
            @change="setFilterItems"
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
        <el-tag effect="dark" type="warning" :color="labelColor" round> 顯示項目 </el-tag>
        <span class="checkbox-theme" style="margin-left: 8px" :class="$theme">
          <a-checkbox v-model:checked="isPronunciation" @change="setItemShow()"> 仮名 </a-checkbox>
          <a-checkbox v-model:checked="isDefinition" @change="setItemShow()"> 中譯 </a-checkbox>
          <a-checkbox v-model:checked="isSlogan" @change="setItemShow()"> 短句 </a-checkbox>
          <a-checkbox v-model:checked="isCate" @change="setItemShow()"> 類別 </a-checkbox>
          <a-checkbox v-model:checked="isTag" @change="setItemShow()"> 標籤 </a-checkbox>
          <a-checkbox v-model:checked="isForget" @change="setItemShow()"> 程度條 </a-checkbox>
        </span>
      </span>
      <p></p>
    </div>
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
        <template v-if="$WordsGroupsView.groupArray.length === 0"> 請勾選單詞或點擊取消 </template>
        <template v-else> 請繼續勾選單詞 </template>
      </template>
    </a-button>
    <PlusBtn
      class="btn btn-primary btn-outline-light btn-sm float-end me-md-3"
      @click="onDrawerShow()"
    />
    <!-- 主頁面 card -->
    <div class="list-card-theme" :class="$theme" ref="listCard">
      <a-list
        :data-source="filterWordsResult"
        :pagination="pagination"
        :grid="{
          gutter: 0,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
          xxxl: 3
        }"
      >
        <!-- card header -->
        <template #header>
          <div class="select-theme" :class="$theme" ref="selectMod">
            <a-space size="small" wrap>
              <span class="d-flex align-items-center">
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
              </span>
              <span class="d-flex align-items-center"
                >當前：
                <a-select
                  v-model:value="currentPage"
                  :getPopupContainer="() => $refs.selectMod"
                  size="small"
                  style="width: 80px"
                  @change="setPaginationCurrent()"
                >
                  <template v-for="index in wordsCount" :key="index">
                    <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                  </template>
                </a-select>
              </span>
              <span class="d-flex align-items-center">
                <el-tag
                  class="d-flex align-items-center"
                  effect="dark"
                  size="small"
                  type="success"
                  color="black"
                  round
                >
                  關鍵字：
                  <template v-if="$keyword !== '' && $filters.length > 0">
                    <template v-if="$filters.length === 1 && $filters.includes('cate_name')">
                      `
                      <span class="category-keyword-text">{{ $keyword }} </span>`
                    </template>
                    <template v-else>
                      ` <span class="keyword-text">{{ $keyword }} </span>`
                    </template>
                  </template>
                  <template v-else> 無 </template>
                </el-tag>
              </span>
              <span class="d-flex align-items-center">
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
              <span class="d-flex align-items-center">
                <template v-if="$keyword != ''">
                  <CloseBtn class="d-flex align-items-center" @click="onResetSearch()" />
                </template>
              </span>
              <span class="d-flex align-items-center">
                <WordsSortSelect
                  v-model:value="sortValue"
                  placeholder="依條件排序..."
                  size="small"
                  style="width: 160px"
                  @change="setFilterItems"
                />
              </span>
            </a-space>
          </div>
        </template>
        <!-- card main -->
        <p></p>
        <template #renderItem="{ item }">
          <a-list-item>
            <a-spin :spinning="ReadySpinning" size="large">
              <a-card>
                <!-- cate_name -->
                <template #title>
                  <template v-if="isCate">
                    <template v-if="editTableData[item.id]">
                      <CategoriesTreeSelect
                        placeholder="詞語主題分類"
                        size="small"
                        :style="'width:100%'"
                        v-model:value="editTableData[item.id]['cate_id']"
                        :defaultValue="item.cate_id"
                        :treeDefaultExpandedKeys="[item.cate_id]"
                      />
                    </template>
                    <template v-else>
                      <a-row>
                        <a-col :span="24" :offset="editTableData[item.id] ? 0 : 1">
                          <template v-if="item.cate_name == null || item.cate_name == ''">
                            --
                          </template>
                          <template v-else>
                            【
                            <template
                              v-if="
                                $keyword !== '' &&
                                $filters.includes('cate_name') &&
                                item.cate_name.includes($keyword)
                              "
                            >
                              <a @click="handleCategoryFilter(item.cate_name)">
                                <template v-for="(char, index) in item.cate_name" :key="index">
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
                            】
                          </template>
                        </a-col>
                      </a-row>
                    </template>
                  </template>
                </template>
                <!-- checkbox -->
                <template
                  v-if="$WordsGroupsDetailsView.updateNow === true || checkboxShow === true"
                >
                  <a-checkbox
                    v-model:checked="checkboxArray[item.id]"
                    @change="changeCheckbox(item.id, item.ws_name)"
                  ></a-checkbox>
                  <p></p>
                </template>
                <a-row :gutter="[8, 16]">
                  <!-- Icon Star Heart -->
                  <a-col :span="24" :offset="1">
                    <span class="icon-theme" :class="$theme">
                      <a-space size="small" align="start">
                        <span
                          :class="{
                            'icon-star': item.ws_is_common,
                            'icon-star-false': !item.ws_is_common
                          }"
                        >
                          <a @click="onUpdateCommon(item.id, item)">
                            <StarFilled />
                          </a>
                        </span>
                        <span
                          :class="{
                            'icon-heart': item.ws_is_important,
                            'icon-heart-false': !item.ws_is_important
                          }"
                        >
                          <a @click="onUpdateImportant(item.id, item)">
                            <HeartFilled />
                          </a>
                        </span>
                        <a-typography-paragraph
                          :copyable="{ text: item.ws_name }"
                        ></a-typography-paragraph>
                      </a-space>
                      <template v-if="editTableData[item.id]">
                        <span class="float-end">
                          <a-space size="large" align="start">
                            <DeleteBtn @confirm="onDelete(item.id)" />
                            <CheckOutlined class="text-success" @click="onEditFinish(item)" />
                            <CloseOutlined class="text-danger" @click="cancel(item)" />
                          </a-space>
                        </span>
                      </template>
                      <template v-else>
                        <span class="float-end">
                          <EditOutlined class="text-info" @click="edit(item, wordsArray)" />
                        </span>
                      </template>
                    </span>
                  </a-col>
                  <!-- ws_name -->
                  <a-col :span="24" :offset="editTableData[item.id] ? 0 : 1">
                    <template v-if="editTableData[item.id]">
                      <span class="input-theme" :class="$theme">
                        <a-input
                          v-model:value="editTableData[item.id]['ws_name']"
                          size="small"
                          style="width: 100%; background-color: transparent"
                          :bordered="false"
                        />
                      </span>
                    </template>
                    <template v-else>
                      <template
                        v-if="
                          $keyword != '' &&
                          $filters.includes('ws_name') &&
                          item.ws_name.includes($keyword)
                        "
                      >
                        <router-link :to="{ name: 'wordDetails', params: { id: item.id } }">
                          <template v-for="(char, index) in item.ws_name" :key="index">
                            <span :class="{ 'keyword-text': $keyword.includes(char) }">
                              {{ char }}
                            </span>
                          </template>
                        </router-link>
                      </template>
                      <template v-else>
                        <router-link :to="{ name: 'wordDetails', params: { id: item.id } }">
                          {{ item.ws_name }}
                        </router-link>
                      </template>
                    </template>
                  </a-col>
                  <!-- ws_pronunciation -->
                  <template v-if="isPronunciation">
                    <a-col :span="24" :offset="editTableData[item.id] ? 0 : 1">
                      <template v-if="editTableData[item.id]">
                        <span class="input-theme" :class="$theme">
                          <a-input
                            v-model:value="editTableData[item.id]['ws_pronunciation']"
                            placeholder="輸入發音或假名..."
                            size="small"
                            style="width: 100%; background-color: transparent"
                            :bordered="false"
                          />
                        </span>
                      </template>
                      <template v-else>
                        <template
                          v-if="item.ws_pronunciation == null || item.ws_pronunciation == ''"
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
                            <template v-for="(char, index) in item.ws_pronunciation" :key="index">
                              <span :class="{ 'keyword-text': $keyword.includes(char) }">
                                {{ char }}
                              </span>
                            </template>
                          </template>
                          <template v-else>
                            {{ item.ws_pronunciation }}
                          </template>
                        </template>
                      </template>
                    </a-col>
                  </template>

                  <!-- ws_definition -->
                  <template v-if="isDefinition">
                    <a-col :span="24" :offset="editTableData[item.id] ? 0 : 1">
                      <template v-if="editTableData[item.id]">
                        <span class="input-theme" :class="$theme">
                          <a-input
                            placeholder="輸入中譯..."
                            v-model:value="editTableData[item.id]['ws_definition']"
                            size="small"
                            style="width: 100%; background-color: transparent"
                            :bordered="false"
                          />
                        </span>
                      </template>
                      <template v-else>
                        <template v-if="item.ws_definition == null || item.ws_definition == ''">
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
                            <template v-for="(char, index) in item.ws_definition" :key="index">
                              <span :class="{ 'keyword-text': $keyword.includes(char) }">
                                {{ char }}
                              </span>
                            </template>
                          </template>
                          <template v-else>
                            {{ item.ws_definition }}
                          </template>
                        </template>
                      </template>
                    </a-col>
                  </template>
                  <!-- ws_slogan -->
                  <template v-if="isSlogan">
                    <a-col :span="24">
                      <template v-if="editTableData[item.id]">
                        <span class="input-theme" :class="$theme">
                          <a-textarea
                            v-model:value="editTableData[item.id]['ws_slogan']"
                            placeholder="輸入短句..."
                            auto-size
                            size="small"
                            style="width: 100%; background-color: transparent"
                            :bordered="false"
                          />
                        </span>
                      </template>
                      <template v-else>
                        <template v-if="item.ws_slogan != null && item.ws_slogan != ''">
                          <span class="input-theme" :class="$theme">
                            <a-textarea
                              v-model:value="item.ws_slogan"
                              auto-size
                              size="small"
                              style="width: 100%; background-color: transparent"
                              :bordered="false"
                              disabled
                            />
                          </span>
                        </template>
                      </template>
                    </a-col>
                  </template>
                  <!-- ws_forget_count -->
                  <template v-if="isForget">
                    <a-col :span="24" :offset="editTableData[item.id] ? 0 : 1">
                      <template v-if="item.ws_forget_count != null">
                        <span class="slider-theme" :class="$theme">
                          <template v-if="editTableData[item.id]">
                            <a-slider
                              v-model:value="editTableData[item.id]['ws_forget_count']"
                              :min="0"
                              :max="100"
                            />
                          </template>
                          <template v-else>
                            <a-slider
                              v-model:value="item.ws_forget_count"
                              :min="0"
                              :max="100"
                              disabled
                            />
                          </template>
                        </span>
                      </template>
                    </a-col>
                  </template>
                  <!-- tags -->
                  <template v-if="isTag">
                    <a-col :span="24" :offset="editTableData[item.id] ? 0 : 1">
                      <template v-if="editTableData[item.id]">
                        <TagsTreeSelect
                          size="small"
                          placeholder="添加標籤..."
                          style="width: 100%"
                          v-model:value="editTableData[item.id]['words_tags']['array']"
                          :treeDefaultExpandedKeys="editTableData[item.id]['words_tags']['array']"
                          multiple
                        />
                      </template>
                      <template v-else>
                        <template
                          v-if="item.words_tags.values != null && item.words_tags.values.length > 0"
                        >
                          <template v-for="(subItem, index) in item.words_tags.values" :key="index">
                            <a @click="handleTagsLink(subItem.ts_id)">
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
                            </a>
                          </template>
                        </template>
                      </template>
                    </a-col>
                  </template>
                </a-row>
              </a-card>
            </a-spin>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </template>
  <!-- drawer words add -->
  <WordsDrawerView
    ref="wordsDrawerRef"
    :open="wordsDrawerVisible"
    @close="wordsDrawerVisible = false"
  />
  <a-back-top />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, computed, watch, onMounted, onActivated, nextTick } from 'vue'
import { useStore } from 'vuex'
import { onBeforeRouteLeave } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusBtn, DeleteBtn, CloseBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import OperatorRadio from '@/components/radio/OperatorRadio.vue'
import WordsDrawerView from '@/views/WordsDrawerView.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import WordsSortSelect from '@/components/select/WordsSortSelect.vue'
import type { UnwrapRef } from 'vue'
import { Word } from '@/interfaces/Words'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $keyword, $filters, $filtersTags } = toRefs(store.state.Search)
const { $WordsGrid, $WordsGroupsView, $WordsGroupsDetailsView, $SideMenuView } = toRefs(
  store.state.Views
)

const words = computed(() => store.getters['WordsStore/words'])
const wordsArray = computed(() => store.getters['WordsStore/wordsArray'])
const filterWords = computed(() => store.getters['WordsStore/filterWords'])

const filterWordsResult = computed(() =>
  filterWords.value(
    $keyword.value,
    $filters.value,
    $filtersTags.value,
    filterItemsState.tagsOperator,
    filterItemsState.choiceArray,
    filterItemsState.choiceOperator,
    sortValue.value
  )
)

const checkboxArray = computed(() => {
  const newArray: Record<number, boolean> = {}
  for (const item of $WordsGroupsView.value.groupArray) {
    newArray[item.ws_id] = item.checked
  }
  return newArray
})
const btnDisibled = computed(() => $WordsGroupsDetailsView.value.updateNow || checkboxBtn.value)
const wordsCount = computed(() => Math.ceil(words.value.length / Number(selectPageSize.value)) || 1)

const Ready = ref<boolean>(false)
const AfterReady = ref<boolean>(false)
const ReadySpinning = ref<boolean>(false)
const editTableData: UnwrapRef<Record<number, Word>> = reactive({})
const filtersTagsTreeSelectRef = ref()
const filterShow = ref<boolean>(true)
const tagsArray = ref<number[]>([])
const selectPageSize = ref<string>('20')
const currentPage = ref<number>(1)
const checkboxShow = ref<boolean>(false)
const checkboxBtn = ref<boolean>(false)
const wordsDrawerRef = ref()
const wordsDrawerVisible = ref<boolean>(false)
const labelColor = ref<string>('rgba(59, 39, 12, 1)')

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
  choiceOperator: 'or',
  sortValue: ''
})
const { tagsOperator, choiceArray, choiceOperator, sortValue } = toRefs(filterItemsState)
const isItemsState = reactive({
  isPronunciation: true,
  isDefinition: true,
  isSlogan: false,
  isCate: false,
  isTag: true,
  isForget: true
})
const { isPronunciation, isDefinition, isSlogan, isCate, isTag, isForget } = toRefs(isItemsState)
const choiceArrayOptions = [
  {
    value: 'ws_is_important'
  },
  {
    value: 'ws_is_common'
  }
]

const edit = (record: Word, editDataSource: Word[]) => {
  editTableData[record.id] = cloneDeep(editDataSource.filter((item) => record.id === item.id)[0])
}

const cancel = (record: Word) => {
  delete editTableData[record.id]
}

const onEditFinish = async (record: Word): Promise<void> => {
  try {
    const editData = editTableData[record.id]
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsStore/update', { id: editData.id, data: editData })
    cancel(record)
  } catch (e) {
    //
  }
}

const onUpdateCommon = async (id: number, data: Word): Promise<void> => {
  try {
    data.ws_is_common = !data.ws_is_common
    await store.dispatch('WordsStore/updateCommon', { id: id, data: data })
  } catch (e) {
    //
  }
}
const onUpdateImportant = async (id: number, data: Word): Promise<void> => {
  try {
    data.ws_is_important = !data.ws_is_important
    await store.dispatch('WordsStore/updateImportant', { id: id, data: data })
  } catch (e) {
    //
  }
}

const onDelete = async (id: number): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsStore/deleteById', id)
  } catch (e) {
    //
  }
}

// ---- filter ----
const handleCategoryFilter = async (cateName: string): Promise<void> => {
  store.dispatch('Search/updateSearchClass', 'word')
  store.dispatch('Search/updateFilters', ['cate_name'])
  store.dispatch('Search/updateKeyword', cateName)
  await new Promise((resolve) => setTimeout(resolve, 100))
  window.scrollTo({ top: 180, behavior: 'instant' })
}

const handleTagsLink = async (val: number): Promise<void> => {
  await onResetAll()
  tagsArray.value.push(val)
  await store.dispatch('Search/updateFiltersTags', tagsArray.value)
  await new Promise((resolve) => setTimeout(resolve, 100))
  window.scrollTo({ top: 180, behavior: 'instant' })
}

// ---- set value in vuex ----
const setItemShow = (): void => {
  store.dispatch('Views/updateWordsGrid', { variable: 'isItemsState', data: isItemsState })
}
const setFilterItems = (): void => {
  store.dispatch('Views/updateWordsGrid', { variable: 'filterItemsState', data: filterItemsState })
}

// ---- clear button ----
const onResetSearch = async (): Promise<void> => {
  store.dispatch('Search/updateKeyword', '')
}

const onResetTags = async (): Promise<void> => {
  tagsArray.value = []
  filtersTagsTreeSelectRef.value.clearValue()
}
const onResetAll = async (): Promise<void> => {
  onResetSearch()
  onResetTags()
  filterItemsState.choiceArray = []
  setFilterItems()
}

// ---- set page ----
const setPageSize = (): void => {
  pagination.pageSize = Number(selectPageSize.value)
  pagination.current = 1
  currentPage.value = pagination.current
}
const setPaginationCurrent = (): void => {
  pagination.current = Number(currentPage.value)
}
// ---- scroll setting ----
const setDetailsClick = async (): Promise<void> => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
  store.dispatch('Views/updateWordsGrid', { variable: 'currentScrollY', data: scrollY })
  store.dispatch('Views/updateWordsGrid', {
    variable: 'currentPage',
    data: currentPage.value
  })
  store.dispatch('Views/updateWordsGrid', { variable: 'jumpPage', data: false })
  store.dispatch('Views/updateWordsGrid', {
    variable: 'currentPageSize',
    data: selectPageSize.value
  })
}
// ---- set default ----
const setPagination = (): void => {
  pagination.pageSize = Number($WordsGrid.value.currentPageSize)
  selectPageSize.value = $WordsGrid.value.currentPageSize
  pagination.current = Number($WordsGrid.value.currentPage)
  currentPage.value = pagination.current
}
const setDefaultFromState = (): void => {
  tagsArray.value = $filtersTags.value
  const filterItemsStateProperty = Object.keys(filterItemsState)
  filterItemsStateProperty.forEach((property) => {
    const propName = property as keyof typeof filterItemsState
    filterItemsState[propName] = $WordsGrid.value.filterItemsState[property]
  })
  const isItemsStateProperty = Object.keys(isItemsState)
  isItemsStateProperty.forEach((property) => {
    const propName = property as keyof typeof isItemsState
    isItemsState[propName] = $WordsGrid.value.isItemsState[property]
  })
  AfterReady.value = true
}
// ---- words groups ----
const clickGroupAdd = (): void => {
  if (checkboxShow.value === true && $WordsGroupsView.value.groupArray.length === 0) {
    checkboxShow.value = false
  } else {
    $SideMenuView.value.sideGroup = '3'
    checkboxShow.value = true
  }
}
const changeCheckbox = (id: number, wsName: string): void => {
  if (checkboxArray.value[id]) {
    store.dispatch('Views/updateWordsGroupsView', {
      variable: 'groupArray',
      data: { ws_id: id, ws_name: wsName, checked: true }
    })
  } else {
    store.dispatch('Views/updateWordsGroupsView', {
      variable: 'groupArray',
      data: { ws_id: id, ws_name: wsName, checked: false }
    })
  }
  setCheckbox()
}
const setCheckbox = (): void => {
  if ($WordsGroupsView.value.groupArray.length > 0) {
    checkboxShow.value = true
    checkboxBtn.value = true
    $SideMenuView.value.sideGroup = '3'
  }
}
// drawer
const onDrawerShow = (): void => {
  wordsDrawerRef.value.setDrawerStyle()
  wordsDrawerVisible.value = true
}

onMounted(async () => {
  ReadySpinning.value = true
  await store.dispatch('WordsStore/fetch')
  Ready.value = true
  ReadySpinning.value = false
  setDefaultFromState()
})

onBeforeRouteLeave(async (to, from, next) => {
  await setDetailsClick()
  Ready.value = false
  AfterReady.value = false
  next()
})

onActivated(async () => {
  Ready.value = true
  setDefaultFromState()
})

watch(Ready, (val) => {
  if (val) {
    nextTick(() => {
      if ($WordsGrid.value.jumpPage === true) {
        setPagination()
      }
      setCheckbox()
    })
  }
})

watch(AfterReady, (val) => {
  if (val) {
    nextTick(() => {
      // run scroll after page setting
      if ($WordsGrid.value.jumpScroll === true) {
        window.scrollTo({
          top: $WordsGrid.value.currentScrollY,
          behavior: 'instant'
        })
        store.dispatch('Views/updateWordsGrid', {
          variable: 'jumpScroll',
          data: false
        })
      }
    })
  }
})

watch(tagsArray, () => {
  store.dispatch('Search/updateFiltersTags', tagsArray.value)
})

watch(checkboxArray, (val) => {
  if (Object.keys(val).length === 0) {
    checkboxShow.value = false
    checkboxBtn.value = false
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

.btn:disabled {
  color: #5b9bda;
  background-color: #00000008;
}

.icon-copy {
  padding-left: 4px;
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
