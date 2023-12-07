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
              :dataSource="tagsArray"
              :columns="columns"
              :scroll="{ y: 600, x: 800 }"
              :loading="TableLoading[0]"
            >
              <!-- header -->
              <template #title>
                <span class="float-end">
                  <a-space size="small">
                    <PlusBtn
                      class="btn btn-primary btn-outline-light btn-sm"
                      @click="visible = true"
                    />
                    <RefreshBtn
                      class="btn btn-secondary btn-outline-light btn-sm"
                      :spin="SyncOutlinedSpin[0]"
                      @click="refreshTable(0)"
                    />
                  </a-space>
                </span>
              </template>
              <template #bodyCell="{ column, text, record }">
                <!-- ts_name -->
                <template v-if="['ts_name'].includes(column.dataIndex)">
                  <template v-if="editTableData[0][record.id]">
                    <div class="button-edit-container">
                      <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 0)" />
                      <CloseOutlined class="button-edit-close" @click="cancel(record, 0)" />
                      <a-input
                        v-model:value="editTableData[0][record.id][column.dataIndex as keyof Tag]"
                        style="margin: -5px 0"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="column-container">
                      <template v-if="column.dataIndex === 'ts_name'">
                        <template
                          v-if="
                            (record.parents && record.parents > 0) || record.ts_parent_id !== null
                          "
                        >
                          <span
                            :style="{
                              'margin-left': `${record.ts_level * 6}px`,
                              'margin-right': '3px'
                            }"
                          >
                            │
                          </span>
                        </template>
                        <a-space size="small" align="center">
                          <EditOutlined
                            class="button-edit"
                            @click="edit(record, 0, recentTagsArray)"
                          />
                          <span>
                            {{ text }}
                          </span>
                          <template v-if="record.children.length > 0">
                            <span> （{{ record.children.length }}） </span>
                          </template>
                          <DeleteBtn @confirm="onDelete(record.id)" />
                        </a-space>
                      </template>
                    </div>
                  </template>
                </template>
                <!-- tc_color show-->
                <template v-else-if="['tc_show'].includes(column.dataIndex)">
                  <div style="display: flex; align-items: center; width: 100%">
                    <template v-if="editTableData[0][record.id]">
                      <template
                        v-if="
                          editTableData[0][record.id].tc_color &&
                          editTableData[0][record.id].tc_background &&
                          editTableData[0][record.id].tc_border
                        "
                      >
                        <a-tag
                          :style="
                            'background:' +
                            editTableData[0][record.id]['tc_background'] +
                            ';color:' +
                            editTableData[0][record.id]['tc_color'] +
                            ';border-color:' +
                            editTableData[0][record.id]['tc_border']
                          "
                        >
                          {{ editTableData[0][record.id]['ts_name'] }}
                        </a-tag>
                      </template>
                      <template v-else>
                        <a-tag
                          style="color: #fff; background: #000; border-color: rgb(244, 202, 202)"
                        >
                          {{ editTableData[0][record.id]['ts_name'] }}
                        </a-tag>
                      </template>
                    </template>
                    <template v-else>
                      <a-tag
                        :style="
                          'background:' +
                          record.tc_background +
                          ';color:' +
                          record.tc_color +
                          ';border-color:' +
                          record.tc_border
                        "
                      >
                        {{ record.ts_name }}
                      </a-tag>
                    </template>
                  </div>
                </template>
                <!-- tc_color select -->
                <template v-else-if="['tc_color'].includes(column.dataIndex)">
                  <template v-if="editTableData[0][record.id]">
                    <div style="display: flex; align-items: center; width: 100%">
                      <TagsColorSelect
                        size="small"
                        style="width: 100%; flex: 2"
                        placeholder="選擇標籤顏色"
                        v-model:value="editTableData[0][record.id]['tc_id']"
                        @change="
                          (value) => handleColorSelectChange(value, editTableData[0][record.id])
                        "
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
                      <TagsTreeSelect
                        size="small"
                        placeholder="選擇父標籤"
                        :dropdownMatchSelectWidth="false"
                        style="width: 100%"
                        v-model:value="editTableData[0][record.id]['ts_parent_id']"
                        :defaultValue="editTableData[0][record.id]['ts_parent_id']"
                        :treeDefaultExpandedKeys="[editTableData[0][record.id]['ts_parent_id']]"
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
              :dataSource="recentTagsArray"
              :columns="columns"
              :scroll="{ y: 600, x: 800 }"
              :loading="TableLoading[1]"
            >
              <!-- header -->
              <template #title>
                <span class="float-end">
                  <a-space size="small">
                    <PlusBtn
                      class="btn btn-primary btn-outline-light btn-sm"
                      @click="visible = true"
                    />
                    <RefreshBtn
                      class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2"
                      :spin="SyncOutlinedSpin[1]"
                      @click="refreshTable(1)"
                    />
                  </a-space>
                </span>
              </template>
              <template #bodyCell="{ column, text, record }">
                <!-- ts_name -->
                <template v-if="['ts_name'].includes(column.dataIndex)">
                  <div>
                    <template v-if="editTableData[1][record.id]">
                      <div class="button-edit-container">
                        <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 1)" />
                        <CloseOutlined class="button-edit-close" @click="cancel(record, 1)" />
                        <a-input
                          v-model:value="editTableData[1][record.id][column.dataIndex as keyof Tag]"
                          style="margin: -5px 0"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <a-space size="small" align="center">
                        <EditOutlined
                          class="button-edit2"
                          @click="edit(record, 1, recentTagsArray)"
                        />
                        <span>
                          {{ text }}
                        </span>
                        <DeleteBtn @confirm="onDelete(record.id)" />
                      </a-space>
                    </template>
                  </div>
                </template>
                <!-- tc_color show-->
                <template v-else-if="['tc_show'].includes(column.dataIndex)">
                  <div style="display: flex; align-items: center; width: 100%">
                    <template v-if="editTableData[1][record.id]">
                      <template
                        v-if="
                          editTableData[1][record.id].tc_color &&
                          editTableData[1][record.id].tc_background &&
                          editTableData[1][record.id].tc_border
                        "
                      >
                        <a-tag
                          :style="
                            'background:' +
                            editTableData[1][record.id]['tc_background'] +
                            ';color:' +
                            editTableData[1][record.id]['tc_color'] +
                            ';border-color:' +
                            editTableData[1][record.id]['tc_border']
                          "
                        >
                          {{ editTableData[1][record.id]['ts_name'] }}
                        </a-tag>
                      </template>
                      <template v-else>
                        <a-tag
                          style="color: #fff; background: #000; border-color: rgb(244, 202, 202)"
                        >
                          {{ editTableData[1][record.id]['ts_name'] }}
                        </a-tag>
                      </template>
                    </template>
                    <template v-else>
                      <a-tag
                        :style="
                          'background:' +
                          record.tc_background +
                          ';color:' +
                          record.tc_color +
                          ';border-color:' +
                          record.tc_border
                        "
                      >
                        {{ record.ts_name }}
                      </a-tag>
                    </template>
                  </div>
                </template>
                <!-- tc_color select -->
                <template v-else-if="['tc_color'].includes(column.dataIndex)">
                  <template v-if="editTableData[1][record.id]">
                    <div style="display: flex; align-items: center; width: 100%">
                      <TagsColorSelect
                        v-model:value="editTableData[1][record.id]['tc_id']"
                        placeholder="選擇標籤顏色"
                        @change="
                          (value) => handleColorSelectChange(value, editTableData[1][record.id])
                        "
                        size="small"
                        style="width: 100%; flex: 2"
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
                      <TagsTreeSelect
                        size="small"
                        placeholder="選擇父標籤"
                        :dropdownMatchSelectWidth="false"
                        style="width: 100%"
                        v-model:value="editTableData[1][record.id]['ts_parent_id']"
                        :defaultValue="editTableData[1][record.id]['ts_parent_id']"
                        :treeDefaultExpandedKeys="[editTableData[1][record.id]['ts_parent_id']]"
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
  <TagsModalView v-model:open="visible" />
  <a-back-top />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { RefreshBtn, DeleteBtn, PlusBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import TagsModalView from '@/views/tag/TagsModalView.vue'
import TagsSortView from '@/views/tag/TagsSortView.vue'
import TagsColorView from '@/views/tag/TagsColorView.vue'
import TagsColorSelect from '@/components/select/TagsColorSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import type { UnwrapRef } from 'vue'
import { Tag } from '@/interfaces/Tags'
import { TagsColor } from '@/interfaces/TagsColor'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

provide('mode', 'single') // tagsSelect

const tagsArray = computed(() => store.getters['TagsStore/tagsArray'])
const recentTagsArray = computed(() => store.getters['TagsStore/recentTagsArray'])
const tagsColor = computed(() => store.getters['TagsColorStore/tagsColor'])

const Ready = ref(false)
const TableLoading = ref([false, false])
const SyncOutlinedSpin = ref([false, false])
const visible = ref(false)
const activeTab = ref('0')
const editTableData: UnwrapRef<Record<number, Record<number, Tag>>> = reactive({
  0: {} as Record<number, Tag>,
  1: {} as Record<number, Tag>
})

const edit = (record: Tag, tab: number, editDataSource: Tag[]) => {
  editTableData[tab][record.id] = cloneDeep(
    editDataSource.filter((item) => record.id === item.id)[0]
  )
}

const cancel = (record: Tag, tab: number) => {
  delete editTableData[tab][record.id]
}

const refreshTable = async (tab: number): Promise<void> => {
  try {
    SyncOutlinedSpin.value[tab] = true
    TableLoading.value[tab] = true
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (tab === 0) {
      await store.dispatch('TagsStore/fetch')
    } else if (tab === 1) {
      await store.dispatch('TagsStore/fetchRecent')
    }
    SyncOutlinedSpin.value[tab] = false
    TableLoading.value[tab] = false
  } catch (e) {
    //
  }
}

const onEditFinish = async (record: Tag, tab: number): Promise<void> => {
  try {
    const editData = editTableData[tab][record.id]
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('TagsStore/update', { id: editData.id, data: editData })
    cancel(record, tab)
  } catch (e) {
    //
  }
}

const onDelete = async (id: number): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('TagsStore/deleteById', id)
  } catch (e) {
    //
  }
}

const handleColorSelectChange = (value: number, record: Tag): void => {
  if (value) {
    const newVar = tagsColor.value.find((tagColor: TagsColor) => tagColor.id === value)
    record.tc_background = newVar.tc_background
    record.tc_color = newVar.tc_color
    record.tc_border = newVar.tc_border
  } else {
    record.tc_background = ''
    record.tc_color = ''
    record.tc_border = ''
  }
}

onMounted(async () => {
  try {
    await store.dispatch('TagsStore/fetch')
    await store.dispatch('TagsStore/fetchRecent')
    Ready.value = true
  } catch (e) {
    //
  }
})

const columns = [
  {
    dataIndex: 'operation',
    width: '7%'
  },
  {
    title: '標籤名',
    dataIndex: 'ts_name',
    width: '28%'
  },
  {
    title: '預覽',
    dataIndex: 'tc_show',
    width: '20%'
  },
  {
    title: '顏色',
    dataIndex: 'tc_color',
    width: '20%'
  },
  {
    title: '層級',
    dataIndex: 'ts_parent_id',
    width: '25%'
  }
]
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #{$tags-main-color};
  content: '';
}

.column-container {
  display: flex;
  align-items: center;
}
.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-edit {
  color: #ec5ef4;
}

.button-edit2 {
  color: rgb(8, 131, 247);
}

.button-edit-check {
  margin-right: 10px;
  color: #00db00;
}

.button-edit-close {
  margin-left: auto;
  color: #ea0000;
  padding-right: 6px;
}

/*---------------------
    scss color
-----------------------*/
.dark {
  --tab-background: rgb(52, 37, 46);
  --tab-background-active: #{$tags-main-color};
  --tab-background-active-hover: #{$tags-main-color};
}
</style>
