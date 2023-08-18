<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>單字表</h4>
    </div>
    <div class="select-theme" :class="this.$theme">
      每頁顯示：
      <a-select
          ref="select"
          v-model:value="selectPageSize"
          size="small"
          style="width: 80px"
          @change="handlePageSize()"
          >
          <a-select-option value="10">10 筆</a-select-option>
          <a-select-option value="20">20 筆</a-select-option>
          <a-select-option value="50">50 筆</a-select-option>
          <a-select-option value="100">100 筆</a-select-option>
          <a-select-option :value="this.wordsArray.length">全部</a-select-option>
      </a-select>
      <span style="padding-left: 8px;">表格高度：</span>
      <a-select
          v-model:value="selectTablescrollY"
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
    <RefreshBtn class="button-container" :spin="SyncOutlinedSpin"  @click="refreshTable"/>
    <div class="table-theme" :class="this.$theme">
      <a-table :dataSource="this.wordsArray"
        :columns="columns"
        :scroll="{ y: TablescrollY, x: 850 }"
        :loading="TableLoading"
        :pagination="pagination"
      >
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            <a-typography-paragraph :copyable="{ text: record.ws_name }"></a-typography-paragraph>
          </p>
          <p style="margin: 0">
            {{ record.ws_description }}
          </p>
        </template>
        <template #bodyCell="{ column, text, record }">
          <template v-if="['ws_name', 'ws_pronunciation', 'ws_definition', 'cate_name'].includes(column.dataIndex)">
            <div>
              <template v-if="editTableData[record.key] && column.dataIndex === 'cate_name'">
                <CategoriesTreeSelect size="small" placeholder="選擇"
                  :dropdownMatchSelectWidth="false" style="width: 100%"
                  v-model:value="editTableData[record.key]['cate_id']"
                  :defaultValue="editTableData[record.key]['cate_id']"
                  :treeDefaultExpandedKeys="[editTableData[record.key]['cate_id']]"
                 />
              </template>
              <template v-else-if="editTableData[record.key]">
                <a-input v-model:value="editTableData[record.key][column.dataIndex]"
                  style="margin: -5px 0"/>
              </template>
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div>
              <template v-if="editTableData[record.key]">
                <div class="button-edit-container">
                  <CheckOutlined class="button-edit-check" @click="onEditFinish(record)"/>
                  <CloseOutlined class="button-edit-close" @click="cancel(record)"/>
                </div>
              </template>
              <template v-else>
                <EditOutlined class="button-edit" @click="edit(record)" />
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'common'">
            <!-- Icon Star Heart -->
            <span class="icon-theme" :class="this.$theme">
              <template v-if="record.ws_is_common">
                <span class="icon-star">
                  <a @click="onUpdateCommon(record.id, record)"><StarFilled /></a>
                </span>
              </template>
              <template v-else>
                <span class="icon-star-false">
                  <a @click="onUpdateCommon(record.id, record)"><StarFilled /></a>
                </span>
              </template>
              <template v-if="record.ws_is_important">
                <span class="icon-heart">
                  <a @click="onUpdateImportant(record.id, record)"><HeartFilled /></a>
                </span>
              </template>
              <template v-else>
                <span class="icon-heart-false">
                  <a @click="onUpdateImportant(record.id, record)"><HeartFilled /></a>
                </span>
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, CheckOutlined, CloseOutlined, StarFilled, HeartFilled } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

export default {
  name: 'WordsView',
  components: {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    StarFilled,
    HeartFilled,
    RefreshBtn,
    CategoriesTreeSelect
  },
  computed: {
    cateID () {
      return this.$route.params.cateID
    },
    ...mapGetters('WordsStore', ['wordsArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    ...mapActions('WordsStore', {
      updateWord: 'update'
    }),
    ...mapActions('WordsStore', {
      updateCommon: 'updateCommon'
    }),
    ...mapActions('WordsStore', {
      updateImportant: 'updateImportant'
    }),
    async refreshTable () {
      try {
        this.SyncOutlinedSpin = true
        this.TableLoading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.TableLoading = false
        this.editDataSource = this.wordsArray
      } catch (error) {}
    },
    async onEditFinish (record) {
      try {
        const editData = await this.save(record)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateWord({ id: editData.id, data: editData })
        await this.fetch()
        this.editDataSource = this.wordsArray
        this.cancel(record)
      } catch (error) {}
    },
    async onUpdateCommon (id, data) {
      try {
        data.ws_is_common = !data.ws_is_common
        await this.updateCommon({ id: id, data: data })
        await this.fetch()
      } catch (error) {}
    },
    async onUpdateImportant (id, data) {
      try {
        data.ws_is_important = !data.ws_is_important
        await this.updateImportant({ id: id, data: data })
        await this.fetch()
      } catch (error) {}
    },
    handlePageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
    },
    handleTableScrollY () {
      this.TablescrollY = Number(this.selectTablescrollY)
    }
  },
  async created () {
    try {
      await this.fetch()
      this.editDataSource = this.wordsArray
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref(false)
    const SyncOutlinedSpin = ref(false)
    const editDataSource = ref()
    const editTableData = reactive({})
    const TablescrollY = ref(400)
    const selectTablescrollY = ref('400')
    const selectPageSize = ref('10')
    const pagination = reactive({
      pageSize: Number(selectPageSize.value),
      position: 'top'
    })
    const edit = record => {
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
        width: '8%',
        fixed: true
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
        onFilter: (value, record) => record.cate_name != null && record.cate_name.indexOf(value) === 0
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
      columns,
      TablescrollY,
      selectTablescrollY,
      selectPageSize,
      pagination,
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
  content: "";
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px
}
.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-edit{
  display: flex;
  justify-content: center;
  color:$edit-icon-color;
}
.button-edit-check{
  margin-right: 10px;
  color:#00DB00;
}
.button-edit-close{
  margin-left: auto;
  color:#EA0000;
}
.icon-star{
  padding-right: 4px;
}
.icon-star-false{
  padding-right: 4px;
}
</style>
