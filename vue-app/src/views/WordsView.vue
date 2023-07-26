<template>
  <template v-if="Ready">
    <RefreshBtn class="button-container" :spin="SyncOutlinedSpin"  @click="refreshTable"/>
    <div class="table-theme" :class="this.$theme">
      <a-table :dataSource="this.wordsArray"
        :columns="columns"
        :scroll="{ y: 600, x: 850 }"
        :loading="TableLoading"
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
        </template>
      </a-table>
    </div>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

export default {
  name: 'WordsView',
  components: {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
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
        width: '10%',
        fixed: true
      },
      {
        title: '類別',
        dataIndex: 'cate_name',
        width: '20%',
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
        width: '30%'
      },
      {
        title: '假名 / 外來語',
        dataIndex: 'ws_pronunciation',
        width: '20%'
      },
      {
        title: '中文定義',
        dataIndex: 'ws_definition',
        width: '20%'
      }
    ]

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      columns,
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
</style>
