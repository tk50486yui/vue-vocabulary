<template>
    <template v-if="Ready">
      <div class="tab-theme" :class="this.$theme">
        <a-tabs v-model:activeKey="activeTab" type="card">
          <!-- tab 1 -->
          <a-tab-pane key="1" tab="所有">
            123
          </a-tab-pane>
          <!-- tab 2 -->
          <a-tab-pane key="2" tab="新增">
            <a-transfer
                v-model:target-keys="targetKeys"
                :data-source="mockData"
                show-search
                :list-style="{
                width: '250px',
                height: '300px',
                }"
                :operations="['to right']"
                :render="item => `${item.title}-${item.description}`"
                @change="handleChange"
            >
                <template #footer="{ direction }">
                <a-button
                    v-if="direction === 'left'"
                    size="small"
                    style="float: left; margin: 5px"
                    @click="getMock"
                >
                    left reload
                </a-button>
                <a-button
                    v-else-if="direction === 'right'"
                    size="small"
                    style="float: right; margin: 5px"
                    @click="getMock"
                >
                    right reload
                </a-button>
                </template>
                <template #notFoundContent>
                <span>没数据</span>
                </template>
            </a-transfer>

          </a-tab-pane>
        </a-tabs>
      </div>
  </template>
  </template>

<script>
import { mapState } from 'vuex'
import { ref, onMounted } from 'vue'

export default {
  name: 'WordsGroupsView',
  components: {

  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
  },
  async created () {
    try {
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const activeTab = ref('1')

    const mockData = ref([])
    const targetKeys = ref([])
    onMounted(() => {
      getMock()
    })
    const getMock = () => {
      const keys = []
      const mData = []
      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1
        }
        if (data.chosen) {
          keys.push(data.key)
        }
        mData.push(data)
      }
      mockData.value = mData
      targetKeys.value = keys
    }
    const handleChange = (keys, direction, moveKeys) => {
      console.log(keys, direction, moveKeys)
    }
    return {
      Ready,
      activeTab,
      mockData,
      targetKeys,
      handleChange,
      getMock
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import '@/assets/scss/main.scss';

  </style>
