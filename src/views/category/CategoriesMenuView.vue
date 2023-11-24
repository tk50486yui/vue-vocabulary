<template>
  <div>
    <div class="section-title d-flex justify-content-between align-items-center" :class="$theme">
      <h4>詞組類別</h4>
      <PlusBtn
        class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2"
        @click="visible = true"
      />
    </div>
    <div class="collapse-theme" :class="$theme">
      <!--  重整區塊  -->
      <a-spin :spinning="spinning">
        <!--  主摺疊  -->
        <a-collapse v-model:activeKey="activeKey">
          <!--  子摺疊區塊  -->
          <a-collapse-panel key="1">
            <div class="menu-scroll">
              <!--  類別最頂層 -->
              <a-menu mode="inline">
                <!--  第一層  for 顯示  -->
                <template v-for="data in categories" :key="data.id">
                  <template v-if="data.children && data.children.length">
                    <a-sub-menu :key="data.id">
                      <template #title>
                        <a @click="handleCategoryFilter(data.cate_name)">
                          {{ data.cate_name }}（{{ data.children.length }}）
                        </a>
                      </template>
                      <TreeCategoriesMenu :data="data" />
                    </a-sub-menu>
                  </template>
                  <template v-else>
                    <a-menu-item :key="data.id">
                      <a @click="handleCategoryFilter(data.cate_name)">
                        {{ data.cate_name }}
                      </a>
                    </a-menu-item>
                  </template>
                </template>
                <!--  第一層  for 結束  -->
              </a-menu>
              <!-- 類別最頂層  end  -->
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-spin>
    </div>
  </div>
  <p></p>
  <!-- Modal  -->
  <CategoriesModalView v-model:open="visible" />
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { PlusBtn } from '@/components/button'
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
import CategoriesModalView from '@/views/category/CategoriesModalView.vue'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const $route = useRoute()
const $router = useRouter()

const categories = computed(() => store.getters['CategoriesStore/categories'])

const activeKey = ref<string[]>(['1'])
const spinning = ref<boolean>(false)
const SyncOutlinedSpin = ref<boolean>(false)
const visible = ref<boolean>(false)

const refresh = async (): Promise<void> => {
  try {
    SyncOutlinedSpin.value = true
    spinning.value = true
    await new Promise((resolve) => setTimeout(resolve, 100))
    await store.dispatch('CategoriesStore/fetch')
    SyncOutlinedSpin.value = false
    spinning.value = false
  } catch (error) {
    //
  }
}

const handleCategoryFilter = (cateName: string): void => {
  store.dispatch('Search/updateSearchClass', 'word')
  store.dispatch('Search/updateFilters', ['cate_name'])
  store.dispatch('Search/updateKeyword', cateName)
  if (String($route.name) !== 'wordsGrid') {
    $router.push({ name: 'wordsGrid' })
  }
}

onMounted(() => {
  refresh()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.section-title {
  margin-bottom: 8px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #efffb4;
  content: '';
}

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll;
}
</style>
