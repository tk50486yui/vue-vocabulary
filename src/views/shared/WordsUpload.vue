<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>上傳檔案區</h4>
    </div>
    <div :class="$theme">
      <a-upload v-model:file-list="fileList" :before-upload="beforeUpload">
        <a-button>
          <upload-outlined></upload-outlined>
          Click to Upload
        </a-button>
      </a-upload>
      <p></p>
      <a-button class="btn btn-primary btn-outline-light btn-sm" @click="onFinish">儲存</a-button>
    </div>
  </template>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { WordForm } from '@/interfaces/Words'
import { message, Upload } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const Ready = ref<boolean>(false)
const fileList = ref([])

const formState = reactive({
  word: {} as WordForm
})

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  formState.word.ws_file = file
  formState.word.ws_name = 'catTest'
  /*const isPNG = file.type === 'image/png'
  if (!isPNG) {
    message.error(`${file.name} is not a png file`)
  }*/
  Promise.reject
  return Upload.LIST_IGNORE
}

const onFinish = async (): Promise<void> => {
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
}

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
  margin-bottom: 8px;
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
</style>
