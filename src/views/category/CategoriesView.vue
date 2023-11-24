<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>類別列表</h4>
    </div>
    <div class="tab-theme" :class="$theme">
      <a-tabs v-model:activeKey="activeTab" type="card" tab-position="top">
        <!-- tab 0 -->
        <a-tab-pane key="0" tab="全部">
          <div class="table-theme" :class="$theme">
            <a-table
              :dataSource="categoriesArray"
              :columns="columns"
              :scroll="{ y: 600, x: 450 }"
              :loading="TableLoading[0]"
            >
              <!-- header -->
              <template #title>
                <span class="float-end">
                  <a-space size="small">
                    <PlusBtn class="btn btn-primary btn-outline-light" @click="visible = true" />
                    <RefreshBtn
                      class="btn btn-secondary btn-outline-light"
                      :spin="SyncOutlinedSpin[0]"
                      @click="refreshTable(0)"
                    />
                  </a-space>
                </span>
              </template>
              <template #bodyCell="{ column, text, record }">
                <!-- cate_name -->
                <template v-if="['cate_name'].includes(column.dataIndex)">
                  <template v-if="editTableData[0][record.id]">
                    <div class="button-edit-container">
                      <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 0)" />
                      <CloseOutlined class="button-edit-close" @click="cancel(record, 0)" />
                      <a-input
                        v-model:value="
                          editTableData[0][record.id][column.dataIndex as keyof Category]
                        "
                        style="margin: -5px 0"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="column-container">
                      <template v-if="column.dataIndex === 'cate_name'">
                        <template
                          v-if="
                            (record.parents && record.parents > 0) || record.cate_parent_id !== null
                          "
                        >
                          <span
                            :style="{
                              'margin-left': `${record.cate_level * 14}px`,
                              'margin-right': '6px'
                            }"
                          >
                            │</span
                          >
                        </template>
                        <EditOutlined
                          class="button-edit"
                          @click="edit(record, 0, recentCategoriesArray)"
                        />
                        {{ text }}
                        <template v-if="record.children.length > 0">
                          （{{ record.children.length }}）
                        </template>
                        <DeleteBtn @confirm="onDelete(record.id)" />
                      </template>
                    </div>
                  </template>
                </template>
                <!-- cate_parent_id -->
                <template v-else-if="['cate_parent_id'].includes(column.dataIndex)">
                  <template v-if="column.dataIndex === 'cate_parent_id'">
                    <template v-if="editTableData[0][record.id]">
                      <CategoriesTreeSelect
                        size="small"
                        placeholder="選擇父類別"
                        :dropdownMatchSelectWidth="false"
                        style="width: 100%"
                        v-model:value="editTableData[0][record.id]['cate_parent_id']"
                        :defaultValue="editTableData[0][record.id]['cate_parent_id']"
                        :treeDefaultExpandedKeys="[editTableData[0][record.id]['cate_parent_id']]"
                      />
                    </template>
                    <template v-else>
                      {{ record.cate_parent_name }}
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
              :dataSource="recentCategoriesArray"
              :columns="columns"
              :scroll="{ y: 600, x: 450 }"
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
                      class="btn btn-secondary btn-outline-light btn-sm"
                      :spin="SyncOutlinedSpin[1]"
                      @click="refreshTable(1)"
                    />
                  </a-space>
                </span>
              </template>
              <template #bodyCell="{ column, text, record }">
                <!-- cate_name -->
                <template v-if="['cate_name'].includes(column.dataIndex)">
                  <template v-if="editTableData[1][record.id]">
                    <div class="button-edit-container">
                      <CheckOutlined class="button-edit-check" @click="onEditFinish(record, 1)" />
                      <CloseOutlined class="button-edit-close" @click="cancel(record, 1)" />
                      <a-input
                        v-model:value="
                          editTableData[1][record.id][column.dataIndex as keyof Category]
                        "
                        style="margin: -5px 0"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="column-container">
                      <EditOutlined
                        class="button-edit2"
                        @click="edit(record, 1, recentCategoriesArray)"
                      />
                      {{ text }}
                      <DeleteBtn @confirm="onDelete(record.id)" />
                    </div>
                  </template>
                </template>
                <!-- cate_parent_id -->
                <template v-else-if="['cate_parent_id'].includes(column.dataIndex)">
                  <template v-if="column.dataIndex === 'cate_parent_id'">
                    <template v-if="editTableData[1][record.id]">
                      <CategoriesTreeSelect
                        size="small"
                        placeholder="選擇父類別"
                        :dropdownMatchSelectWidth="false"
                        style="width: 100%"
                        v-model:value="editTableData[1][record.id]['cate_parent_id']"
                        :defaultValue="editTableData[1][record.id]['cate_parent_id']"
                        :treeDefaultExpandedKeys="[editTableData[1][record.id]['cate_parent_id']]"
                      />
                    </template>
                    <template v-else>
                      {{ record.cate_parent_name }}
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
          <CategoriesSortView />
        </a-tab-pane>
      </a-tabs>
    </div>
  </template>
  <!-- Modal-->
  <CategoriesModalView v-model:open="visible" />
  <a-back-top />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { PlusBtn, RefreshBtn, DeleteBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import CategoriesModalView from '@/views/category/CategoriesModalView.vue'
import CategoriesSortView from '@/views/category/CategoriesSortView.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import type { UnwrapRef } from 'vue'
import { Category } from '@/interfaces/Categories'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const categoriesArray = computed(() => store.getters['CategoriesStore/categoriesArray'])
const recentCategoriesArray = computed(() => store.getters['CategoriesStore/recentCategoriesArray'])

const Ready = ref(false)
const TableLoading = ref([false, false])
const SyncOutlinedSpin = ref([false, false])
const visible = ref<boolean>(false)
const activeTab = ref<string>('0')
const editTableData: UnwrapRef<Record<number, Record<number, Category>>> = reactive({
  0: {} as Record<number, Category>,
  1: {} as Record<number, Category>
})

const edit = (record: Category, tab: number, editDataSource: Category[]) => {
  editTableData[tab][record.id] = cloneDeep(
    editDataSource.filter((item) => record.id === item.id)[0]
  )
}

const cancel = (record: Category, tab: number) => {
  delete editTableData[tab][record.id]
}

const refreshTable = async (tab: number): Promise<void> => {
  try {
    SyncOutlinedSpin.value[tab] = true
    TableLoading.value[tab] = true
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (tab === 0) {
      await store.dispatch('CategoriesStore/fetch')
    } else if (tab === 1) {
      await store.dispatch('CategoriesStore/fetchRecent')
    }
    SyncOutlinedSpin.value[tab] = false
    TableLoading.value[tab] = false
  } catch (e) {
    //
  }
}

const onEditFinish = async (record: Category, tab: number): Promise<void> => {
  try {
    const editData = editTableData[tab][record.id]
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('CategoriesStore/update', { id: editData.id, data: editData })
    cancel(record, tab)
  } catch (e) {
    //
  }
}

const onDelete = async (id: number): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('CategoriesStore/deleteById', id)
  } catch (e) {
    //
  }
}

onMounted(async () => {
  try {
    await store.dispatch('CategoriesStore/fetch')
    await store.dispatch('CategoriesStore/fetchRecent')
    Ready.value = true
  } catch (e) {
    //
  }
})
const columns = [
  {
    dataIndex: 'operation',
    width: '7%',
    colSpan: 0
  },
  {
    dataIndex: 'cate_name',
    width: '63%',
    colSpan: 0
  },
  {
    dataIndex: 'cate_parent_id',
    width: '30%',
    colSpan: 0
  }
]
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
  content: '';
}

.column-container {
  display: flex;
  align-items: center;
}

.button-edit {
  color: #d8f74f;
  padding-right: 6px;
}

.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-edit2 {
  display: flex;
  justify-content: center;
  padding-right: 6px;
  color: #6a6aff;
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
</style>
