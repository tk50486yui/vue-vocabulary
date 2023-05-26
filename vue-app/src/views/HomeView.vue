<template>
    <div>
      <a-back-top />
      <a-form
        ref="formRef"
        :model="formState"
        v-bind="layout"
        :validate-messages="validateMsg"
        name="wordform"
        @finish="onFinish">
        <a-form-item :name="['word', 'cate_id']">
          <CategoriesTreeSelect  placeholder="詞語主題分類" size="large" ref="treeSelect"
            v-model="formState.word.cate_id"
            @update:modelValue="handleTreeSelectChange"/>
        </a-form-item>
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['word', 'ws_name']" :rules="[{ required: true }]">
          <a-textarea  v-model:value="formState.word.ws_name"  placeholder="輸入單字" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['word', 'ws_pronunciation']" >
          <a-textarea v-model:value="formState.word.ws_pronunciation" placeholder="假名 / 發音" :auto-size="{ minRows: 2}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['word', 'ws_definition']">
          <a-textarea v-model:value="formState.word.ws_definition" placeholder="中文定義" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['word', 'ws_description']">
          <a-textarea v-model:value="formState.word.ws_description" placeholder="註解說明.." :auto-size="{ minRows: 4}" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">Submit</a-button>
          <a-button style="margin-left: 10px" @click="resetForm" danger>Clear</a-button>
        </a-form-item>

      </a-form>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

export default {
  name: 'HomeView',
  components: {
    CategoriesTreeSelect
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', {
      addWord: 'add'
    }),
    async onFinish (values) {
      try {
        console.log(values.word)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addWord(values.word)
        this.resetForm()
        window.scrollTo({ top: 100, behavior: 'smooth' })
      } catch (error) {}
    },
    handleTreeSelectChange (value) {
      this.formState.word.cate_id = typeof value !== 'undefined' ? value : ''
      console.log(this.formState.word.cate_id + ' TreeValueChange')
    },
    resetForm () {
      this.$refs.treeSelect.handleClear()
      this.formRef.resetFields()
    }
  },
  setup () {
    const formRef = ref()
    const formState = reactive({
      word: {}
    })
    const { wordForm } = mapGetters('WordsStore', ['wordForm'])

    onMounted(() => {
      formState.word = { ...wordForm }
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

    return {
      formRef,
      formState,
      validateMsg,
      layout
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
