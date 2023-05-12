<template>
  <div>
   <a-table :dataSource="this.dataArray()" :columns="columns" />
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AboutView',
  methods: {
    dataArray () {
      console.log(this.getAll)
      return Object.keys(this.getAll).map(key => ({
        key,
        ...this.getAll[key] // ...是展開物件並為所有key存入新的物件
      }))
    },
    ...mapActions('WordsStore', ['fetch'])
  },
  computed: {
    ...mapGetters('WordsStore', ['getAll'])
  },
  async created () {
    await this.fetch()
  },
  setup () {
    return {
      columns: [
        {
          title: '單字名稱',
          dataIndex: 'ws_name',
          key: 'id'
        },
        {
          title: '中文定義',
          dataIndex: 'ws_definition',
          key: 'id'
        },
        {
          title: '發音 / 假名',
          dataIndex: 'ws_pronunciation',
          key: 'id'
        }
      ]
    }
  }

}
</script>
