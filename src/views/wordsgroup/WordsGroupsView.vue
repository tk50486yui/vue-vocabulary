<template>
  <template v-if="Ready">
    <div class="section-title" :class="$theme">
      <h4>單字組別</h4>
    </div>
    <div class="list-theme" :class="$theme">
      <!-- list -->
      <a-list
        item-layout="horizontal"
        :data-source="this.$WordsGroupsView.groupArray"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <template #actions>
              <span class="button-container">
                <DeleteOutlined
                  class="button-remove"
                  @click="onRemove(item.ws_id, item.ws_name)"
                />
              </span>
            </template>
            <a-list-item-meta>
              <template #description>
                {{ index + 1 }}. {{ item.ws_name }}
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
        <template #footer>
          <span class="span-text"> 共 {{ this.wordsCount }} 筆 單字 </span>
        </template>
      </a-list>
    </div>
    <!-- save button -->
    <template v-if="this.wordsCount > 0 && updateNow === false">
      <div class="input-theme" :class="$theme" style="padding-bottom: 12px">
        <a-input
          v-model:value="formState.wordsGroup.wg_name"
          placeholder="組別名稱"
          allow-clear
        />
      </div>
      <a-button
        type="primary"
        size="small"
        shape="round"
        @click="onSave()"
        :disabled="saveDisabled"
        >儲存</a-button
      >
      <span style="padding-left: 6px">
        <a-popconfirm
          title="確定要清空嗎？"
          ok-text="是"
          cancel-text="否"
          @confirm="clearCheckbox()"
        >
          <a-button type="primary" size="small" shape="round" danger
            >清空</a-button
          >
        </a-popconfirm>
      </span>
    </template>
    <template v-else-if="updateNow">
      <div
        class="input-theme"
        :class="this.$theme"
        style="padding-bottom: 12px"
      >
        <a-input
          v-model:value="formState.wordsGroup.wg_name"
          placeholder="組別名稱"
          allow-clear
        />
      </div>
      <a-button
        type="primary"
        size="small"
        shape="round"
        @click="onEditSave()"
        :disabled="saveDisabled"
        >儲存編輯</a-button
      >
      <span style="padding-left: 6px">
        <a-popconfirm
          title="確定要取消編輯嗎？"
          ok-text="是"
          cancel-text="否"
          @confirm="clearCheckbox()"
        >
          <a-button type="primary" size="small" shape="round" danger
            >取消編輯</a-button
          >
        </a-popconfirm>
      </span>
    </template>
  </template>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'

export default {
  name: 'WordsGroupsView',
  computed: {
    updateNow() {
      return this.$WordsGroupsDetailsView.updateNow
    },
    wordsCount() {
      return this.$WordsGroupsView.groupArray.length
    },
    ...mapState('Views', ['$WordsGroupsView', '$WordsGroupsDetailsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsGroupsStore', ['fetch', 'add', 'update']),
    ...mapActions('Views', [
      'updateWordsGroupsView',
      'updateWordsGroupsDetailsView'
    ]),
    async onSave() {
      try {
        const wordsIdArray = this.$WordsGroupsView.groupArray.map(
          (item) => item.ws_id
        )
        this.formState.wordsGroup.words_groups_details = wordsIdArray
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.add(this.formState.wordsGroup)
        this.clearCheckbox()
        this.$router.push({ name: 'wordsGroups' })
      } catch (error) {}
    },
    async onEditSave() {
      const wordsIdArray = this.$WordsGroupsView.groupArray.map(
        (item) => item.ws_id
      )
      this.formState.wordsGroup.words_groups_details = wordsIdArray
      const editId = this.$WordsGroupsView.id
      message.loading({ content: 'Loading..', duration: 1 })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await this.update({ id: editId, data: this.formState.wordsGroup })
      this.clearCheckbox()
      this.$router.push({ name: 'wordsGroupsDetails', params: { id: editId } })
    },
    clearCheckbox() {
      this.updateWordsGroupsView({
        variable: 'groupArray',
        data: { clear: true }
      })
      this.updateWordsGroupsDetailsView({ variable: 'updateNow', data: false })
      this.formState.wordsGroup.wg_name = ''
      this.saveDisabled = false
    },
    onRemove(id, wsName) {
      this.updateWordsGroupsView({
        variable: 'groupArray',
        data: { ws_id: id, ws_name: wsName, checked: false }
      })
    }
  },
  async created() {
    try {
      this.Ready = true
    } catch (error) {}
  },
  watch: {
    'formState.wordsGroup.wg_name'(val) {
      if (val == null || val === '' || this.wordsCount === 0) {
        this.saveDisabled = true
      } else {
        this.saveDisabled = false
      }
    },
    wordsCount(val) {
      if (val > 0 && this.formState.wordsGroup.wg_name) {
        this.saveDisabled = false
      }
    },
    updateNow(val) {
      if (val === true) {
        this.formState.wordsGroup.wg_name = this.$WordsGroupsView.wg_name
      } else {
        this.formState.wordsGroup.wg_name = ''
      }
    },
    '$WordsGroupsView.wg_name'(val) {
      if (this.updateNow === true) {
        this.formState.wordsGroup.wg_name = this.$WordsGroupsView.wg_name
      } else {
        this.formState.wordsGroup.wg_name = ''
      }
    }
  },
  setup() {
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
  content: '';
}

.button-container {
  display: flex;
  align-items: center;
}
.button-remove {
  color: #ea0000;
  margin-bottom: auto;
}
</style>
