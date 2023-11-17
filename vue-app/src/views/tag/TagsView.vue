<template>
    <template v-if="Ready">
      <div class="section-title">
        <h4>標籤列表</h4>
      </div>
      <div class="tab-theme" :class="$theme">
        <a-tabs v-model:activeKey="activeTab" type="card" tab-position="top">
          <!-- tab 0 -->
          <a-tab-pane key="0" tab="全部">
            <div class="table-theme" :class="$theme">
              <a-table
                :dataSource="this.tagsArray"
                :columns="columns"
                :scroll="{ y: 600, x: 400 }"
                :loading="TableLoading[0]"
                expandRowByClick
              >
                <!-- header -->
                <template #title>
                  <PlusBtn class="btn btn-primary btn-outline-light btn-sm float-end me-md-2" @click="visible=true"/>
                  <RefreshBtn class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
                </template>
                <template #bodyCell="{ column, text, record }">
                  <!-- ts_name -->
                  <template v-if="['ts_name'].includes(column.dataIndex)">
                    <template v-if="editTableData[0][record.id]">
                        <div class="button-edit-container">
                          <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 0)"/>
                          <CloseOutlined class="button-edit-close" @click="cancel(record, 0)"/>
                          <a-input v-model:value="editTableData[0][record.id][column.dataIndex]"
                          style="margin: -5px 0"/>
                        </div>
                    </template>
                    <template v-else>
                      <div class="column-container">
                        <template v-if="column.dataIndex === 'ts_name'">
                          <template v-if="record.parents && record.parents > 0">
                            <span style="margin-left: 8px;"></span>
                          </template>
                          <EditOutlined class="button-edit" @click="edit(record, 0, recentTagsArray)" />
                          {{ text }}
                          <template v-if="record.children.length > 0">
                            （{{ record.children.length }}）
                          </template>
                          <DeleteBtn @confirm="onDelete(record.id)"/>
                        </template>
                      </div>
                    </template>
                  </template>
                   <!-- tc_color show-->
                   <template v-else-if="['tc_show'].includes(column.dataIndex)">
                    <template v-if="editTableData[0][record.id]">
                      <div style="display: flex; align-items: center; width: 100%;">
                        <a-tag :style="
                                'background:' + editTableData[0][record.id]['tc_background']
                                + ';color:'+  editTableData[0][record.id]['tc_color']
                                +';border-color:'+ editTableData[0][record.id]['tc_border']"
                                style="flex: 1; margin-right: 8px;"
                        >
                            {{ editTableData[0][record.id]['ts_name'] }}
                        </a-tag>
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
                          <a-tag color="default" style="color:#fff">
                            {{ record.ts_name }}
                          </a-tag>
                        </template>
                      </template>
                  </template>
                  <!-- tc_color select -->
                  <template v-else-if="['tc_color'].includes(column.dataIndex)">
                      <template v-if="editTableData[0][record.id]">
                        <div style="display: flex; align-items: center; width: 100%;">
                          <TagsColorSelect
                              size="small"
                              style="width: 100%;flex: 2"
                              placeholder="選擇標籤顏色"
                              v-model:value="editTableData[0][record.id]['tc_id']"
                              @change="(value) => handleColorSelectChange(value, editTableData[0][record.id])"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <span></span>
                      </template>
                  </template>
                  <!-- ts_parent_id -->
                  <template v-else-if="['ts_parent_id'].includes(column.dataIndex)">
                    <template v-if="column.dataIndex === 'ts_parent_id'">
                      <template v-if="editTableData[0][record.id]">
                        <TagsTreeSelect size="small" placeholder="選擇父類別"
                          :dropdownMatchSelectWidth="false" style="width: 100%"
                          v-model:value="editTableData[0][record.id]['ts_parent_id']"
                          :defaultValue="editTableData[0][record.id]['ts_parent_id']"
                          :treeDefaultExpandedKeys="[editTableData[0][record.id]['ts_parent_id']]"
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
          <!-- tab 1 -->
          <a-tab-pane key="1" tab="近期">
            <div class="table-theme" :class="$theme">
              <a-table
                :dataSource="this.recentTagsArray"
                :columns="columns"
                :scroll="{ y: 600 }"
                :loading="TableLoading[1]"
              >
                <!-- header -->
                <template #title>
                  <PlusBtn class="btn btn-primary btn-outline-light btn-sm float-end me-md-2" @click="visible=true"/>
                  <RefreshBtn class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2" :spin="SyncOutlinedSpin[1]"  @click="refreshTable(1)"/>
                </template>
                <template #bodyCell="{ column, text, record }">
                  <!-- ts_name -->
                  <template v-if="['ts_name'].includes(column.dataIndex)">
                    <div>
                      <template v-if="editTableData[1][record.id]">
                        <div class="button-edit-container">
                          <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 1)"/>
                          <CloseOutlined class="button-edit-close" @click="cancel(record, 1)"/>
                          <a-input v-model:value="editTableData[1][record.id][column.dataIndex]"
                          style="margin: -5px 0"/>
                        </div>
                      </template>
                      <template v-else>
                        <div class="column-container">
                          <EditOutlined class="button-edit2" @click="edit(record, 1, recentTagsArray)" />
                          {{ text }}
                          <DeleteBtn @confirm="onDelete(record.id)"/>
                        </div>
                      </template>
                    </div>
                  </template>
                  <!-- tc_color show-->
                  <template v-else-if="['tc_show'].includes(column.dataIndex)">
                    <template v-if="editTableData[1][record.id]">
                      <div style="display: flex; align-items: center; width: 100%;">
                          <a-tag :style="
                                  'background:' + editTableData[1][record.id]['tc_background']
                                  + ';color:'+  editTableData[1][record.id]['tc_color']
                                  +';border-color:'+ editTableData[1][record.id]['tc_border']"
                                  style="flex: 1; margin-right: 8px;"
                          >
                              {{ editTableData[1][record.id]['ts_name'] }}
                          </a-tag>
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
                          <a-tag color="default" style="color:#fff">
                            {{ record.ts_name }}
                          </a-tag>
                        </template>
                      </template>
                  </template>
                  <!-- tc_color select -->
                  <template v-else-if="['tc_color'].includes(column.dataIndex)">
                      <template v-if="editTableData[1][record.id]">
                        <div style="display: flex; align-items: center; width: 100%;">
                          <TagsColorSelect
                              size="small"
                              style="width: 100%;flex: 2"
                              placeholder="選擇標籤顏色"
                              v-model:value="editTableData[1][record.id]['tc_id']"
                              @change="(value) => handleColorSelectChange(value, editTableData[1][record.id])"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <span></span>
                      </template>
                  </template>
                  <!-- ts_parent_id -->
                  <template v-else-if="['ts_parent_id'].includes(column.dataIndex)">
                    <template v-if="column.dataIndex === 'ts_parent_id'">
                      <template v-if="editTableData[1][record.id]">
                        <TagsTreeSelect size="small" placeholder="選擇父類別"
                          :dropdownMatchSelectWidth="false" style="width: 100%"
                          v-model:value="editTableData[1][record.id]['ts_parent_id']"
                          :defaultValue="editTableData[1][record.id]['ts_parent_id']"
                          :treeDefaultExpandedKeys="[editTableData[1][record.id]['ts_parent_id']]"
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
          <a-tab-pane key="2">
            <template #tab>
              <font-awesome-icon :icon="['fas', 'sort']" />
            </template>
            <TagsSortView />
          </a-tab-pane>
          <!-- tab 3 -->
          <a-tab-pane key="3">
            <template #tab>
              <font-awesome-icon :icon="['fas', 'palette']" />
            </template>
            <TagsColorView />
          </a-tab-pane>
        </a-tabs>
      </div>
  </template>
  <!-- Modal -->
  <TagsModalView v-model:open="visible"/>
</template>

<script>
import { ref, reactive } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import { RefreshBtn, DeleteBtn, PlusBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import TagsModalView from '@/views/tag/TagsModalView.vue'
import TagsSortView from '@/views/tag/TagsSortView.vue'
import TagsColorView from '@/views/tag/TagsColorView.vue'
import TagsColorSelect from '@/components/select/TagsColorSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'

export default {
  name: 'TagsView',
  components: {
    DeleteBtn,
    RefreshBtn,
    PlusBtn,
    TagsModalView,
    TagsSortView,
    TagsColorView,
    TagsColorSelect,
    TagsTreeSelect
  },
  computed: {
    ...mapGetters('TagsStore', ['tagsArray', 'recentTagsArray']),
    ...mapGetters('TagsColorStore', ['tagsColor']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch', 'fetchRecent', 'update', 'deleteById']),
    async refreshTable (tab) {
      try {
        this.SyncOutlinedSpin[tab] = true
        this.TableLoading[tab] = true
        await new Promise(resolve => setTimeout(resolve, 100))
        if (tab === 0) {
          await this.fetch()
        } else if (tab === 1) {
          await this.fetchRecent()
        }
        this.SyncOutlinedSpin[tab] = false
        this.TableLoading[tab] = false
      } catch (error) {}
    },
    async onEditFinish (record, tab) {
      try {
        const editData = await this.save(record, tab)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.update({ id: editData.id, data: editData })
        this.cancel(record, tab)
      } catch (error) {}
    },
    async onDelete (id) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.deleteById(id)
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
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref([false, false])
    const SyncOutlinedSpin = ref([false, false])
    const visible = ref(false)
    const activeTab = ref('0')
    const editTableData = reactive({
      0: {},
      1: {}
    })

    const edit = (record, tab, editDataSource) => {
      editTableData[tab][record.id] = cloneDeep(editDataSource.filter(item => record.id === item.id)[0])
    }

    const save = async (record, tab) => {
      return editTableData[tab][record.id]
    }

    const cancel = (record, tab) => {
      delete editTableData[tab][record.id]
    }

    const columns = [
      {
        dataIndex: 'operation',
        width: '7%',
        colSpan: 0
      },
      {
        dataIndex: 'ts_name',
        width: '28%',
        colSpan: 0
      },
      {
        dataIndex: 'tc_show',
        width: '20%',
        colSpan: 0
      },
      {
        dataIndex: 'tc_color',
        width: '20%',
        colSpan: 0
      },
      {
        dataIndex: 'ts_parent_id',
        width: '25%',
        colSpan: 0
      }
    ]

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      visible,
      columns,
      activeTab,
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
