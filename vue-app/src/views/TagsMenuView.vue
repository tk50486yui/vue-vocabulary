<template>
  <div>
    <div class="section-title" :class="this.$theme">
      <h4>標籤選單</h4>
    </div>
    <div class="collapse-theme" :class="this.$theme">
      <!--  重整區塊  -->
      <a-spin :spinning="spinning">
        <!--  主摺疊  -->
        <a-collapse v-model:activeKey="activeKey">
          <!--  子摺疊區塊  -->
          <a-collapse-panel key="1">
            <div class="menu-scroll">
              <!--  最頂層 -->
              <a-menu mode="inline"
                v-model:selectedKeys="selectedKeys"
                v-model:openKeys="openKeys"
                @select="onSelect()"
                multiple>
                <!--  第一層  for 顯示  -->
                <template v-for="data in tags" :key="data.id">
                  <template v-if="data.children && data.children.length">
                    <a-sub-menu :key="data.id">
                      <template #title>
                        <a @click="handleTagsFilter(data.id)" style="display: inline-block">
                          <span class="dropdown-container">
                            {{ data.ts_name }}
                            <template v-if="this.$filtersTags.includes(data.id)">
                              <CheckOutlined :style="{ 'font-size':'10px'}" :rotate="10"/>
                            </template>
                          </span>
                        </a>
                      </template>
                      <TreeTagsMenu :data="data" />
                    </a-sub-menu>
                  </template>
                  <template v-else>
                    <a-menu-item :key="data.id">
                      <a @click="handleTagsFilter(data.id)" style="display: inline-block">
                        <span class="dropdown-container">
                          # {{ data.ts_name }}
                          <template v-if="this.$filtersTags.includes(data.id)">
                             <CheckOutlined :style="{ 'font-size':'10px'}" :rotate="10"/>
                          </template>
                        </span>
                      </a>
                    </a-menu-item>
                  </template>
                </template>
                <!--  第一層  for 結束  -->
              </a-menu>
              <!--  最頂層 結束  -->
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
import { CheckOutlined } from '@ant-design/icons-vue'

export default {
  name: 'TagsMenuView',
  components: {
    TreeTagsMenu,
    CheckOutlined
  },
  computed: {
    ...mapGetters('TagsStore', ['tags']),
    ...mapGetters('TagsStore', ['recentTagsArray']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Search', ['$filtersTags']),
    ...mapState('Search', ['$filtersTagsState'])
  },
  methods: {
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Search', ['pushFiltersTags']),
    ...mapActions('TagsStore', ['fetch']),
    ...mapActions('TagsStore', ['fetchRecent']),
    onSelect () {

    },
    async handleTagsFilter (id) {
      await this.pushFiltersTags(id)
      this.updateSearchClass('word')
      if (this.$route !== 'wordsGrid') {
        this.$router.push({ name: 'wordsGrid' })
      }
    },
    async refresh () {
      try {
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.fetch()
        this.spinning = false
      } catch (error) {}
    }
  },
  async created () {
    try {
      await this.refresh()
      await this.fetchRecent()
    } catch (error) {}
  },
  watch: {
    '$filtersTags.length' (val) {
      if (!this.$filtersTagsState) {
        // this.selectedKeys = this.selectedKeys.filter(key => this.$filtersTags.includes(key))
        this.hasChildrenArray = this.recentTagsArray.filter(tag => tag.children.length > 0)
        this.noChildrenArray = this.$filtersTags.filter(tagId => !this.hasChildrenArray.some(tag => tag.id === tagId))
        this.selectedKeys = this.noChildrenArray
      }
    }
  },
  setup () {
    const activeKey = ref(['1'])
    const spinning = ref(false)
    const selectedKeys = ref([])
    const openKeys = ref()
    const hasChildrenArray = ref([])
    const noChildrenArray = ref([])
    const selectedCurrent = ref(false)
    const selectedCount = ref(0)
    return {
      activeKey,
      spinning,
      selectedKeys,
      openKeys,
      hasChildrenArray,
      noChildrenArray,
      selectedCurrent,
      selectedCount
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.dropdown-container{
  display: flex;
  align-items: center;
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
  background: #f6aaf1;
  content: "";
}

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll
}

</style>
