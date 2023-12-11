<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>上傳檔案區</h4>
    </div>
    <div :class="$theme">
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
    </div>
  </template>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, computed, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { WordForm } from '@/interfaces/Words'
//import { message } from 'ant-design-vue'
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

const uppy = computed(() =>
  new Uppy({ id: 'uppy1', autoProceed: true, debug: false }).use(XHR, {
    endpoint: TUS_ENDPOINT.value
  })
)

const Ready = ref<boolean>(false)
// const fileList = ref([])

const formState = reactive({
  word: {} as WordForm
})

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

onMounted(() => {
  Ready.value = true
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
  background: #{$words-main-color};
  content: '';
}
</style>
