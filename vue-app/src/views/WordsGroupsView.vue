<template>
    <template v-if="Ready">
      <div class="main-body" :class="this.$theme"></div>
      <h4>
       單字組別
      </h4>
      <h6>
        <template v-if="this.$WordsGroupsView.groupArray.length > 0">
          <template v-for="(item, index) in this.$WordsGroupsView.groupArray" :key="index">
           {{ index+1 }}.  {{ item.ws_name }} - {{ item.ws_id }}
           <br>
          </template>
          <br>
          共 {{ this.$WordsGroupsView.groupArray.length }} 筆 單字
          <p></p>
          <a-button type="primary" size="small" shape="round" @click="clearCheckbox()" danger>清空</a-button>
        </template>
        <template v-else>
          尚無資料
        </template>
      </h6>
    </template>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'WordsGroupsView',
  components: {

  },
  computed: {
    ...mapState('Views', ['$WordsGroupsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('Views', ['updateWordsGroupsView']),
    clearCheckbox () {
      this.updateWordsGroupsView({ variable: 'groupArray', data: { clear: true } })
    }
  },
  async created () {
    try {
      this.Ready = true
    } catch (error) {}
  },
  activated () {

  },
  setup () {
    const Ready = ref(false)

    return {
      Ready
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import '@/assets/scss/main.scss';

  </style>
