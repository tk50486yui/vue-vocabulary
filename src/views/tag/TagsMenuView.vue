<template>
  <div>
    <div class="section-title d-flex justify-content-between align-items-center" :class="$theme">
      <h4>標籤選單</h4>
      <PlusBtn class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2" @click="visible = true" />
    </div>
    <div class="collapse-theme" :class="$theme">
      <!--  重整區塊  -->
      <a-spin :spinning="spinning">
        <!--  主摺疊  -->
        <a-collapse v-model:activeKey="activeKey">
          <!--  子摺疊區塊  -->
          <a-collapse-panel key="1">
            <div class="menu-scroll">
              <!--  最頂層 -->
              <a-menu mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" multiple>
                <!--  第一層  for 顯示  -->
                <template v-for="data in tags" :key="data.id">
                  <template v-if="data.children && data.children.length">
                    <a-sub-menu :key="data.id">
                      <template #title>
                        <a @click="handleTagsFilter(data.id)" style="display: inline-block">
                          <span class="dropdown-container">
                            {{ data.ts_name }}（{{ data.children.length }}）
                            <template v-if="$filtersTags.includes(data.id)">
                              <CheckOutlined :style="{ 'font-size': '10px' }" :rotate="10" />
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
                          <template v-if="$filtersTags.includes(data.id)">
                            <CheckOutlined :style="{ 'font-size': '10px' }" :rotate="10" />
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
  <p></p>
  <!-- Modal  -->
  <TagsModalView v-model:open="visible" />
</template>

<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { PlusBtn } from '@/components/button'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
import TagsModalView from '@/views/tag/TagsModalView.vue'

export default {
  name: 'TagsMenuView',
  components: {
    PlusBtn,
    TreeTagsMenu,
    TagsModalView
  },
  computed: {
    ...mapGetters('TagsStore', ['tags', 'recentTagsArray']),
    ...mapState('Search', ['$filtersTags', '$filtersTagsState']),
    ...mapState('Theme', ['$theme']),
    hasChildrenArray() {
      return this.recentTagsArray.filter((tag) => tag.children.length > 0)
    },
    noChildrenArray() {
      return this.$filtersTags.filter(
        (tagId) => !this.hasChildrenArray.some((tag) => tag.id === tagId)
      )
    }
  },
  methods: {
    ...mapActions('TagsStore', ['fetch', 'fetchRecent']),
    ...mapActions('Search', ['updateSearchClass', 'pushFiltersTags']),
    async handleTagsFilter(id) {
      await this.pushFiltersTags(id)
      this.updateSearchClass('word')
      if (this.$route !== 'wordsGrid') {
        this.$router.push({ name: 'wordsGrid' })
      }
    }
  },
  async created() {
    try {
      this.spinning = true
      await this.fetch()
      await this.fetchRecent()
      this.spinning = false
      this.selectedKeys = this.noChildrenArray
    } catch (error) { }
  },
  watch: {
    '$filtersTags.length'(val) {
      if (!this.$filtersTagsState) {
        this.selectedKeys = this.noChildrenArray
      }
    }
  },
  setup() {
    const activeKey = ref(['1'])
    const spinning = ref(false)
    const selectedKeys = ref([])
    const openKeys = ref()
    const selectedCurrent = ref(false)
    const selectedCount = ref(0)
    const visible = ref(false)
    return {
      activeKey,
      spinning,
      selectedKeys,
      openKeys,
      selectedCurrent,
      selectedCount,
      visible
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.dropdown-container {
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
  content: '';
}

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll;
}
</style>
