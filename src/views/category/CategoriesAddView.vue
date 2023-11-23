<template>
  <a-form ref="formRef" :model="formState" :validate-messages="validateMsg" @finish="onFinish">
    <p></p>
    <CategoriesTreeSelect
      placeholder="選擇類別層級"
      size="large"
      v-model:value="formState.category.cate_parent_id"
      @chnage="handleTreeSelectChange"
      style="width: 100%"
      :field-names="{
        children: 'children',
        label: 'cate_name',
        value: 'id',
        key: 'id'
      }"
    />
    <p></p>
    <a-form-item
      class="input-theme"
      :class="$theme"
      :name="['category', 'cate_name']"
      :rules="[{ required: true }]"
    >
      <a-input
        v-model:value="formState.category.cate_name"
        placeholder="類別名"
        :auto-size="{ minRows: 3 }"
        allow-clear
      />
    </a-form-item>
    <a-form-item>
      <a-button
        class="btn btn-primary btn-outline-light btn-sm float-end"
        :loading="confirmLoading"
        html-type="submit"
        >儲存</a-button
      >
      <a-button class="btn btn-danger btn-outline-light btn-sm" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import { CategoryForm } from '@/interfaces/Categories'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const confirmLoading = ref<boolean>(false)
const formRef = ref()
const formState = reactive({
  category: {} as CategoryForm
})

const onFinish = async (): Promise<void> => {
  try {
    confirmLoading.value = true
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('CategoriesStore/add', formState.category)
    resetForm()
    confirmLoading.value = false
  } catch (e) {
    //
  }
}

const handleTreeSelectChange = (value: number): void => {
  formState.category.cate_parent_id = typeof value !== 'undefined' ? value : null
}

const resetForm = (): void => {
  formState.category.cate_parent_id = null
  formRef.value.resetFields()
}

const validateMsg = {
  required: 'required'
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
