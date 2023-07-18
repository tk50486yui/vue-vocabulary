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
                共 {{ this.wordsCount }} 筆 單字
              </span>
            </template>
        </a-list>
      </div>
      <template v-if="this.wordsCount > 0">
        <div class="input-theme" :class="this.$theme" style="padding-bottom: 12px;">
          <a-input
            v-model:value="formState.wordsGroup.wg_name"
            placeholder="組別名稱"
            allow-clear
            />
        </div>
        <a-button type="primary" size="small" shape="round"  @click="onSave()" :disabled="saveDisabled">儲存</a-button>
        <span style="padding-left: 6px;">
          <a-popconfirm title="確定要清空嗎？" ok-text="是" cancel-text="否" @confirm="clearCheckbox()">
            <a-button type="primary" size="small" shape="round" danger>清空</a-button>
          </a-popconfirm>
        </span>
      </template>

    </template>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'

export default {
  name: 'WordsGroupsView',
  components: {
    DeleteOutlined
  },
  computed: {
    ...mapState('Views', ['$WordsGroupsView']),
    ...mapState('Theme', ['$theme']),
    wordsCount () {
      return this.$WordsGroupsView.groupArray.length
    }
  },
  methods: {
    ...mapActions('WordsGroupsStore', {
      addWordsGroup: 'add'
    }),
    ...mapActions('Views', ['updateWordsGroupsView']),
    async onSave () {
      try {
        const wordsIdArray = this.$WordsGroupsView.groupArray.map(item => item.ws_id)
        this.formState.wordsGroup.words_groups_details = wordsIdArray
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addWordsGroup(this.formState.wordsGroup)
        this.clearCheckbox()
      } catch (error) {}
    },
    clearCheckbox () {
      this.updateWordsGroupsView({ variable: 'groupArray', data: { clear: true } })
      this.formState.wordsGroup.wg_name = ''
      this.saveDisabled = false
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
  watch: {
    'formState.wordsGroup.wg_name' (val) {
      if (val == null || val === '' || this.wordsCount === 0) {
        this.saveDisabled = true
      } else {
        this.saveDisabled = false
      }
    }
  },
  setup () {
    const Ready = ref(false)
    const saveDisabled = ref(true)
    const formRef = ref()
    const formState = reactive({
      wordsGroup: {}
    })
    const { wordsGroupForm } = mapGetters('WordsGroupStore', ['wordsGroupForm'])

    onMounted(() => {
      formState.wordsGroup = { ...wordsGroupForm }
      formState.wordsGroup.words_groups_details = []
    })

    return {
      Ready,
      saveDisabled,
      formRef,
      formState
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
