<template>
  <div class="about">
    <h5>This is aa test page</h5>
    <div id="QQ" @click="this.submit()">click</div>
   <a-table :dataSource="this.dataArray()" :columns="columns" />
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AboutView',
  methods: {
    dataArray () {
      console.log(this.getWords)
      return Object.keys(this.getWords).map(key => ({
        key,
        ...this.getWords[key] // ...是展開物件並為所有key存入新的物件
      }))
    },
    submit () {
      console.log(JSON.stringify(this.dataArray()))
    },
    ...mapActions('WordsStore', ['fetchWords'])
  },
  computed: {
    ...mapGetters('WordsStore', ['getWords'])
  },
  async created () {
    await this.fetchWords()
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
