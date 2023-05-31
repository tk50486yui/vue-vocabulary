<template>
    <template v-if="Ready">
      <div class="tab-theme" :class="this.$theme">
        <a-tabs v-model:activeKey="activeTab" type="card">
          <!-- tab 1 -->
          <a-tab-pane key="1" tab="所有標籤">
            <RefreshBtn class="button-container btn-info" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
            <div class="table-theme" :class="this.$theme">
              <a-table :dataSource="this.tagsArray"
                :columns="columns"
                :scroll="{ y: 600, x: 300 }"
                :maxWidth="200"
                :loading="TableLoading[0]"
                :indentSize="12"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="['ts_name'].includes(column.dataIndex)">
                    <div>
                      <template v-if="column.dataIndex === 'ts_name' && record.children.length > 0">
                      {{ text }} （{{ record.children.length }}）
                      </template>
                      <template v-else>
                      {{ record.ts_name }}
                      <button v-if="record.children.length > 0" type="button" class="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed" aria-label="Expand row"></button>
                      </template>
                    </div>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 2 -->
          <a-tab-pane key="2" tab="近期新增">
            <RefreshBtn class="button-container btn-warning" :spin="SyncOutlinedSpin[1]"  @click="refreshTable(1)"/>
            <div class="table-theme" :class="this.$theme">
              <a-table :dataSource="this.recentTagsArray"
                :columns="columns"
                :scroll="{ y: 600, x: 300 }"
                :maxWidth="200"
                :loading="TableLoading[1]"
              >
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 3 -->
          <a-tab-pane key="3" tab="常用">Content of Tab Pane 3</a-tab-pane>
          <!-- tab 4 -->
          <a-tab-pane key="4" tab="＋添加新標籤">
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
          </a-tab-pane>
        </a-tabs>
      </div>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'

export default {
  name: 'TagsView',
  components: {
    RefreshBtn,
    TagsTreeSelect
  },
  computed: {
    ...mapGetters('TagsStore', ['tagsArray']),
    ...mapGetters('TagsStore', ['recentTagsArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch']),
    ...mapActions('TagsStore', ['fetchRecent']),
    ...mapActions('TagsStore', {
      addTag: 'add'
    }),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (index === 0) {
          await this.fetch()
        } else if (index === 1) {
          await this.fetchRecent()
        }
        this.SyncOutlinedSpin[index] = false
        this.TableLoading[index] = false
      } catch (error) {}
    },
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
      this.formState.tag.ts_parent_id = typeof value !== 'undefined' ? value : ''
    },
    resetForm () {
      this.$refs.treeSelect.handleClear()
      this.formRef.resetFields()
    }
  },
  async created () {
    try {
      await this.fetch()
      await this.fetchRecent()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref([false, false, false])
    const SyncOutlinedSpin = ref([false, false, false])
    const activeTab = ref('1')
    const formRef = ref()
    const confirmLoading = ref(false)

    const columns = [
      {
        dataIndex: 'ts_name'
      }
    ]

    const formState = reactive({
      tag: {}
    })

    const validateMsg = {
      required: 'required'
    }

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      columns,
      activeTab,
      formRef,
      confirmLoading,
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
