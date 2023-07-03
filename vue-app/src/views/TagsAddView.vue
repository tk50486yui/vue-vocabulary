<template>
    <a-form
        ref="formRef"
        :model="formState"
        :validate-messages="validateMsg"
        @finish="onFinish">
        <p></p>
        <TagsTreeSelect placeholder="選擇標籤層級" size="large" ref="treeSelect"
            v-model="formState.tag.ts_parent_id"
            @update:modelValue="handleTreeSelectChange"
            style="width: 300px"/>
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['tag', 'ts_name']" :rules="[{ required: true }]">
          <a-textarea  v-model:value="formState.tag.ts_name"  placeholder="標籤名" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <a-form-item>
        <div class="add-button-container">
            <div class="add-clear-button">
                <a-button @click="resetForm" danger>Clear</a-button>
            </div>
            <div class="add-submit-button">
            <a-button type="primary" html-type="submit" :loading="confirmLoading">Submit</a-button>
            </div>
        </div>
        </a-form-item>
    </a-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'TagsAddView',
  components: {
    TagsTreeSelect
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch']),
    ...mapActions('TagsStore', {
      addTag: 'add'
    }),
    async onFinish () {
      try {
        this.confirmLoading = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addTag(this.formState.tag)
        await this.fetch()
        this.resetForm()
        this.confirmLoading = false
      } catch (error) {
        this.confirmLoading = false
      }
    },
    handleTreeSelectChange (value) {
      this.formState.tag.ts_parent_id = typeof value !== 'undefined' ? value : ''
    },
    resetForm () {
      this.$refs.treeSelect.handleClear()
      this.formRef.resetFields()
    }
  },
  setup () {
    const confirmLoading = ref(false)
    const formRef = ref()

    const formState = reactive({
      tag: {}
    })

    const validateMsg = {
      required: 'required'
    }

    return {
      confirmLoading,
      formRef,
      formState,
      validateMsg
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px
}

.add-button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

.add-clear-button {
  margin-right: auto;
}

.add-cancel-button {
  margin-right: 10px;
}

.add-submit-button {
  margin-left: 10px;
}

</style>
