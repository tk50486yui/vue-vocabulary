<template>
  <a-form ref="formRef" :model="formState" :validate-messages="validateMsg" @finish="onFinish">
    <p></p>
    <TagsTreeSelect
      placeholder="選擇標籤層級"
      size="large"
      style="width: 100%"
      v-model:value="formState.tag.ts_parent_id"
      @chnage="handleTagsSelectChange"
      :field-names="{
        children: 'children',
        label: 'ts_name',
        value: 'id',
        key: 'id'
      }"
    />
    <p></p>
    <a-form-item
      class="input-theme"
      :class="$theme"
      :name="['tag', 'ts_name']"
      :rules="[{ required: true }]"
    >
      <a-input
        v-model:value="formState.tag.ts_name"
        placeholder="標籤名"
        :auto-size="{ minRows: 3 }"
        allow-clear
      />
    </a-form-item>
    <p></p>
    <template v-if="formState.tag.tc_id">
      <template v-if="formState.tag.ts_name != '' && formState.tag.ts_name != null">
        <a-tag
          :style="
            'background:' +
            selectedTagColor.tc_background +
            ';color:' +
            selectedTagColor.tc_color +
            ';border-color:' +
            selectedTagColor.tc_border
          "
        >
          {{ formState.tag.ts_name }}
        </a-tag>
      </template>
      <template v-else>
        <a-tag
          :style="
            'background:' +
            selectedTagColor.tc_background +
            ';color:' +
            selectedTagColor.tc_color +
            ';border-color:' +
            selectedTagColor.tc_border
          "
        >
          With default value
        </a-tag>
      </template>
    </template>
    <p></p>
    <TagsColorSelect
      placeholder="選擇標籤顏色"
      size="small"
      style="width: 100%"
      v-model:value="formState.tag.tc_id"
      @change="handleTagsColorSelectChange"
    />
    <p></p>
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
import { ref, reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import TagsColorSelect from '@/components/select/TagsColorSelect.vue'
import { TagForm } from '@/interfaces/Tags'
import { TagsColor } from '@/interfaces/TagsColor'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const confirmLoading = ref(false)
const formRef = ref()
const formState = reactive({
  tag: {} as TagForm
})
const tagsColor = computed(() => store.getters['TagsColorStore/tagsColor'])

const selectedTagColor = computed(() => {
  return formState.tag.tc_id
    ? tagsColor.value.find((tagColor: TagsColor) => tagColor.id === formState.tag.tc_id)
    : null
})

const onFinish = async (): Promise<void> => {
  try {
    confirmLoading.value = true
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('TagsStore/add', formState.tag)
    resetForm()
    confirmLoading.value = false
  } catch (e) {
    //
  }
}

const handleTagsSelectChange = (value: number): void => {
  formState.tag.ts_parent_id = typeof value !== 'undefined' ? value : null
}

const handleTagsColorSelectChange = (value: number): void => {
  formState.tag.tc_id = typeof value !== 'undefined' ? value : null
}

const resetForm = (): void => {
  formState.tag.ts_parent_id = null
  formState.tag.tc_id = null
  formRef.value.resetFields()
}

const validateMsg = {
  required: 'required'
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
