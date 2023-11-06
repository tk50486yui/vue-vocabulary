<template>
    <template v-if="Ready">
      <div class="section-title">
        <h4>類別列表</h4>
      </div>
      <div class="tab-theme" :class="this.$theme">
        <a-tabs v-model:activeKey="activeTab" type="card" tab-position="top">
          <!-- tab 1 -->
          <a-tab-pane key="1" tab="所有類別">
            <RefreshBtn class="button-container btn-info" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
            <div class="table-theme" :class="this.$theme">
              <a-table :dataSource="this.categoriesArray"
                :columns="columns"
                :scroll="{ y: 600, x: 400 }"
                :loading="TableLoading[0]"
                :indentSize="12"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="['cate_name'].includes(column.dataIndex)">
                    <template v-if="editTableData[record.id]">
                        <div class="button-edit-container">
                          <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 1)"/>
                          <CloseOutlined class="button-edit-close" @click="cancel(record, 1)"/>
                          <a-input v-model:value="editTableData[record.id][column.dataIndex]"
                          style="margin: -5px 0"/>
                        </div>
                    </template>
                    <template v-else>
                        <div class="column-container">
                          <template v-if="column.dataIndex === 'cate_name' && record.children.length > 0">
                            <EditOutlined class="button-edit" @click="edit(record, 1)" />
                            {{ text }} （{{ record.children.length }}）
                            <a-popconfirm
                              title="確定要刪除嗎？"
                              ok-text="是"
                              cancel-text="否"
                              @confirm="onDelete(record.id)"
                            >
                              <DeleteFilled class="button-delete"/>
                            </a-popconfirm>
                          </template>
                          <template v-else>
                            <EditOutlined class="button-edit" @click="edit(record, 1)" />
                            {{ text }}
                            <a-popconfirm
                              title="確定要刪除嗎？"
                              ok-text="是"
                              cancel-text="否"
                              @confirm="onDelete(record.id)"
                            >
                             <DeleteFilled class="button-delete"/>
                            </a-popconfirm>
                          </template>
                       </div>
                    </template>
                  </template>
                  <template v-else-if="['cate_parent_id'].includes(column.dataIndex)">
                    <template v-if="column.dataIndex === 'cate_parent_id'">
                      <template v-if="editTableData[record.id]">
                        <CategoriesTreeSelect size="small" placeholder="選擇父類別"
                          :dropdownMatchSelectWidth="false" style="width: 100%"
                          v-model:value="editTableData[record.id]['cate_parent_id']"
                          :defaultValue="editTableData[record.id]['cate_parent_id']"
                          :treeDefaultExpandedKeys="[editTableData[record.id]['cate_parent_id']]"
                        />
                      </template>
                    </template>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 2 -->
          <a-tab-pane key="2" tab="近期">
            <RefreshBtn class="button-container btn-warning" :spin="SyncOutlinedSpin[1]"  @click="refreshTable(1)"/>
            <div class="table-theme" :class="this.$theme">
              <a-table :dataSource="this.recentCategoriesArray"
                :columns="columns"
                :scroll="{ y: 600 }"
                :loading="TableLoading[1]"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="['cate_name'].includes(column.dataIndex)">
                    <template v-if="editTableData2[record.id]">
                      <a-input v-model:value="editTableData2[record.id][column.dataIndex]"
                        style="margin: -5px 0"/>
                    </template>
                    <template v-else>
                    {{ text }}
                    </template>
                  </template>
                  <template v-else-if="column.dataIndex === 'operation'">
                    <template v-if="editTableData2[record.id]">
                      <div class="button-edit-container">
                        <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 2)"/>
                        <CloseOutlined class="button-edit-close" @click="cancel(record, 2)"/>
                      </div>
                    </template>
                    <template v-else>
                      <EditOutlined class="button-edit2" @click="edit(record, 2)" />
                    </template>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 3 -->
          <a-tab-pane key="3" tab="+">Content of Tab Pane 3</a-tab-pane>
        </a-tabs>
      </div>
  </template>
</template>

<script>
import { ref, reactive } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

export default {
  name: 'CategoriesView',
  components: {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteFilled,
    RefreshBtn,
    CategoriesTreeSelect
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categoriesArray']),
    ...mapGetters('CategoriesStore', ['recentCategoriesArray']),
    ...mapGetters('CategoriesStore', ['categoriesEditArray']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch']),
    ...mapActions('CategoriesStore', ['fetchRecent']),
    ...mapActions('CategoriesStore', {
      updateCategory: 'update'
    }),
    ...mapActions('CategoriesStore', ['deleteById']),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (index === 0) {
          await this.fetch()
          this.editDataSource = this.recentCategoriesArray
        } else if (index === 1) {
          await this.fetchRecent()
        }
        this.SyncOutlinedSpin[index] = false
        this.TableLoading[index] = false
      } catch (error) {}
    },
    async onEditFinish (record, tab) {
      try {
        const editData = await this.save(record, tab)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateCategory({ id: editData.id, data: editData })
        await this.fetch()
        await this.fetchRecent()
        this.editDataSource = this.recentCategoriesArray
        this.cancel(record, tab)
      } catch (error) {}
    },
    async onDelete (id) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.deleteById(id)
        await this.fetch()
        await this.fetchRecent()
      } catch (error) {}
    }
  },
  async created () {
    try {
      await this.fetch()
      await this.fetchRecent()
      this.editDataSource = this.recentCategoriesArray
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
    const editTableData2 = reactive({})

    const edit = (record, tab) => {
      if (tab === 1) {
        editTableData[record.id] = cloneDeep(editDataSource.value.filter(item => record.id === item.id)[0])
      } else {
        editTableData2[record.id] = cloneDeep(editDataSource.value.filter(item => record.id === item.id)[0])
      }
    }

    const save = async (record, tab) => {
      if (tab === 1) {
        return editTableData[record.id]
      } else {
        return editTableData2[record.id]
      }
    }

    const cancel = (record, tab) => {
      if (tab === 1) {
        delete editTableData[record.id]
      } else {
        delete editTableData2[record.id]
      }
    }

    const columns = [
      {
        dataIndex: 'operation',
        width: '10%',
        fixed: true
      },
      {
        dataIndex: 'cate_name',
        width: '60%'
      },
      {
        dataIndex: 'cate_parent_id',
        width: '30%'
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
      editTableData2,
      edit,
      save,
      cancel
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.section-title {
  margin-bottom: 8px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #efffb4;
  content: "";
}
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
.column-container{
  display: flex;
  align-items: center;
}

.button-edit{
  color:#d8f74f;
  padding-right: 6px;
}

.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-edit2{
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
  padding-right: 6px;
}
.button-delete{
  color:rgb(231, 121, 121);
  padding-left: 6px;
}
</style>
