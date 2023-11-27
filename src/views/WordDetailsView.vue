<template>
  <template v-if="Ready && word">
    <span class="back-link-theme" :class="$theme">
      <router-link :to="{ name: 'wordsGrid' }"> 返回 </router-link>
      <span class="link-separator h5">
        <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs" />
      </span>
      <span class="h4">
        {{ word.ws_name }}
      </span>
    </span>
    <div class="descriptions-theme" :class="$theme">
      <div class="d-flex justify-content-end">
        <EditOutlined
          :class="{ 'text-secondary': editShow, 'button-edit': !editShow, [$theme]: true }"
          @click="onEdit()"
        />
      </div>
      <p></p>
      <a-descriptions
        bordered
        :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
        :layout="descriptionsLayout"
        class="table-container"
      >
        <a-descriptions-item label="單字名稱">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input v-model:value="formState.word.ws_name" allow-clear />
            </div>
          </template>
          <template v-else>
            <div class="d-flex justify-content-between align-items-center">
              <span>
                {{ word.ws_name }}
              </span>
              <span class="copy-icon">
                <a-typography-paragraph :copyable="{ text: word.ws_name }"></a-typography-paragraph>
              </span>
            </div>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="仮名 / 發音">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input v-model:value="formState.word.ws_pronunciation" allow-clear />
            </div>
          </template>
          <template v-else>
            <template v-if="word.ws_pronunciation == null || word.ws_pronunciation == ''">
              {{ word.ws_pronunciation }}
            </template>
            <template v-else>
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  {{ word.ws_pronunciation }}
                </span>
                <span class="copy-icon">
                  <a-typography-paragraph
                    :copyable="{ text: word.ws_pronunciation }"
                  ></a-typography-paragraph>
                </span>
              </div>
            </template>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="中文定義">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input v-model:value="formState.word.ws_definition" allow-clear />
            </div>
          </template>
          <template v-else>
            {{ word.ws_definition }}
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="主題分類">
          <template v-if="editShow">
            <CategoriesTreeSelect
              size="small"
              placeholder="選擇分類"
              :dropdownMatchSelectWidth="false"
              style="width: 100%"
              v-model:value="formState.word.cate_id"
              :defaultValue="word.cate_id"
              :treeDefaultExpandedKeys="[word.cate_id]"
            />
          </template>
          <template v-else>
            {{ word.cate_name }}
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="印象例句">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input v-model:value="formState.word.ws_slogan" allow-clear />
            </div>
          </template>
          <template v-else>
            {{ word.ws_slogan }}
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="常用 / 喜愛">
          <span class="icon-theme" :class="$theme">
            <template v-if="word.ws_is_common">
              <span class="icon-star">
                <a @click="onUpdateCommon(word.id, word)">
                  <StarFilled />
                </a>
              </span>
            </template>
            <template v-else>
              <span class="icon-star-false">
                <a @click="onUpdateCommon(word.id, word)">
                  <StarFilled />
                </a>
              </span>
            </template>
            <template v-if="word.ws_is_important">
              <span class="icon-heart">
                <a @click="onUpdateImportant(word.id, word)">
                  <HeartFilled />
                </a>
              </span>
            </template>
            <template v-else>
              <span class="icon-heart-false">
                <a @click="onUpdateImportant(word.id, word)">
                  <HeartFilled />
                </a>
              </span>
            </template>
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="忘記 / 重要程度">
          <template v-if="editShow">
            <span class="slider-theme" :class="$theme">
              <a-slider v-model:value="formState.word.ws_forget_count" :min="0" :max="100" />
            </span>
          </template>
          <template v-else>
            <template v-if="word.ws_forget_count != null">
              <span class="slider-theme" :class="$theme">
                <a-slider v-model:value="word.ws_forget_count" :min="0" :max="100" disabled />
              </span>
            </template>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="例句說明">
          <template v-if="editShow">
            <div class="article-editor" :class="$theme">
              <ckeditor
                v-model="ws_description"
                :editor="ClassicEditor"
                :config="wordEditor.Config"
              />
            </div>
          </template>
          <template v-else>
            <div v-html="word.ws_description"></div>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="標籤">
          <template v-if="editShow">
            <TagsTreeSelect
              size="large"
              placeholder="添加標籤..."
              style="width: 100%"
              v-model:value="formState.word.words_tags.array"
              :treeDefaultExpandedKeys="formState.word.words_tags.array"
              multiple
            />
          </template>
          <template v-else>
            <template v-for="(item, index) in word.words_tags.values" :key="item.ts_id">
              <a-tag
                class="tag-align"
                :style="
                  'background:' +
                  item.tc_background +
                  ';color:' +
                  item.tc_color +
                  ';border-color:' +
                  item.tc_border
                "
              >
                {{ item.ts_name }}
              </a-tag>
              <template v-if="index != word.words_tags.values.length && index / 5 == 1">
                <br />
              </template>
            </template>
          </template>
        </a-descriptions-item>
      </a-descriptions>
      <p></p>
      <template v-if="editShow">
        <a-button class="btn btn-primary btn-outline-light btn-sm" @click="onEditFinish()"
          >儲存</a-button
        >
        <a-button
          class="btn btn-danger btn-outline-light btn-sm"
          style="margin-left: 10px"
          @click="onEditCancel()"
          >取消</a-button
        >
      </template>
      <template v-else>
        <DeleteBtn @confirm="onDelete(wordId)" />
      </template>
    </div>
    <a-back-top />
  </template>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  toRefs,
  computed,
  watchEffect,
  onMounted,
  onBeforeMount,
  onActivated,
  nextTick
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { message } from 'ant-design-vue'
import { DeleteBtn } from '@/components/button'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import { Word, WordForm } from '@/interfaces/Words'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $mobile, $tablet, $desktop } = toRefs(store.state.Screen)

const $route = useRoute()
const $router = useRouter()

const wordById = computed(() => store.getters['WordsStore/wordById'])

const wordId = computed(() => Number($route.params.id))
const word = computed(() => wordById.value(wordId.value) || null)

const ws_description = computed({
  get: () => formState.word.ws_description || '',
  set: (value: string) => {
    formState.word.ws_description = value
  }
})

const Ready = ref<boolean>(false)
const descriptionsLayout = ref<string>('horizontal')
const editShow = ref<boolean>(false)
const formState = reactive({
  word: {} as WordForm
})

const onEditFinish = async (): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsStore/update', {
      id: word.value.id,
      data: formState.word
    })
    onEditCancel()
  } catch (e) {
    //
  }
}

const onEdit = (): void => {
  editShow.value = !editShow.value
  formState.word = Object.assign({}, formState.word, word.value)
}
const onEditCancel = (): void => {
  if (editShow.value) {
    editShow.value = false
  }
  if (!editShow.value) {
    nextTick(() => {
      window.scrollTo({ top: 160, behavior: 'auto' })
    })
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
    $router.push({ name: 'wordsGrid' })
  } catch (e) {
    //
  }
}

const changeDescriptionsLayout = (isScreenSmall: boolean): void => {
  if ($desktop.value === false && isScreenSmall === true) {
    descriptionsLayout.value = 'vertical'
  } else if ($desktop.value === true) {
    descriptionsLayout.value = 'horizontal'
  }
}
const setGridState = async (): Promise<void> => {
  store.dispatch('Views/updateWordsGrid', {
    variable: 'jumpPage',
    data: true
  })
  store.dispatch('Views/updateWordsGrid', {
    variable: 'jumpScroll',
    data: true
  })
}

onBeforeMount(() => {
  formState.word = { ...formState.word }
})

onMounted(async () => {
  try {
    window.scrollTo({ top: 120, behavior: 'instant' })
    await store.dispatch('WordsStore/fetch')
    Ready.value = true
  } catch (e) {
    //
  }
})

onBeforeRouteLeave(async (to, from, next) => {
  await setGridState()
  next()
})

onActivated(async () => {
  try {
    window.scrollTo({ top: 120, behavior: 'instant' })
    await store.dispatch('WordsStore/fetch')
  } catch (e) {
    //
  }
})

watchEffect(() => {
  changeDescriptionsLayout($mobile.value)
  changeDescriptionsLayout($tablet.value)
})

const wordEditor = reactive({
  Config: {
    autoGrow: true,
    placeholder: '請為單字添加註釋或說明...'
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.table-container {
  width: 100%;
  overflow-x: auto;
}

.button-edit {
  &.dark {
    color: var(--edit-icon);
  }

  &.light {
    color: var(--edit-icon);
  }
}

.copy-icon {
  padding-top: 5px;
}

.icon-star {
  padding-left: 2px;
  padding-right: 8px;
}

.icon-star-false {
  padding-left: 2px;
  padding-right: 8px;
}

.descriptions-theme {
  :deep(.ant-descriptions-item-content) {
    width: 80%;
  }

  :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
    width: 20%;
  }
}
</style>
