<template>
  <div>
   <a-table :dataSource="this.wordsArray" :columns="columns"  :scroll="{ y: 400 }">
    <template #expandedRowRender="{ record }">
      <p style="margin: 0">
        <a-typography-paragraph :copyable="{ text: record.ws_name }"></a-typography-paragraph>
      </p>
      <a-divider />
      <p style="margin: 0">
        {{ record.ws_description }}
      </p>
    </template>
  </a-table>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const columns = [
  {
    title: '單字名稱',
    dataIndex: 'ws_name',
    key: 'id',
    fixed: true
  },
  {
    title: '發音 / 假名',
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
  name: 'AboutView',
  methods: {
    ...mapActions('WordsStore', ['fetch'])
  },
  computed: {
    ...mapGetters('WordsStore', ['wordsArray'])
  },
  async created () {
    await this.fetch()
  },
  setup () {
    return {
      columns
    }
  }

}
</script>
