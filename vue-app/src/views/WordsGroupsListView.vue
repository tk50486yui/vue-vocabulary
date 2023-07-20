<template>
    <template v-if="Ready">
        <a-back-top />
        <!-- 上層 -->
        <div class="select-theme" :class="this.$theme">
            每頁顯示：
            <a-select
                ref="select"
                v-model:value="selectPageSize"
                size="small"
                style="width: 80px"
                @change="handlePageSize()"
                >
                <a-select-option value="5">5 筆</a-select-option>
                <a-select-option value="10">10 筆</a-select-option>
                <a-select-option value="20">20 筆</a-select-option>
                <a-select-option value="50">50 筆</a-select-option>
                <a-select-option value="100">100 筆</a-select-option>
                <a-select-option :value="this.wordsGroups.length">全部</a-select-option>
            </a-select>
            <span style="padding-left: 6px;">當前：</span>
                <a-select
                    ref="selectCurrent"
                    v-model:value="currentPage"
                    size="small"
                    style="width: 80px"
                    @change="handleCurrentPage()"
                    >
                    <template v-for="index in Math.ceil(this.wordsGroups.length/this.selectPageSize)" :key="index">
                        <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                    </template>
                </a-select>
            <span style="padding-left: 6px;">
            共  {{ this.wordsGroups.length }} 筆
            </span>
        </div>
        <p></p>
        <div class="list-theme" :class="this.$theme">
            <a-list
                item-layout="horizontal"
                :data-source="this.wordsGroups"
                :pagination="pagination"
            >
                <template #renderItem="{ item, index }">
                    <a-list-item>
                    <a-list-item-meta>
                        <template #description>
                            <span class="list-link">
                                {{ index+1 }}.
                                <router-link :to="{ name: 'wordsGroupsDetails', params: { id: item.id } }">
                                    {{ item.wg_name}}
                                </router-link>
                                 ( {{  item.details.length }} )
                            </span>
                        </template>
                    </a-list-item-meta>
                    </a-list-item>
                </template>
                <template #footer>
                <span class="span-text">
                    共 {{ this.wordsGroups.length }} 筆 單字
                </span>
                </template>
            </a-list>
        </div>
    </template>
</template>

<script>
import { ref, reactive } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'WordsGroupsListView',
  computed: {
    ...mapGetters('WordsGroupsStore', ['wordsGroups']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsGroupsStore', ['fetch']),
    handlePageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    handleCurrentPage () {
      this.pagination.current = Number(this.currentPage)
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
    const selectPageSize = ref('20')
    const currentPage = ref(1)
    const pagination = reactive({
      onChange: page => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'top'
    })

    return {
      Ready,
      pagination,
      selectPageSize,
      currentPage
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
