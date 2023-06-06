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
                :scroll="{ y: 600 }"
                :loading="TableLoading[0]"
                :indentSize="12"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="['ts_name'].includes(column.dataIndex)">
                    <template v-if="column.dataIndex === 'ts_name' && record.children.length > 0">
                    {{ text }} （{{ record.children.length }}）
                    </template>
                    <template v-else>
                    {{ text }}
                    </template>
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
                :scroll="{ y: 600 }"
                :loading="TableLoading[1]"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="['ts_name'].includes(column.dataIndex)">
                    <div>
                      <template v-if="editTableData[record.key]">
                        <a-input v-model:value="editTableData[record.key][column.dataIndex]"
                          style="margin: -5px 0"/>
                      </template>
                      <template v-else>
                      {{ text }}
                      </template>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'operation'">
                    <template v-if="editTableData[record.key]">
                      <div class="button-edit-container">
                        <CheckOutlined class="button-edit-check" @click="onEditFinish(record)"/>
                        <CloseOutlined class="button-edit-close" @click="cancel(record)"/>
                      </div>
                    </template>
                    <template v-else>
                      <EditOutlined class="button-edit" @click="edit(record)" />
                    </template>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 3 -->
          <a-tab-pane key="3" tab="常用">Content of Tab Pane 3</a-tab-pane>
          <!-- tab 4 -->
          <a-tab-pane key="4" tab="＋添加新標籤">
            <TagsAddView />
          </a-tab-pane>
        </a-tabs>
      </div>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import TagsAddView from '@/views/TagsAddView.vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'

export default {
  name: 'TagsView',
  components: {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    RefreshBtn,
    TagsAddView
  },
  computed: {
    ...mapGetters('TagsStore', ['tagsArray']),
    ...mapGetters('TagsStore', ['recentTagsArray']),
    ...mapGetters('TagsStore', ['tagsEditArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch']),
    ...mapActions('TagsStore', ['fetchRecent']),
    ...mapActions('TagsStore', {
      updateTag: 'update'
    }),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (index === 0) {
          await this.fetch()
          this.editDataSource = this.recentTagsArray
        } else if (index === 1) {
          await this.fetchRecent()
        }
        this.SyncOutlinedSpin[index] = false
        this.TableLoading[index] = false
      } catch (error) {}
    },
    async onEditFinish (record) {
      try {
        const editData = await this.save(record)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateTag({ id: editData.id, data: editData })
        await this.fetch()
        await this.fetchRecent()
        this.editDataSource = this.recentTagsArray
        this.cancel(record)
      } catch (error) {}
    }
  },
  async created () {
    try {
      await this.fetch()
      await this.fetchRecent()
      this.editDataSource = this.recentTagsArray
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref([false, false, false])
    const SyncOutlinedSpin = ref([false, false, false])
    const activeTab = ref('1')
    const editDataSource = ref()
    const editTableData = reactive({})

    const edit = record => {
      console.log(record.key)
      editTableData[record.key] = cloneDeep(editDataSource.value.filter(item => record.key === item.key)[0])
    }

    const cancel = record => {
      delete editTableData[record.key]
    }

    const save = async record => {
      return editTableData[record.key]
    }

    const columns = [
      {
        dataIndex: 'operation',
        width: '10%',
        fixed: true
      },
      {
        dataIndex: 'ts_name',
        width: '90%'
      }
    ]

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      columns,
      activeTab,
      editDataSource,
      editTableData,
      edit,
      save,
      cancel
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

.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-edit{
  display: flex;
  justify-content: center;
  color:#6A6AFF;
}
.button-edit-check{
  margin-right: 10px;
  color:#00DB00;
}
.button-edit-close{
  margin-left: auto;
  color:#EA0000;
}
</style>
