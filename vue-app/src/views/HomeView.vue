<template>
    <div>
      <a-form
        :model="formState"
        v-bind="layout"
        :validate-messages="validateMsg"
        name="wordform"
        @finish="onFinish">

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

        <a-form-item :name="['word', 'ws_description']">
          <a-textarea v-model:value="formState.word.ws_description" placeholder="註解說明.." :auto-size="{ minRows: 5}" show-count allow-clear />
        </a-form-item>

        <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
      <a-button @click="openNotificationWithIcon()">R-push</a-button>
      <router-view name="home-error"></router-view>
    </div>
</template>

<script>
import { reactive } from 'vue'
import { mapActions } from 'vuex'
import router from '@/router/route'

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

function openNotificationWithIcon () {
  console.log('123')
  router.go(0)
}

export default {
  name: 'HomeView',
  methods: {
    ...mapActions('WordsStore', {
      addWord: 'add'
    }),
    async onFinish (values) {
      try {
        await this.addWord(values.word)
        console.log('success')
      } catch (error) {
        console.log(error.response.status)
      }
    }
  },
  setup () {
    return {
      formState,
      validateMsg,
      layout,
      openNotificationWithIcon
    }
  }
}
</script>
