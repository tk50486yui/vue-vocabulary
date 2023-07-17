<template>
    <template v-if="Ready">
      <div class="section-title" :class="this.$theme">
        <h4>單字組別</h4>
      </div>
      <div class="list-theme" :class="this.$theme">
        <a-list
          item-layout="horizontal"
          :data-source="this.$WordsGroupsView.groupArray"
        >
          <template #renderItem="{ item, index  }">
            <a-list-item>
              <template #actions>
                <span class="button-container">
                  <DeleteOutlined class="button-remove" @click="onRemove(item.ws_id, item.ws_name)"/>
                </span>
              </template>
              <a-list-item-meta>
                <template #description>
                  {{ index+1 }}.  {{ item.ws_name }}
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
          <template #footer>
              <span class="span-text">
                共 {{ this.$WordsGroupsView.groupArray.length }} 筆 單字
              </span>
            </template>
        </a-list>
      </div>
      <template v-if="this.$WordsGroupsView.groupArray.length > 0">
        <a-button type="primary" size="small" shape="round"  @click="onSaveCheckbox()">儲存</a-button>
        <span style="padding-left: 6px;">
          <a-popconfirm title="確定要清空嗎？" ok-text="是" cancel-text="否" @confirm="clearCheckbox()">
            <a-button type="primary" size="small" shape="round" danger>清空</a-button>
          </a-popconfirm>
        </span>
      </template>

    </template>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ref } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'

export default {
  name: 'WordsGroupsView',
  components: {
    DeleteOutlined
  },
  computed: {
    ...mapState('Views', ['$WordsGroupsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('Views', ['updateWordsGroupsView']),
    onSaveCheckbox () {
      console.log(this.$WordsGroupsView.groupArray)
    },
    clearCheckbox () {
      this.updateWordsGroupsView({ variable: 'groupArray', data: { clear: true } })
    },
    onRemove (id, wsName) {
      this.updateWordsGroupsView({ variable: 'groupArray', data: { ws_id: id, ws_name: wsName, checked: false } })
    }
  },
  async created () {
    try {
      this.Ready = true
    } catch (error) {}
  },
  activated () {

  },
  setup () {
    const Ready = ref(false)

    return {
      Ready
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
  background: #4acaed;
  content: "";
}
.button-container {
  display: flex;
  align-items: center;
}
.button-remove{
  color:#EA0000;
  margin-bottom: auto;
}

</style>
