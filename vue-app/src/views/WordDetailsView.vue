<template>
  <template v-if="Ready">
      <div class="descriptions-theme" :class="this.$theme">
          <h4><router-link :to="{ name: 'wordsGrid' }"> Back </router-link>
            {{ wordById(wordId).ws_name }}
          </h4>
          <p></p>
          <a-descriptions
              bordered
              :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
              :layout="descriptionsLayout"
          >
            <a-descriptions-item label="單字名稱">
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  {{ wordById(wordId).ws_name }}
                </span>
                <span class="copy-icon">
                  <a-typography-paragraph :copyable="{ text: wordById(wordId).ws_name }"></a-typography-paragraph>
                </span>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="假名/發音">{{ wordById(wordId).ws_pronunciation }}</a-descriptions-item>
            <a-descriptions-item label="中文定義">{{ wordById(wordId).ws_definition }}</a-descriptions-item>
            <a-descriptions-item label="主題分類">{{ wordById(wordId).cate_name }}</a-descriptions-item>
            <a-descriptions-item label="簡易註解">{{ wordById(wordId).ws_slogan }}</a-descriptions-item>
            <a-descriptions-item label="詳細說明">{{ wordById(wordId).ws_description }}</a-descriptions-item>
            <a-descriptions-item label="標籤">
            tag 1
            <br />
            tag 2
            </a-descriptions-item>
          </a-descriptions>
      </div>
  </template>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'WordDetailsView',
  components: {

  },
  computed: {
    ...mapGetters('WordsStore', ['wordById']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile']),
    ...mapState('Screen', ['$tablet']),
    wordId () {
      return this.$route.params.id
    }
  },
  watch: {
    $mobile: function (val) {
      this.changeDescriptionsLayout(val)
    },
    $tablet: function (val) {
      this.changeDescriptionsLayout(val)
    }
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    changeDescriptionsLayout (isScreenSmall) {
      if (isScreenSmall) {
        this.descriptionsLayout = 'vertical'
      } else {
        this.descriptionsLayout = 'horizontal'
      }
    }
  },
  async created () {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const descriptionsLayout = ref('horizontal')
    return {
      Ready,
      descriptionsLayout
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.keyword-text{
    color:$keyword-color;
}
.copy-icon{
  padding-top: 5px;
}
.descriptions-theme{
  :deep(.ant-descriptions-item-content){
    width:80%;
  }
  :deep(.ant-descriptions-bordered .ant-descriptions-item-label){
    width:20%;
  }
}

</style>
