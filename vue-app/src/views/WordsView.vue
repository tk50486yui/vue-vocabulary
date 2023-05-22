<template>
  <div>
    <button type="button" class="btn btn-primary btn-outline-light btn-sm float-end me-md-3 button-container"
      @click="refreshTable">
      <SyncOutlined :spin="SyncOutlinedSpin"/>
    </button>
    <a-table :dataSource="this.wordsArray" :columns="columns"
      :scroll="{ y: 400 }" :loading="isTableLoading">
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
            <template v-if="editableData[record.key]">
              <a-input v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"/>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div>
            <span v-if="editableData[record.key]">
              <a-typography-link @click="onEditFinish(record)">Save</a-typography-link>
              <a-popconfirm title="Sure to cancel?" @confirm="cancel(record)">
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record)">Edit</a>
            </span>
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
import { SyncOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'

const columns = [
  {
    title: '類別',
    dataIndex: 'cate_name',
    fixed: true,
    width: '20%'
  },
  {
    title: '單字名稱',
    dataIndex: 'ws_name',
    fixed: true,
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
    title: 'operation',
    dataIndex: 'operation',
    width: '15%'
  }
]

export default {
  name: 'WordsView',
  components: {
    SyncOutlined
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
        this.isTableLoading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.isTableLoading = false
        this.dataSource = this.wordsArray
      } catch (error) {}
    },
    async onEditFinish (record) {
      try {
        const editData = await this.save(record)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateWord({ id: editData.id, data: editData })
        this.cancel(record)
      } catch (error) {
        console.log(error)
      }
    }
  },
  async created () {
    console.log(this.cateID)
    await this.refreshTable()
  },
  watch: {
    '$route' (to, from) {
      console.log(this.cateID)
    }
  },
  setup () {
    const dataSource = ref()
    const isTableLoading = ref(false)
    const SyncOutlinedSpin = ref(false)
    const editableData = reactive({})

    const edit = record => {
      editableData[record.key] = cloneDeep(dataSource.value.filter(item => record.key === item.key)[0])
    }

    const cancel = record => {
      delete editableData[record.key]
    }

    async function save (record) {
      Object.assign(dataSource.value.filter(item => record.key === item.key)[0], editableData[record.key])
      return editableData[record.key]
    }

    return {
      isTableLoading,
      SyncOutlinedSpin,
      columns,
      dataSource,
      editableData,
      edit,
      save,
      cancel
    }
  }

}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px
}
</style>
