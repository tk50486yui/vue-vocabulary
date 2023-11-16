<template>
    <a-form
        ref="formRef"
        :model="formState"
        :validate-messages="validateMsg"
        @finish="onFinish">
        <p></p>
        <CategoriesTreeSelect
            placeholder="選擇類別層級"
            size="large"
            ref="treeSelect"
            v-model:value="formState.category.cate_parent_id"
            @chnage="handleTreeSelectChange"
            style="width: 100%"
            :field-names="{
              children: 'children',
              label: 'cate_name',
              value: 'id',
              key: 'id'}"
        />
        <p></p>
        <a-form-item class="input-theme" :class="this.$theme" :name="['category', 'cate_name']" :rules="[{ required: true }]">
          <a-input  v-model:value="formState.category.cate_name"  placeholder="類別名" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button class="btn btn-primary btn-outline-light btn-sm float-end" :loading="confirmLoading" html-type="submit">儲存</a-button>
          <a-button class="btn btn-danger btn-outline-light btn-sm " @click="resetForm">重置</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'CategoriesAddView',
  components: {
    CategoriesTreeSelect
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch', 'fetchRecent', 'add']),
    async onFinish () {
      try {
        this.confirmLoading = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addCategory(this.formState.category)
        await this.fetch()
        await this.fetchRecent()
        this.resetForm()
        this.confirmLoading = false
      } catch (error) {
        this.confirmLoading = false
      }
    },
    handleTreeSelectChange (value) {
      this.formState.category.cate_parent_id = typeof value !== 'undefined' ? value : null
    },
    resetForm () {
      this.formState.category.cate_parent_id = null
      this.formRef.resetFields()
    }
  },
  setup () {
    const confirmLoading = ref(false)
    const formRef = ref()

    const formState = reactive({
      category: {}
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
