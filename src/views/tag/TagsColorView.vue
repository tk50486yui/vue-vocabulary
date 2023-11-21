<template>
  <template v-if="Ready">
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
            v-if="
              ['id', 'tc_color', 'tc_background', 'tc_border'].includes(
                column.dataIndex
              )
            "
          >
            <!-- id -->
            <template v-if="column.dataIndex === 'id'">
              <template v-if="editTableData[record.id]">
                #{{ record.id }}
              </template>
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
                    @active-change="
                      (value: string) => activeBackground(value, record.id)
                    "
                    size="large"
                    v-model="editTableData[record.id]['tc_background']"
                    show-alpha
                  />
                  文字：
                  <el-color-picker
                    @active-change="
                      (value: string) => activeColor(value, record.id)
                    "
                    size="large"
                    v-model="editTableData[record.id]['tc_color']"
                    show-alpha
                  />
                  邊框：
                  <el-color-picker
                    @active-change="
                      (value: string) => activeBorder(value, record.id)
                    "
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
              <CheckOutlined
                class="button-edit-check"
                @click="onEditFinish(record)"
              />
              <CloseOutlined
                class="button-edit-close"
                @click="cancel(record)"
              />
            </template>
            <template v-else>
              <div class="column-container">
                <EditOutlined
                  class="button-edit"
                  @click="edit(record, tagsColorArray)"
                />
              </div>
            </template>
          </template>
        </template>
      </a-table>
    </div>
  </template>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import { DeleteBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import type { UnwrapRef } from 'vue'
import { TagsColor, TagsColorForm } from '@/interfaces/TagsColor'

export default defineComponent({
  name: 'TagsColorView',
  components: {
    DeleteBtn
  },
  computed: {
    ...mapGetters('TagsColorStore', ['tagsColorArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsColorStore', ['fetch', 'add', 'update', 'deleteById']),
    async onFinish(): Promise<void> {
      try {
        this.formState.tagsColor.tc_color = this.selectedColor
        this.formState.tagsColor.tc_background = this.selectedBackground
        this.formState.tagsColor.tc_border = this.selectedBorder
        this.confirmLoading = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.add(this.formState.tagsColor)
        this.selectedBackground = 'rgba(0, 0, 0, 1)'
        this.selectedColor = 'rgba(248, 246, 246, 1)'
        this.selectedBorder = 'rgba(245, 241, 241, 1)'
        this.confirmLoading = false
      } catch (error) {
        //
      }
    },
    async onEditFinish(record: TagsColor): Promise<void> {
      try {
        const editData = await this.save(record)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.update({ id: editData.id, data: editData })
        this.cancel(record)
      } catch (error) {
        //
      }
    },
    async onDelete(id: number): Promise<void> {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.deleteById(id)
      } catch (error) {
        //
      }
    },
    activeBackground(value: string, id: number): void {
      if (id) {
        this.editTableData[id].tc_background = value
      } else {
        this.selectedBackground = value
      }
    },
    activeColor(value: string, id: number): void {
      if (id) {
        this.editTableData[id].tc_color = value
      } else {
        this.selectedColor = value
      }
    },
    activeBorder(value: string, id: number): void {
      if (id) {
        this.editTableData[id].tc_border = value
      } else {
        this.selectedBorder = value
      }
    }
  },
  async created() {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {
      //
    }
  },
  setup() {
    const Ready = ref(false)
    const editTableData: UnwrapRef<Record<number, TagsColor>> = reactive({})
    const confirmLoading = ref(false)
    const selectedBackground = ref('rgba(0, 0, 0, 1)')
    const selectedColor = ref('rgba(248, 246, 246, 1)')
    const selectedBorder = ref('rgba(245, 241, 241, 1)')
    const formState = reactive({
      tagsColor: {} as TagsColorForm
    })

    const edit = (record: TagsColor, editDataSource: TagsColor[]) => {
      editTableData[record.id] = cloneDeep(
        editDataSource.filter((item) => record.id === item.id)[0]
      )
    }

    const save = async (record: TagsColor) => {
      return editTableData[record.id]
    }

    const cancel = (record: TagsColor) => {
      delete editTableData[record.id]
    }

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

    return {
      Ready,
      columns,
      selectedColor,
      selectedBackground,
      selectedBorder,
      formState,
      confirmLoading,
      editTableData,
      edit,
      save,
      cancel
    }
  }
})
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
