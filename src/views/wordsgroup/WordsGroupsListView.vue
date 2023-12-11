<template>
  <div v-if="!Ready" class="ready-spinning">
    <a-spin :spinning="ReadySpinning" size="large" />
  </div>
  <template v-if="Ready">
    <div class="section-title">
      <h4>單字群組列表</h4>
    </div>
    <!-- 上層 -->
    <div class="select-theme" :class="$theme" ref="selectMod">
      <a-space size="small" wrap>
        <span>
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
        </span>
        <span
          >當前：
          <a-select
            v-model:value="currentPage"
            :getPopupContainer="() => $refs.selectMod"
            size="small"
            style="width: 85px"
            @change="handleCurrentPage()"
          >
            <template v-for="index in wordsGroupsCount" :key="index">
              <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
            </template>
          </a-select>
        </span>
        <span> 共 {{ wordsGroups.length }} 筆 </span>
      </a-space>
    </div>
    <p></p>
    <div class="list-theme" :class="$theme">
      <a-list item-layout="horizontal" :data-source="wordsGroups" :pagination="pagination">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <span class="list-link">
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
      </a-list>
    </div>
    <a-back-top />
  </template>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const wordsGroups = computed(() => store.getters['WordsGroupsStore/wordsGroups'])
const wordsGroupsCount = computed(
  () => Math.ceil(wordsGroups.value.length / Number(selectPageSize)) || 1
)

const Ready = ref<boolean>(false)
const ReadySpinning = ref<boolean>(false)
const selectPageSize = ref<string>('20')
const currentPage = ref<number>(1)
const pagination = reactive({
  onChange: (page: number): void => {
    currentPage.value = page
    pagination.current = currentPage.value
  },
  pageSize: Number(selectPageSize.value),
  position: 'top',
  current: currentPage.value
})

const handlePageSize = (): void => {
  pagination.pageSize = Number(selectPageSize.value)
  pagination.current = 1
  currentPage.value = pagination.current
}

const handleCurrentPage = (): void => {
  pagination.current = Number(currentPage.value)
}

onMounted(async () => {
  try {
    ReadySpinning.value = true
    await store.dispatch('WordsGroupsStore/fetch')
    Ready.value = true
    ReadySpinning.value = false
  } catch (error) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.ready-spinning {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.ready-spinning :deep(.ant-spin-dot-item) {
  background: #{$wordsgroups-main-color};
}

.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #{$wordsgroups-main-color};
  content: '';
}

a {
  text-decoration: none;
}
</style>
