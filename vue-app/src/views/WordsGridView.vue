<template>
    <template v-if="Ready">

        <div class="select-theme" :class="this.$theme">
            每頁顯示：
            <a-select
                ref="select"
                v-model:value="selectPageSize"
                style="width: 80px"
                @change="handlePageSize()"
                >
                <a-select-option value="10">10</a-select-option>
                <a-select-option value="20">20</a-select-option>
                <a-select-option value="50">50</a-select-option>
                <a-select-option value="100">100</a-select-option>
            </a-select>
            <span style="padding-left: 20px;">
                <template v-if="this.$keyword != ''">
                    <span style="padding-right: 10px;">
                    " {{ this.$keyword }} "
                    </span>
                </template>
             共  {{ this.filterWords(this.$keyword).length }}  筆
            </span>
        </div>
        <p></p>
        <div class="list-card-theme" :class="this.$theme">
            <a-list :data-source="this.filterWords(this.$keyword)" :pagination="pagination"
                :grid="{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4, xxxl: 4 }"
            >
                <template #renderItem="{ item }">
                <a-list-item>
                    <a-card>
                        <template #title>
                            <template v-if="item.cate_name == null || item.cate_name == ''">
                                無分類
                            </template>
                            <template v-else>
                                {{ item.cate_name }} {{ item.cate_id }}
                            </template>
                        </template>
                        <template v-if="this.$keyword != ''">
                            <span class="keyword-text">
                                <a>{{ item.ws_name }}</a>
                            </span>
                        </template>
                        <template v-else>
                            <a>{{ item.ws_name }}</a>
                        </template>
                        <p></p>
                        {{ item.ws_pronunciation }}
                        <p></p>
                        {{ item.ws_definition }}
                    </a-card>
                </a-list-item>
                </template>
            </a-list>
        </div>
    </template>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref, reactive } from 'vue'

export default {
  name: 'WordsGridView',
  components: {

  },
  computed: {
    ...mapGetters('WordsStore', ['words']),
    ...mapGetters('WordsStore', ['filterWords']),
    ...mapState('Search', ['$keyword']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    handlePageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
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

    const selectPageSize = ref(20)
    const dataSize = ref(0)
    const pagination = reactive({
      pageSize: selectPageSize.value
    })

    return {
      Ready,
      pagination,
      selectPageSize,
      dataSize
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.keyword-text{
    color:$keyword-color;
}
</style>
