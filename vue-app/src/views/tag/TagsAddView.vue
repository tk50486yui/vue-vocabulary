<template>
    <a-form
      ref="formRef"
      :model="formState"
      :validate-messages="validateMsg"
      @finish="onFinish"
    >
        <p></p>
        <TagsTreeSelect
            placeholder="選擇標籤層級"
            size="large"
            ref="treeSelect"
            style="width: 100%"
            v-model:value="formState.tag.ts_parent_id"
            @chnage="handleTreeSelectChange"
            :field-names="{
              children: 'children',
              label: 'ts_name',
              value: 'id',
              key: 'id'}"
        />
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['tag', 'ts_name']" :rules="[{ required: true }]">
          <a-input  v-model:value="formState.tag.ts_name"  placeholder="標籤名" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="confirmLoading">儲存</a-button>
          <a-button class="float-end" @click="resetForm" danger>清空</a-button>
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
    ...mapActions('TagsStore', ['fetchRecent']),
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
        await this.fetchRecent()
        this.resetForm()
        this.confirmLoading = false
      } catch (error) {
        this.confirmLoading = false
      }
    },
    handleTreeSelectChange (value) {
      this.formState.tag.ts_parent_id = typeof value !== 'undefined' ? value : null
    },
    resetForm () {
      this.formState.tag.ts_parent_id = null
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

</style>
