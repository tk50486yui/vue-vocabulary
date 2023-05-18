<template>
    <div>
      <a-form
        :model="formState"
        v-bind="layout"
        :validate-messages="validateMsg"
        name="wordform"
        @finish="onFinish">
        <a-form-item :name="['word', 'cate_id']">
          <CategoriesTreeSelect v-model="formState.word.cate_id" @update:modelValue="handleTreeSelectChange"/>
        </a-form-item>
        <p></p>
        <a-form-item :name="['word', 'ws_name']" :rules="[{ required: true }]">
          <a-textarea  v-model:value="formState.word.ws_name"  placeholder="輸入單字" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>

        <p></p>

        <a-form-item :name="['word', 'ws_pronunciation']" >
          <a-textarea v-model:value="formState.word.ws_pronunciation" placeholder="假名 / 發音" :auto-size="{ minRows: 2}" allow-clear />
        </a-form-item>

        <p></p>

        <a-form-item :name="['word', 'ws_definition']">
          <a-textarea v-model:value="formState.word.ws_definition" placeholder="中文定義" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item :name="['word', 'ws_description']">
          <a-textarea v-model:value="formState.word.ws_description" placeholder="註解說明.." :auto-size="{ minRows: 4}" allow-clear />
        </a-form-item>
        <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>

      </a-form>
    </div>
</template>

<script>
import { reactive } from 'vue'
import { mapActions } from 'vuex'
// import router from '@/router/route'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

const formState = reactive({
  word: {
    ws_name: '',
    ws_definition: '',
    ws_pronunciation: '',
    ws_description: '',
    ws_slogan: '',
    ws_is_important: '',
    ws_is_common: '',
    ws_forget_count: '',
    ws_display_order: '',
    cate_id: ''
  }
})

const validateMsg = {
  required: 'required'

}

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

export default {
  name: 'HomeView',
  components: {
    CategoriesTreeSelect
  },
  methods: {
    ...mapActions('WordsStore', {
      addWord: 'add'
    }),
    async onFinish (values) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        console.log(values.word)
        /* await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addWord(values.word) */
        // router.go(0)
      } catch (error) {
        console.log(error.response.status)
      }
    },
    handleTreeSelectChange (value) {
      this.formState.word.cate_id = value
    }
  },
  setup () {
    return {
      formState,
      validateMsg,
      layout
    }
  }
}
</script>
