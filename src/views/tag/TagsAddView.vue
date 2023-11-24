<template>
  <a-form ref="formRef" :model="formState" :validate-messages="validateMsg" @finish="onFinish">
    <p></p>
    <TagsTreeSelect
      ref="tagsTreeSelectRef"
      placeholder="選擇標籤層級"
      size="large"
      style="width: 100%"
      v-model:value="formState.tag.ts_parent_id"
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
      ref="tagsColorSelectRef"
      placeholder="選擇標籤顏色"
      size="small"
      style="width: 100%"
      v-model:value="formState.tag.tc_id"
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
import { ref, reactive, toRefs, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import TagsColorSelect from '@/components/select/TagsColorSelect.vue'
import { TagForm } from '@/interfaces/Tags'
import { TagsColor } from '@/interfaces/TagsColor'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

provide('mode', 'single') // tagsSelect

const confirmLoading = ref(false)
const tagsTreeSelectRef = ref()
const tagsColorSelectRef = ref()
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

const resetForm = (): void => {
  tagsColorSelectRef.value.clearValue()
  tagsTreeSelectRef.value.clearValue()
  formRef.value.resetFields()
}

const validateMsg = {
  required: 'required'
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
