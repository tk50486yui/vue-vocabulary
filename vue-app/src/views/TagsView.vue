<template>
    <template v-if="Ready">
      <a-tabs v-model:activeKey="activeTab" type="card">
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="所有標籤">
          <RefreshBtn class="button-container btn-info" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
          <div class="table-theme" :class="this.$theme">
            <a-table :dataSource="this.tagsArray"
              :columns="columns"
              :scroll="{ y: 600, x: 300 }"
              :maxWidth="200"
              :loading="TableLoading[0]"
              :indentSize="12"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="['ts_name'].includes(column.dataIndex)">
                  <div>
                    <template v-if="column.dataIndex === 'ts_name' && record.children.length > 0">
                    {{ text }} （{{ record.children.length }}）
                    </template>
                    <template v-else>
                    {{ record.ts_name }}
                    <button v-if="record.children.length > 0" type="button" class="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed" aria-label="Expand row"></button>
                    </template>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <!-- tab 2 -->
        <a-tab-pane key="2" tab="近期新增">
          <RefreshBtn class="button-container btn-warning" :spin="SyncOutlinedSpin[1]"  @click="refreshTable(1)"/>
          <div class="table-theme" :class="this.$theme">
            <a-table :dataSource="this.recentTagsArray"
              :columns="columns"
              :scroll="{ y: 600, x: 300 }"
              :maxWidth="200"
              :loading="TableLoading[1]"
            >
            </a-table>
          </div>
        </a-tab-pane>
        <!-- tab 3 -->
        <a-tab-pane key="3" tab="常用">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref } from 'vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'

export default {
  name: 'TagsView',
  components: {
    RefreshBtn
  },
  computed: {
    ...mapGetters('TagsStore', ['tagsArray']),
    ...mapGetters('TagsStore', ['recentTagsArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch']),
    ...mapActions('TagsStore', ['fetchRecent']),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (index === 0) {
          await this.fetch()
        } else if (index === 1) {
          await this.fetchRecent()
        }
        this.SyncOutlinedSpin[index] = false
        this.TableLoading[index] = false
      } catch (error) {}
    }
  },
  async created () {
    try {
      await this.fetch()
      await this.fetchRecent()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref([false, false, false])
    const SyncOutlinedSpin = ref([false, false, false])
    const activeTab = ref('1')

    const columns = [
      {
        dataIndex: 'ts_name'
      }
    ]

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      columns,
      activeTab
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px
}
</style>
