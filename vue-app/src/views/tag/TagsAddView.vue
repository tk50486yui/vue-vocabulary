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
        <a-form-item class="input-theme" :class="$theme" :name="['tag', 'ts_name']" :rules="[{ required: true }]">
          <a-input  v-model:value="formState.tag.ts_name"  placeholder="標籤名" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <template v-if="this.formState.tag.tc_id">
          <template v-if="formState.tag.ts_name != '' && formState.tag.ts_name != null">
            <a-tag :style="
                  'background:' + this.selectedTagColor.tc_background
                  + ';color:'+ this.selectedTagColor.tc_color
                  +';border-color:'+ this.selectedTagColor.tc_border">
                {{ formState.tag.ts_name }}
          </a-tag>
          </template>
          <template v-else>
            <a-tag :style="
                  'background:' + this.selectedTagColor.tc_background
                  + ';color:'+ this.selectedTagColor.tc_color
                  +';border-color:'+ this.selectedTagColor.tc_border">
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
          <a-button class="btn btn-primary btn-outline-light btn-sm float-end" :loading="confirmLoading" html-type="submit">儲存</a-button>
          <a-button class="btn btn-danger btn-outline-light btn-sm" @click="resetForm">重置</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref, reactive } from 'vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import TagsColorSelect from '@/components/select/TagsColorSelect.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'TagsAddView',
  components: {
    TagsTreeSelect,
    TagsColorSelect
  },
  computed: {
    selectedTagColor () {
      return this.formState.tag.tc_id
        ? this.tagsColor.find(tagColor => parseInt(tagColor.id) === parseInt(this.formState.tag.tc_id))
        : null
    },
    ...mapGetters('TagsColorStore', ['tagsColor']),
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
      } catch (error) {}
    },
    handleTreeSelectChange (value) {
      this.formState.tag.ts_parent_id = typeof value !== 'undefined' ? value : null
    },
    resetForm () {
      this.formState.tag.ts_parent_id = null
      this.formState.tag.tc_id = null
      this.formRef.resetFields()
    },
    handleTagsColorSelectChange (value) {
      this.formState.tag.tc_id = typeof value !== 'undefined' ? value : null
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
