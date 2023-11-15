<template>
  <div>
    <div class="section-title d-flex justify-content-between align-items-center" :class="$theme">
      <h4>詞組類別</h4>
      <PlusBtn class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2" @click="visible=true"/>
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
                              {{ data.cate_name}}
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
  <CategoriesModalView v-model:visible="visible"/>
</template>
<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import PlusBtn from '@/components/button/PlusBtn.vue'
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
import CategoriesModalView from '@/views/category/CategoriesModalView.vue'

export default {
  name: 'CategoriesMenuView',
  components: {
    TreeCategoriesMenu,
    PlusBtn,
    CategoriesModalView
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categories']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('CategoriesStore', ['fetch']),
    async refresh () {
      try {
        this.SyncOutlinedSpin = true
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 100))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.spinning = false
      } catch (error) {}
    },
    async handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      if (this.$route !== 'wordsGrid') {
        this.$router.push({ name: 'wordsGrid' })
      }
    }
  },
  async created () {
    await this.refresh()
  },
  setup () {
    const activeKey = ref(['1'])
    const spinning = ref(false)
    const SyncOutlinedSpin = ref(false)
    const visible = ref(false)

    return {
      activeKey,
      spinning,
      SyncOutlinedSpin,
      visible
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.section-title {
  margin-bottom: 8px ;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #efffb4;
  content: "";
}

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll
}

</style>
