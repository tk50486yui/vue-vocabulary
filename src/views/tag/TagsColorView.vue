<template>
  <!-- 上層 顏色新增 -->
  <div class="demo-color-block">
    <span class="demonstration">
      <a-tag
        :style="
          'background:' +
          selectedBackground +
          ';color:' +
          selectedColor +
          ';border-color:' +
          selectedBorder
        "
      >
        With default value
      </a-tag>
    </span>
    <span class="main-body" :class="$theme">
      背景：
      <el-color-picker
        @active-change="activeBackground"
        size="large"
        v-model="selectedBackground"
        show-alpha
      />
      文字：
      <el-color-picker
        @active-change="activeColor"
        size="large"
        v-model="selectedColor"
        show-alpha
      />
      邊框：
      <el-color-picker
        @active-change="activeBorder"
        size="large"
        v-model="selectedBorder"
        show-alpha
      />
    </span>
    <a-button
      class="btn btn-primary btn-outline-light btn-sm button-add"
      @click="onFinish"
      :loading="confirmLoading"
    >
      儲存顏色
    </a-button>
  </div>
  <p></p>
  <!-- 主表格 顏色 -->
  <div class="table-theme" :class="$theme">
    <a-table
      :dataSource="tagsColorArray"
      :columns="columns"
      :scroll="{ y: 600 }"
      :showHeader="false"
    >
      <template #bodyCell="{ column, record }">
        <template
          v-if="['id', 'tc_color', 'tc_background', 'tc_border'].includes(column.dataIndex)"
        >
          <!-- id -->
          <template v-if="column.dataIndex === 'id'">
            <template v-if="editTableData[record.id]"> #{{ record.id }} </template>
            <template v-else>
              <div class="column-container">#{{ record.id }}</div>
            </template>
          </template>
          <!-- tc_color -->
          <template v-else-if="column.dataIndex === 'tc_color'">
            <template v-if="editTableData[record.id]">
              <div>
                <a-tag
                  :style="
                    'background:' +
                    editTableData[record.id]['tc_background'] +
                    ';color:' +
                    editTableData[record.id]['tc_color'] +
                    ';border-color:' +
                    editTableData[record.id]['tc_border']
                  "
                >
                  With default value
                </a-tag>
                背景：
                <el-color-picker
                  @active-change="(value: string) => activeBackground(value, record.id)"
                  size="large"
                  v-model="editTableData[record.id]['tc_background']"
                  show-alpha
                />
                文字：
                <el-color-picker
                  @active-change="(value: string) => activeColor(value, record.id)"
                  size="large"
                  v-model="editTableData[record.id]['tc_color']"
                  show-alpha
                />
                邊框：
                <el-color-picker
                  @active-change="(value: string) => activeBorder(value, record.id)"
                  size="large"
                  v-model="editTableData[record.id]['tc_border']"
                  show-alpha
                />
              </div>
            </template>
            <template v-else>
              <div class="column-container">
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
                  With default value
                </a-tag>
                <DeleteBtn @confirm="onDelete(record.id)" />
              </div>
            </template>
          </template>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <template v-if="editTableData[record.id]">
            <CheckOutlined class="button-edit-check" @click="onEditFinish(record)" />
            <CloseOutlined class="button-edit-close" @click="cancel(record)" />
          </template>
          <template v-else>
            <div class="column-container">
              <EditOutlined class="button-edit" @click="edit(record, tagsColorArray)" />
            </div>
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { DeleteBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import type { UnwrapRef } from 'vue'
import { TagsColor, TagsColorForm } from '@/interfaces/TagsColor'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const tagsColorArray = computed(() => store.getters['TagsColorStore/tagsColorArray'])

const editTableData: UnwrapRef<Record<number, TagsColor>> = reactive({})
const confirmLoading = ref<boolean>(false)
const selectedBackground = ref<string>('rgba(0, 0, 0, 1)')
const selectedColor = ref<string>('rgba(248, 246, 246, 1)')
const selectedBorder = ref<string>('rgba(245, 241, 241, 1)')
const formState = reactive({
  tagsColor: {} as TagsColorForm
})

const edit = (record: TagsColor, editDataSource: TagsColor[]) => {
  editTableData[record.id] = cloneDeep(editDataSource.filter((item) => record.id === item.id)[0])
}

const cancel = (record: TagsColor) => {
  delete editTableData[record.id]
}

const onFinish = async (): Promise<void> => {
  try {
    formState.tagsColor.tc_color = selectedColor.value
    formState.tagsColor.tc_background = selectedBackground.value
    formState.tagsColor.tc_border = selectedBorder.value
    confirmLoading.value = true
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('TagsColorStore/add', formState.tagsColor)
    selectedBackground.value = 'rgba(0, 0, 0, 1)'
    selectedColor.value = 'rgba(248, 246, 246, 1)'
    selectedBorder.value = 'rgba(245, 241, 241, 1)'
    confirmLoading.value = false
  } catch (e) {
    //
  }
}

const onEditFinish = async (record: TagsColor): Promise<void> => {
  try {
    const editData = editTableData[record.id]
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('TagsColorStore/update', { id: editData.id, data: editData })
    cancel(record)
  } catch (e) {
    //
  }
}

const onDelete = async (id: number): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('TagsColorStore/deleteById', id)
  } catch (e) {
    //
  }
}

const activeBackground = (value: string, id: number): void => {
  if (id) {
    editTableData[id].tc_background = value
  } else {
    selectedBackground.value = value
  }
}
const activeColor = (value: string, id: number): void => {
  if (id) {
    editTableData[id].tc_color = value
  } else {
    selectedColor.value = value
  }
}
const activeBorder = (value: string, id: number): void => {
  if (id) {
    editTableData[id].tc_border = value
  } else {
    selectedBorder.value = value
  }
}

onMounted(async () => {
  try {
    await store.dispatch('TagsColorStore/fetch')
  } catch (e) {
    //
  }
})

const columns = [
  {
    dataIndex: 'operation',
    width: '10%',
    colSpan: 0
  },
  {
    dataIndex: 'id',
    width: '10%',
    colSpan: 0
  },
  {
    dataIndex: 'tc_color',
    width: '80%',
    colSpan: 0
  }
]
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.demo-color-block .demonstration {
  margin-right: 16px;
}

.column-container {
  display: flex;
  align-items: center;
}

.button-add {
  margin-left: 32px;
}

.button-edit {
  color: #ec5ef4;
  padding-right: 6px;
}

.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
