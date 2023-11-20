<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>單字群組列表</h4>
    </div>
    <!-- 上層 -->
    <div class="select-theme" :class="$theme" ref="selectMod">
      每頁：
      <a-select
        v-model:value="selectPageSize"
        :getPopupContainer="() => $refs.selectMod"
        size="small"
        style="width: 80px"
        @change="handlePageSize()"
      >
        <a-select-option value="5">5 筆</a-select-option>
        <a-select-option value="10">10 筆</a-select-option>
        <a-select-option value="20">20 筆</a-select-option>
        <a-select-option value="50">50 筆</a-select-option>
        <a-select-option value="100">100 筆</a-select-option>
        <a-select-option :value="wordsGroups.length">全部</a-select-option>
      </a-select>
      <span style="padding-left: 6px">當前：</span>
      <a-select
        v-model:value="currentPage"
        :getPopupContainer="() => $refs.selectMod"
        size="small"
        style="width: 80px"
        @change="handleCurrentPage()"
      >
        <template
          v-for="index in Math.ceil(
            wordsGroups.length / Number(selectPageSize)
          )"
          :key="index"
        >
          <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
        </template>
      </a-select>
      <span style="padding-left: 6px"> 共 {{ wordsGroups.length }} 筆 </span>
    </div>
    <p></p>
    <div class="list-theme" :class="$theme">
      <a-list
        item-layout="horizontal"
        :data-source="wordsGroups"
        :pagination="pagination"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <span class="list-link">
                  {{ index + 1 }}.
                  <router-link
                    :to="{
                      name: 'wordsGroupsDetails',
                      params: { id: item.id }
                    }"
                  >
                    {{ item.wg_name }}
                  </router-link>
                  ( {{ item.details.length }} )
                </span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
        <template #footer>
          <span class="span-text"> 共 {{ wordsGroups.length }} 筆 </span>
        </template>
      </a-list>
    </div>
  </template>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'WordsGroupsListView',
  computed: {
    ...mapGetters('WordsGroupsStore', ['wordsGroups']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsGroupsStore', ['fetch']),
    handlePageSize(): void {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    handleCurrentPage(): void {
      this.pagination.current = Number(this.currentPage)
    }
  },
  async created() {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {
      //
    }
  },
  setup() {
    const Ready = ref(false)
    const selectPageSize = ref('20')
    const currentPage = ref(1)
    const pagination = reactive({
      onChange: (page: number): void => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'top',
      current: currentPage.value
    })

    return {
      Ready,
      pagination,
      selectPageSize,
      currentPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #17b0f7;
  content: '';
}
</style>
