<template>
  <div>
    <div class="section-title d-flex justify-content-between align-items-center" :class="$theme">
      <h4>詞組類別</h4>
      <PlusBtn
        class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2"
        @click="visible = true"
      />
    </div>
    <span class="radio-theme d-flex align-items-center" :class="$theme" style="margin-bottom: 8px">
      <el-tag effect="dark" type="danger" size="small" :color="labelColor" round>
        <a-checkbox v-model:checked="$isAutoMove"></a-checkbox>
        自動跳轉
      </el-tag>
      <span style="margin-left: 8px">
        <a-radio-group v-model:value="$autoMove" @change="onMove">
          <a-radio value="words">單字</a-radio>
          <a-radio value="articles">文章</a-radio>
        </a-radio-group>
      </span>
    </span>
    <div class="collapse-theme" :class="$theme">
      <!--  重整區塊  -->
      <span class="spinning-style">
        <a-spin :spinning="spinning">
          <!--  主摺疊  -->
          <a-collapse v-model:activeKey="activeKey">
            <!--  子摺疊區塊  -->
            <a-collapse-panel key="1">
              <div class="menu-scroll">
                <span class="d-flex align-items-center" :class="$theme">
                  <el-tag effect="dark" type="warning" size="small" round>
                    <template
                      v-if="
                        $filters.includes('cate_name') && $filters.length === 1 && $keyword !== ''
                      "
                    >
                      已選擇類別：{{ $keyword }}
                    </template>
                    <template v-else> 尚無選擇 </template>
                  </el-tag>
                  <template
                    v-if="
                      $filters.includes('cate_name') && $filters.length === 1 && $keyword !== ''
                    "
                  >
                    <span style="margin-left: 4px">
                      <CloseBtn class="d-flex align-items-center" @click="onClearCateName" />
                    </span>
                  </template>
                </span>
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
      </span>
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
const { $filters, $keyword, $isAutoMove, $autoMove } = toRefs(store.state.Search)

const $route = useRoute()
const $router = useRouter()

const categories = computed(() => store.getters['CategoriesStore/categories'])

const activeKey = ref<string[]>(['1'])
const spinning = ref<boolean>(false)
const SyncOutlinedSpin = ref<boolean>(false)
const visible = ref<boolean>(false)
const labelColor = ref<string>('rgb(48, 37, 2)')

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
  onMove()
}

const onClearCateName = (): void => {
  store.dispatch('Search/updateSearchClass', 'word')
  store.dispatch('Search/updateFilters', ['words'])
  store.dispatch('Search/updateKeyword', '')
}

const onMove = (): void => {
  if ($isAutoMove.value) {
    const routeName = String($route.name)
    if ($autoMove.value === 'words' && routeName !== 'wordsGrid') {
      store.dispatch('Search/updateSearchClass', 'word')
      $router.push({ name: 'wordsGrid' })
    } else if ($autoMove.value === 'articles' && routeName !== 'articles') {
      store.dispatch('Search/updateSearchClass', 'article')
      $router.push({ name: 'articles' })
    }
  }
}

onMounted(() => {
  refresh()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.spinning-style :deep(.ant-spin-dot-item) {
  background: #{$categories-main-color};
}
.section-title {
  margin-bottom: 8px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #{$categories-main-color};
  content: '';
}

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll;
}
</style>
