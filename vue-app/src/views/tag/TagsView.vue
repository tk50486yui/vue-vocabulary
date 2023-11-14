<template>
    <template v-if="Ready">
      <div class="section-title">
        <h4>標籤列表</h4>
      </div>
      <div class="tab-theme" :class="$theme">
        <a-tabs v-model:activeKey="activeTab" type="card" tab-position="top">
          <!-- tab 1 -->
          <a-tab-pane key="1" tab="全部">
            <div class="table-theme" :class="$theme">
              <a-table :dataSource="this.tagsArray"
                :columns="columns"
                :scroll="{ y: 600, x: 400 }"
                :loading="TableLoading[0]"
                :indentSize="12"
              >
                <!-- header -->
                <template #title>
                  <RefreshBtn class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
                </template>
                <template #bodyCell="{ column, text, record }">
                  <!-- ts_name -->
                  <template v-if="['ts_name'].includes(column.dataIndex)">
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
                        <template v-if="column.dataIndex === 'ts_name' && record.children.length > 0">
                          <EditOutlined class="button-edit" @click="edit(record, 1)" />
                          {{ text }} （{{ record.children.length }}）
                          <DeleteBtn @confirm="onDelete(record.id)"/>
                        </template>
                        <template v-else>
                          <EditOutlined class="button-edit" @click="edit(record, 1)" />
                          {{ text }}
                          <DeleteBtn @confirm="onDelete(record.id)"/>
                        </template>
                      </div>
                    </template>
                  </template>
                  <!-- tc_color -->
                  <template v-if="['tc_color'].includes(column.dataIndex)">
                    <template v-if="editTableData[record.id]">
                      <div style="display: flex; align-items: center; width: 100%;">
                      <a-tag :style="
                              'background:' + editTableData[record.id]['tc_background']
                              + ';color:'+  editTableData[record.id]['tc_color']
                              +';border-color:'+ editTableData[record.id]['tc_border']"
                              style="flex: 1; margin-right: 8px;"
                      >
                          {{ editTableData[record.id]['ts_name'] }}
                      </a-tag>
                      <TagsColorSelect
                          size="small"
                          style="width: 100%;flex: 2"
                          placeholder="選擇標籤顏色"
                          v-model:value="editTableData[record.id]['tc_id']"
                          @change="(value) => handleColorSelectChange(value, editTableData[record.id])"
                      />
                      </div>
                    </template>
                    <template v-else>
                      <template v-if="record.tc_color && record.tc_background && record.tc_border">
                          <a-tag :style="
                                'background:' + record.tc_background
                                + ';color:'+ record.tc_color
                                +';border-color:'+ record.tc_border">
                            {{ record.ts_name }}
                          </a-tag>
                        </template>
                        <template v-else>
                          <a-tag color="default">
                            {{ record.ts_name }}
                          </a-tag>
                        </template>
                    </template>
                  </template>
                  <!-- ts_parent_id -->
                  <template v-else-if="['ts_parent_id'].includes(column.dataIndex)">
                    <template v-if="column.dataIndex === 'ts_parent_id'">
                      <template v-if="editTableData[record.id]">
                        <TagsTreeSelect size="small" placeholder="選擇父類別"
                          :dropdownMatchSelectWidth="false" style="width: 100%"
                          v-model:value="editTableData[record.id]['ts_parent_id']"
                          :defaultValue="editTableData[record.id]['ts_parent_id']"
                          :treeDefaultExpandedKeys="[editTableData[record.id]['ts_parent_id']]"
                          :field-names="{
                            children: 'children',
                            label: 'ts_name',
                            value: 'id',
                            key: 'id'}"
                        />
                      </template>
                      <template v-else>
                        {{ record.ts_parent_name }}
                      </template>
                    </template>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 2 -->
          <a-tab-pane key="2" tab="近期">
            <div class="table-theme" :class="$theme">
              <a-table
                :dataSource="this.recentTagsArray"
                :columns="columns"
                :scroll="{ y: 600 }"
                :loading="TableLoading[1]"
              >
                <!-- header -->
                <template #title>
                  <RefreshBtn class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2" :spin="SyncOutlinedSpin[1]"  @click="refreshTable(1)"/>
                </template>
                <template #bodyCell="{ column, text, record }">
                  <!-- ts_name -->
                  <template v-if="['ts_name'].includes(column.dataIndex)">
                    <div>
                      <template v-if="editTableData2[record.id]">
                        <div class="button-edit-container">
                          <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 2)"/>
                          <CloseOutlined class="button-edit-close" @click="cancel(record, 2)"/>
                          <a-input v-model:value="editTableData2[record.id][column.dataIndex]"
                          style="margin: -5px 0"/>
                        </div>
                      </template>
                      <template v-else>
                        <div class="column-container">
                          <EditOutlined class="button-edit2" @click="edit(record, 2)" />
                          {{ text }}
                          <DeleteBtn @confirm="onDelete(record.id)"/>
                        </div>
                      </template>
                    </div>
                  </template>
                  <!-- tc_color -->
                  <template v-if="['tc_color'].includes(column.dataIndex)">
                      <template v-if="editTableData2[record.id]">
                        <div style="display: flex; align-items: center; width: 100%;">
                        <a-tag :style="
                                'background:' + editTableData2[record.id]['tc_background']
                                + ';color:'+  editTableData2[record.id]['tc_color']
                                +';border-color:'+ editTableData2[record.id]['tc_border']"
                                style="flex: 1; margin-right: 8px;"
                        >
                            {{ editTableData2[record.id]['ts_name'] }}
                        </a-tag>
                        <TagsColorSelect
                            size="small"
                            style="width: 100%;flex: 2"
                            placeholder="選擇標籤顏色"
                            v-model:value="editTableData2[record.id]['tc_id']"
                            @change="(value) => handleColorSelectChange(value, editTableData2[record.id])"
                        />
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="record.tc_color && record.tc_background && record.tc_border">
                          <a-tag :style="
                                'background:' + record.tc_background
                                + ';color:'+ record.tc_color
                                +';border-color:'+ record.tc_border">
                            {{ record.ts_name }}
                          </a-tag>
                        </template>
                        <template v-else>
                          <a-tag color="default">
                            {{ record.ts_name }}
                          </a-tag>
                        </template>
                      </template>
                  </template>
                  <!-- ts_parent_id -->
                  <template v-else-if="['ts_parent_id'].includes(column.dataIndex)">
                    <template v-if="column.dataIndex === 'ts_parent_id'">
                      <template v-if="editTableData2[record.id]">
                        <TagsTreeSelect size="small" placeholder="選擇父類別"
                          :dropdownMatchSelectWidth="false" style="width: 100%"
                          v-model:value="editTableData2[record.id]['ts_parent_id']"
                          :defaultValue="editTableData2[record.id]['ts_parent_id']"
                          :treeDefaultExpandedKeys="[editTableData2[record.id]['ts_parent_id']]"
                          :field-names="{
                            children: 'children',
                            label: 'ts_name',
                            value: 'id',
                            key: 'id'}"
                        />
                      </template>
                      <template v-else>
                        {{ record.ts_parent_name }}
                      </template>
                    </template>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <!-- tab 3 -->
          <a-tab-pane key="3">
            <template #tab>
              <font-awesome-icon :icon="['fas', 'sort']" />
            </template>
            <keep-alive>
              <TagsDragView />
            </keep-alive>
          </a-tab-pane>
          <!-- tab 4 -->
          <a-tab-pane key="4">
            <template #tab>
              <font-awesome-icon :icon="['fas', 'plus']" />
            </template>
            <TagsAddView />
          </a-tab-pane>
          <!-- tab 5 -->
          <a-tab-pane key="5">
            <template #tab>
              <font-awesome-icon :icon="['fas', 'palette']" />
            </template>
            <TagsColorView />
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
import TagsAddView from '@/views/tag/TagsAddView.vue'
import TagsDragView from '@/views/tag/TagsDragView.vue'
import TagsColorView from '@/views/tag/TagsColorView.vue'
import TagsColorSelect from '@/components/select/TagsColorSelect.vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import DeleteBtn from '@/components/button/DeleteBtn.vue'

export default {
  name: 'TagsView',
  components: {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteBtn,
    RefreshBtn,
    TagsDragView,
    TagsAddView,
    TagsColorView,
    TagsColorSelect,
    TagsTreeSelect
  },
  computed: {
    ...mapGetters('TagsStore', ['tagsArray']),
    ...mapGetters('TagsStore', ['recentTagsArray']),
    ...mapGetters('TagsStore', ['tagsEditArray']),
    ...mapGetters('TagsColorStore', ['tagsColor']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch']),
    ...mapActions('TagsStore', ['fetchRecent']),
    ...mapActions('TagsStore', {
      updateTag: 'update'
    }),
    ...mapActions('TagsStore', ['deleteById']),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 100))
        if (index === 0) {
          await this.fetch()
          this.editDataSource = this.recentTagsArray
        } else if (index === 1) {
          await this.fetchRecent()
          this.editDataSource = this.recentTagsArray
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
        await this.updateTag({ id: editData.id, data: editData })
        await this.fetch()
        await this.fetchRecent()
        this.editDataSource = this.recentTagsArray
        this.cancel(record, tab)
      } catch (error) {}
    },
    async onDelete (id) {
      try {
        console.log(this.editTableData2[id])
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.deleteById(id)
        await this.fetch()
        await this.fetchRecent()
        console.log(this.editTableData2[id])
      } catch (error) {}
    },
    handleColorSelectChange (value, record) {
      if (value) {
        const newVar = this.tagsColor.find(tagColor => parseInt(tagColor.id) === parseInt(value))
        record.tc_background = newVar.tc_background
        record.tc_color = newVar.tc_color
        record.tc_border = newVar.tc_border
      } else {
        record.tc_background = ''
        record.tc_color = ''
        record.tc_border = ''
      }
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
    const TableLoading = ref([false, false])
    const SyncOutlinedSpin = ref([false, false])
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
        dataIndex: 'ts_name',
        width: '30%'
      },
      {
        dataIndex: 'tc_color',
        width: '40%'
      },
      {
        dataIndex: 'ts_parent_id',
        width: '20%'
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
  background: #f6aaf1;
  content: "";
}

.column-container{
  display: flex;
  align-items: center;
}

.button-edit{
  color:#ec5ef4;
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
  padding-right: 6px;
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
</style>
