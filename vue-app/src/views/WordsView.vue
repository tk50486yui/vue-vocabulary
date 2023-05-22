<template>
  <div>
    <button type="button" class="btn btn-primary btn-outline-light btn-sm float-end me-md-3 button-container"
      @click="refreshTable">
      <SyncOutlined :spin="SyncOutlinedSpin"/>
    </button>
    <a-table :dataSource="this.wordsArray"
      :columns="columns"
      :scroll="{x:800, y: 500 }"
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
            <template v-if="editableData[record.key] && column.dataIndex === 'cate_name'">
              <CategoriesTreeSelect size="small" placeholder="選擇"
                :dropdownMatchSelectWidth="false" style="width: 100%"
                v-model="editableData[record.key]['cate_id']"
                :defaultValue="editableData[record.key]['cate_id']"/>
            </template>
            <template v-else-if="editableData[record.key]">
              <a-input v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"/>
            </template>
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div>
            <template v-if="editableData[record.key]">
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

<script>
import { mapActions, mapGetters } from 'vuex'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SyncOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

export default {
  name: 'WordsView',
  components: {
    SyncOutlined,
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    CategoriesTreeSelect
  },
  computed: {
    cateID () {
      return this.$route.params.cateID
    },
    ...mapGetters('WordsStore', ['wordsArray'])
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
      } catch (error) {
        console.log('retable' + error)
      }
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
    console.log('home')
    await this.fetch()
  },
  watch: {
    '$route' (to, from) {
      console.log(this.cateID)
    }
  },
  setup () {
    const TableLoading = ref(false)
    const SyncOutlinedSpin = ref(false)
    const editDataSource = ref()
    const editableData = reactive({})

    const edit = record => {
      editableData[record.key] = cloneDeep(editDataSource.value.filter(item => record.key === item.key)[0])
    }

    const cancel = record => {
      delete editableData[record.key]
    }

    const save = async record => {
      return editableData[record.key]
    }

    const columns = [
      {
        title: '類別',
        dataIndex: 'cate_name',
        width: '20%'
      },
      {
        title: '單字名稱',
        dataIndex: 'ws_name',
        width: '30%'
      },
      {
        title: '假名 / 外來語',
        dataIndex: 'ws_pronunciation',
        width: '25%'
      },
      {
        title: '中文定義',
        dataIndex: 'ws_definition',
        width: '20%'
      },
      {
        title: 'edit',
        dataIndex: 'operation',
        width: '10%'
      }
    ]

    return {
      TableLoading,
      SyncOutlinedSpin,
      columns,
      editDataSource,
      editableData,
      edit,
      save,
      cancel
    }
  }

}
</script>

<style scoped>
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
  color:#6A6AFF;
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
