<template>
  <div class="section-title">
    <h4>圖片總覽</h4>
  </div>
  <div class="tab-theme" :class="$theme">
    <a-tabs type="card" tab-position="top">
      <!-- tab 0 -->
      <a-tab-pane key="0" tab="全部">
        <div class="ready-spinning">
          <a-spin :spinning="ReadySpinning" size="large">
            <div class="list-card-theme" :class="$theme" ref="listCard">
              <a-list
                :data-source="files"
                size="small"
                :split="false"
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
                <template #header>
                  <span class="float-end">
                    <a-space size="small">
                      <RefreshBtn
                        class="btn btn-info btn-outline-light btn-sm"
                        :spin="SyncOutlinedSpin"
                        @click="refresh"
                      />
                    </a-space>
                  </span>
                  <p></p>
                </template>
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-card>
                      <a-image :src="item.file_url" />
                      <p></p>
                      <span class="float-end">
                        <DeleteBtn @confirm="onDelete(item.file_name)" />
                      </span>
                    </a-card>
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-spin>
        </div>
      </a-tab-pane>
      <!-- tab 1 -->
      <a-tab-pane key="1" tab="上傳">
        <p></p>
        <Dashboard
          :uppy="uppy"
          :props="{
            locale: {
              strings: {
                addingMoreFiles: '新增更多',
                addMore: '新增更多',
                dropPasteFiles: '拖曳至此處或 %{browseFiles}',
                browseFiles: '讀取檔案',
                uploadComplete: '上傳成功',
                done: '完成',
                complete: '成功',
                back: '返回',
                save: '儲存',
                cancel: '取消'
              }
            },
            theme: 'dark',
            width: '350',
            height: '300',
            size: 'small',

            metaFields: [{ id: 'ws_file', name: 'ws_file', placeholder: 'ws_file' }]
          }"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, computed, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { WordForm } from '@/interfaces/Words'
import { RefreshBtn, DeleteBtn } from '@/components/button'
import { message } from 'ant-design-vue'
// import { UploadOutlined } from '@ant-design/icons-vue'
// import type { UploadProps } from 'ant-design-vue'
import Uppy from '@uppy/core'
import XHR from '@uppy/xhr-upload'
import { Dashboard } from '@uppy/vue'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const TUS_ENDPOINT = ref(import.meta.env.VITE_API_BASE_URL + '/words/upload/uppy')

const files = computed(() => store.getters['WordsStore/files'])
const uppy = computed(() =>
  new Uppy({ id: 'uppy', autoProceed: true, debug: false })
    .use(XHR, {
      endpoint: TUS_ENDPOINT.value
    })
    .on('upload-success', async () => {
      await refresh()
    })
)

const ReadySpinning = ref<boolean>(false)
const SyncOutlinedSpin = ref<boolean>(false)
// const fileList = ref([])

const formState = reactive({
  word: {} as WordForm
})

const refresh = async (): Promise<void> => {
  try {
    SyncOutlinedSpin.value = true
    ReadySpinning.value = true
    await new Promise((resolve) => setTimeout(resolve, 100))
    await store.dispatch('WordsStore/fetchFiles')
    SyncOutlinedSpin.value = false
    ReadySpinning.value = false
  } catch (error) {
    //
  }
}

const onDelete = async (file_name: string): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsStore/deleteFile', file_name)
  } catch (error) {
    //
  }
}

/*const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  formState.word.ws_file = file
  formState.word.ws_name = 'catTest'
  const isJPEG = file.type === 'image/jpeg'
  if (isJPEG) {
    message.success(`${file.name} is a jpg file`)
  }

  return false
}*/

/*const onFinish = async (): Promise<void> => {
  try {
    const formData = new FormData()
    formData.append('ws_file', formState.word.ws_file)
    formData.append('ws_name', formState.word.ws_name)
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsStore/upload', formData)
  } catch (error) {
    //
  }
}*/

onBeforeMount(() => {
  formState.word = {
    ...formState.word,
    words_tags: { array: [], values: [] }
  }
})

onMounted(async () => {
  await refresh()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.ready-spinning :deep(.ant-spin-dot-item) {
  background: #{$words-main-color};
}

.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #{$words-main-color};
  content: '';
}
</style>
