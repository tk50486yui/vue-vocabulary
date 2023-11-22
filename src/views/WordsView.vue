<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>單字表</h4>
    </div>
    <div class="select-theme" :class="$theme" ref="selectMod">
      每頁：
      <a-select
        v-model:value="selectPageSize"
        ref="select"
        :getPopupContainer="() => $refs.selectMod"
        size="small"
        style="width: 80px"
        @change="handlePageSize()"
      >
        <a-select-option value="10">10 筆</a-select-option>
        <a-select-option value="20">20 筆</a-select-option>
        <a-select-option value="50">50 筆</a-select-option>
        <a-select-option value="100">100 筆</a-select-option>
        <a-select-option :value="wordsArray.length">全部</a-select-option>
      </a-select>
      <span style="padding-left: 8px">表格高度：</span>
      <a-select
        v-model:value="selectTablescrollY"
        :getPopupContainer="() => $refs.selectMod"
        size="small"
        style="width: 80px"
        @change="handleTableScrollY()"
      >
        <a-select-option value="400">極低</a-select-option>
        <a-select-option value="600">低</a-select-option>
        <a-select-option value="800">適中</a-select-option>
        <a-select-option value="1000">高</a-select-option>
        <a-select-option value="1500">極高</a-select-option>
      </a-select>
    </div>
    <div class="table-theme" :class="$theme">
      <a-table
        :dataSource="wordsArray"
        :columns="columns"
        :scroll="{ y: TablescrollY, x: 850 }"
        :loading="TableLoading"
        :pagination="pagination"
      >
        <!-- Table header -->
        <template #title>
          <PlusBtn
            class="btn btn-primary btn-outline-light btn-sm float-end me-md-2"
            @click="onDrawerShow()"
          />
          <RefreshBtn
            class="btn btn-info btn-outline-light btn-sm float-end me-md-2"
            :spin="SyncOutlinedSpin"
            @click="refreshTable"
          />
        </template>
        <!-- Table expanded -->
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            <a-typography-paragraph
              :copyable="{ text: record.ws_name }"
            ></a-typography-paragraph>
          </p>
          <p></p>
          <DeleteBtn @confirm="onDelete(record.id)" />
          <p></p>
          <div v-html="record.ws_description"></div>
        </template>
        <!-- Table body -->
        <template #bodyCell="{ column, text, record }">
          <template
            v-if="
              [
                'ws_name',
                'ws_pronunciation',
                'ws_definition',
                'cate_name'
              ].includes(column.dataIndex)
            "
          >
            <div>
              <template
                v-if="
                  editTableData[record.id] && column.dataIndex === 'cate_name'
                "
              >
                <CategoriesTreeSelect
                  size="small"
                  placeholder="選擇"
                  :dropdownMatchSelectWidth="false"
                  style="width: 100%"
                  v-model:value="editTableData[record.id]['cate_id']"
                  :defaultValue="editTableData[record.id]['cate_id']"
                  :treeDefaultExpandedKeys="[
                    editTableData[record.id]['cate_id']
                  ]"
                  @change="
                    handleCategoriesSelectChange(editTableData[record.id])
                  "
                />
              </template>
              <template v-else-if="editTableData[record.id]">
                <a-input
                  v-model:value="
                    editTableData[record.id][column.dataIndex as keyof Word]
                  "
                  style="margin: -5px 0"
                />
              </template>
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <!-- Table operation -->
          <template v-else-if="column.dataIndex === 'operation'">
            <div>
              <template v-if="editTableData[record.id]">
                <div class="button-edit-container">
                  <CheckOutlined
                    class="button-edit-check"
                    @click="onEditFinish(record)"
                  />
                  <CloseOutlined
                    class="button-edit-close"
                    @click="cancel(record)"
                  />
                </div>
              </template>
              <template v-else>
                <EditOutlined
                  class="button-edit"
                  @click="edit(record, wordsArray)"
                />
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'common'">
            <!-- Icon Star Heart -->
            <span class="icon-theme" :class="$theme">
              <template v-if="record.ws_is_common">
                <span class="icon-star">
                  <a @click="onUpdateCommon(record.id, record)">
                    <StarFilled />
                  </a>
                </span>
              </template>
              <template v-else>
                <span class="icon-star-false">
                  <a @click="onUpdateCommon(record.id, record)">
                    <StarFilled />
                  </a>
                </span>
              </template>
              <template v-if="record.ws_is_important">
                <span class="icon-heart">
                  <a @click="onUpdateImportant(record.id, record)">
                    <HeartFilled />
                  </a>
                </span>
              </template>
              <template v-else>
                <span class="icon-heart-false">
                  <a @click="onUpdateImportant(record.id, record)">
                    <HeartFilled />
                  </a>
                </span>
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </template>
  <!-- drawer words add -->
  <WordsDrawerView
    ref="wordsDrawerRef"
    :open="wordsDrawerVisible"
    @close="wordsDrawerVisible = false"
  />
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import { PlusBtn, DeleteBtn, RefreshBtn } from '@/components/button'
import { cloneDeep } from 'lodash-es'
import WordsDrawerView from '@/views/WordsDrawerView.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import type { UnwrapRef } from 'vue'
import { Word } from '@/interfaces/Words'

export default defineComponent({
  name: 'WordsView',
  components: {
    PlusBtn,
    DeleteBtn,
    RefreshBtn,
    WordsDrawerView,
    CategoriesTreeSelect
  },
  computed: {
    ...mapGetters('WordsStore', ['wordsArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', [
      'fetch',
      'update',
      'updateCommon',
      'updateImportant',
      'deleteById'
    ]),
    async refreshTable(): Promise<void> {
      try {
        this.SyncOutlinedSpin = true
        this.TableLoading = true
        await new Promise((resolve) => setTimeout(resolve, 100))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.TableLoading = false
      } catch (error) {
        //
      }
    },
    async onEditFinish(record: Word): Promise<void> {
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
    async onUpdateCommon(id: number, data: Word): Promise<void> {
      try {
        data.ws_is_common = !data.ws_is_common
        await this.updateCommon({ id: id, data: data })
      } catch (error) {
        //
      }
    },
    async onUpdateImportant(id: number, data: Word): Promise<void> {
      try {
        data.ws_is_important = !data.ws_is_important
        await this.updateImportant({ id: id, data: data })
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
    handleCategoriesSelectChange(currentData: Word): void {
      currentData.cate_id =
        typeof currentData.cate_id !== 'undefined' ? currentData.cate_id : null
    },
    handlePageSize(): void {
      this.pagination.pageSize = Number(this.selectPageSize)
    },
    handleTableScrollY(): void {
      this.TablescrollY = Number(this.selectTablescrollY)
    },
    // drawer
    onDrawerShow(): void {
      this.wordsDrawerRef.setDrawerStyle()
      this.wordsDrawerVisible = true
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
    const TableLoading = ref(false)
    const SyncOutlinedSpin = ref(false)
    const editTableData: UnwrapRef<Record<number, Word>> = reactive({})
    const wordsDrawerRef = ref()
    const wordsDrawerVisible = ref(false)
    const TablescrollY = ref(400)
    const selectTablescrollY = ref('400')
    const selectPageSize = ref('10')
    const pagination = reactive({
      pageSize: Number(selectPageSize.value),
      position: ['topLEFT', 'bottomLeft'],
      showSizeChanger: false
    })
    const edit = (record: Word, editDataSource: Word[]) => {
      editTableData[record.id] = cloneDeep(
        editDataSource.filter((item) => record.id === item.id)[0]
      )
    }

    const cancel = (record: Word) => {
      delete editTableData[record.id]
    }

    const save = async (record: Word) => {
      return editTableData[record.id]
    }

    const columns = [
      {
        dataIndex: 'operation',
        width: '8%'
      },
      {
        title: '類別',
        dataIndex: 'cate_name',
        width: '18%',
        filters: [
          {
            text: '動物',
            value: '動物'
          },
          {
            text: '昆蟲',
            value: '昆蟲'
          }
        ],
        onFilter: (value: string, record: Word) =>
          record.cate_name != null && record.cate_name.indexOf(value) === 0
      },
      {
        title: '單字名稱',
        dataIndex: 'ws_name',
        width: '28%'
      },
      {
        title: '假名 / 發音',
        dataIndex: 'ws_pronunciation',
        width: '20%'
      },
      {
        title: '中文定義',
        dataIndex: 'ws_definition',
        width: '18%'
      },
      {
        dataIndex: 'common',
        width: '8%'
      }
    ]

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      wordsDrawerRef,
      wordsDrawerVisible,
      columns,
      TablescrollY,
      selectTablescrollY,
      selectPageSize,
      pagination,
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

.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #17b0f7;
  content: '';
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-edit {
  display: flex;
  justify-content: center;
  color: $edit-icon-color;
}

.button-edit-check {
  margin-right: 10px;
  color: #00db00;
}

.button-edit-close {
  margin-left: auto;
  color: #ea0000;
}

.icon-star {
  padding-right: 4px;
}

.icon-star-false {
  padding-right: 4px;
}
</style>