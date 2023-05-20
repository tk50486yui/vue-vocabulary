<template>
  <div>
    <button type="button" class="btn btn-primary btn-outline-light btn-sm float-end me-md-3 button-container"
      @click="handleTableLoading">
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
    </a-table>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ref } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    title: '類別',
    dataIndex: 'cate_name',
    key: 'cate_id',
    fixed: true
  },
  {
    title: '單字名稱',
    dataIndex: 'ws_name',
    key: 'id',
    fixed: true
  },
  {
    title: '假名 / 外來語',
    dataIndex: 'ws_pronunciation',
    key: 'id'
  },
  {
    title: '中文定義',
    dataIndex: 'ws_definition',
    key: 'id'
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
    async handleTableLoading () {
      try {
        this.SyncOutlinedSpin = true
        this.isTableLoading = true
        await new Promise(resolve => setTimeout(resolve, 1500))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.isTableLoading = false
      } catch (error) {}
    }
  },
  async created () {
    console.log(this.cateID)
    await this.fetch()
  },
  watch: {
    '$route' (to, from) {
      console.log(this.cateID)
    },
    '$route.name': {
      handler (newVal, oldVal) {
        console.log(`路由名 ${oldVal} => ${newVal}`)
        if (newVal === 'wordsByCateID') {
          console.log('wordsByCateID')
        } else if (newVal === 'otherRouteName') {
          console.log('wordsB')
        }
      },
      immediate: true // 在組件創建時立即執行一次
    }
  },
  setup () {
    const isTableLoading = ref(false)
    const SyncOutlinedSpin = ref(false)
    return {
      isTableLoading,
      SyncOutlinedSpin,
      columns
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
