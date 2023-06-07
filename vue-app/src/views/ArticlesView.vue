<template>
  <template v-if="Ready">
    <div class="tab-theme" :class="this.$theme">
      <a-tabs v-model:activeKey="activeTab" type="card">
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="所有文章">
          <RefreshBtn class="button-container btn-info" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
          <div class="table-theme" :class="this.$theme">
            <a-table :dataSource="this.articlesArray"
              :columns="columns"
              :scroll="{ y: 600 }"
              :loading="TableLoading[0]"
              :indentSize="12"
            >
            </a-table>
          </div>
        </a-tab-pane>
        <!-- tab 2 -->
        <a-tab-pane key="2" tab="近期">123</a-tab-pane>
        <!-- tab 3 -->
        <a-tab-pane key="3" tab="常用">Content of Tab Pane 3</a-tab-pane>
        <!-- tab 4 -->
        <a-tab-pane key="4" tab="＋添加文章"></a-tab-pane>
      </a-tabs>
    </div>
</template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref } from 'vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'

export default {
  name: 'ArticlesView',
  components: {
    RefreshBtn

  },
  computed: {
    ...mapGetters('ArticlesStore', ['articlesArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch']),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (index === 0) {
          await this.fetch()
        }
        this.SyncOutlinedSpin[index] = false
        this.TableLoading[index] = false
      } catch (error) {}
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
    const TableLoading = ref([false, false, false])
    const SyncOutlinedSpin = ref([false, false, false])
    const activeTab = ref('1')

    const columns = [
      {
        title: '文章標題',
        dataIndex: 'arti_title',
        width: '40%'
      },
      {
        title: '文章內容',
        dataIndex: 'arti_content',
        width: '40%'
      },
      {
        title: '分類',
        dataIndex: 'cate_id',
        width: '20%'
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

.add-button-container {
display: flex;
justify-content: flex-end;
align-items: center;
margin-top: 10px;
}

.add-clear-button {
margin-right: auto;
}

.add-cancel-button {
margin-right: 10px;
}

.add-submit-button {
margin-left: 10px;
}

.button-edit-container {
display: flex;
justify-content: space-between;
align-items: center;
}
.button-edit{
display: flex;
justify-content: center;
color:#6A6AFF;
}
.button-edit-check{
margin-right: 10px;
color:#00DB00;
}
.button-edit-close{
margin-left: auto;
color:#EA0000;
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.hl-title {
  &.dark {
    color: var(--h1-color) !important;
  }

  &.light {
    color: var(--h1-color) !important;
  }
}
</style>
