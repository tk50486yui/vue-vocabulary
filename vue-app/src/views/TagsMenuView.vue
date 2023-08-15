<template>
    <div>
      <div class="section-title" :class="this.$theme">
        <h4>標籤總覽</h4>
      </div>
      <div class="collapse-theme" :class="this.$theme">
        <!--  重整區塊  -->
        <a-spin :spinning="spinning">
          <!--  主摺疊  -->
          <a-collapse v-model:activeKey="activeKey">
            <!--  子摺疊區塊  -->
            <a-collapse-panel key="1">
                <div class="menu-scroll">
                    <!--  類別最頂層 -->
                    <a-menu mode="inline" multiple>
                        <!--  第一層  for 顯示  -->
                        <template v-for="data in tags" :key="data.id">
                            <template v-if="data.children && data.children.length">
                                <a-sub-menu :key="data.id" :title="data.ts_name">
                                    <TreeTagsMenu :data="data" />
                                </a-sub-menu>
                            </template>
                            <template v-else>
                                <a-menu-item :key="data.id"># {{ data.ts_name }}</a-menu-item>
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
</template>

<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'

export default {
  name: 'TagsMenuView',
  components: {
    TreeTagsMenu
  },
  computed: {
    ...mapGetters('TagsStore', ['tags']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch']),
    async refresh () {
      try {
        // this.SyncOutlinedSpin = true
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.fetch()
        // this.SyncOutlinedSpin = false
        this.spinning = false
      } catch (error) {
        // this.SyncOutlinedSpin = false
        this.spinning = false
      }
    }
  },
  async created () {
    try {
      await this.refresh()
    } catch (error) {}
  },
  setup () {
    const activeKey = ref(['1'])
    const spinning = ref(false)

    return {
      activeKey,
      spinning
    }
  }
}
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
  background: #f6aaf1;
  content: "";
}

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll
}

</style>
