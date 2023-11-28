<template>
  <template v-if="Ready">
    <div class="section-title" :class="$theme">
      <h4>單字組別</h4>
    </div>
    <div class="list-theme" :class="$theme">
      <!-- list -->
      <a-list
        item-layout="horizontal"
        :locale="{ emptyText: '暫無資料' }"
        :data-source="$WordsGroupsView.groupArray"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <template #actions>
              <span class="button-container">
                <DeleteOutlined class="button-remove" @click="onRemove(item.ws_id, item.ws_name)" />
              </span>
            </template>
            <a-list-item-meta>
              <template #description> {{ index + 1 }}. {{ item.ws_name }} </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
        <template #footer>
          <span class="span-text"> 共 {{ wordsCount }} 筆 單字 </span>
        </template>
      </a-list>
    </div>
    <!-- save button -->
    <template v-if="wordsCount > 0 && updateNow === false">
      <div class="input-theme" :class="$theme" style="padding-bottom: 12px">
        <a-input v-model:value="formState.wordsGroup.wg_name" placeholder="組別名稱" allow-clear />
      </div>
      <a-button
        class="btn btn-primary btn-outline-light btn-sm"
        shape="round"
        size="small"
        @click="onSave()"
        :disabled="saveDisabled"
        >儲存
      </a-button>
      <span style="padding-left: 6px">
        <a-popconfirm
          title="確定要清空嗎？"
          ok-text="是"
          cancel-text="否"
          @confirm="clearCheckbox()"
        >
          <a-button class="btn btn-danger btn-outline-light" shape="round" size="small">
            清空
          </a-button>
        </a-popconfirm>
      </span>
    </template>
    <template v-else-if="updateNow">
      <div class="input-theme" :class="$theme" style="padding-bottom: 12px">
        <a-input v-model:value="formState.wordsGroup.wg_name" placeholder="組別名稱" allow-clear />
      </div>
      <a-button
        class="btn btn-primary btn-outline-light btn-sm"
        shape="round"
        size="small"
        @click="onEditSave()"
        :disabled="saveDisabled"
        >儲存
      </a-button>
      <span style="padding-left: 6px">
        <a-popconfirm
          title="確定要取消編輯嗎？"
          ok-text="是"
          cancel-text="否"
          @confirm="clearCheckbox()"
        >
          <a-button class="btn btn-danger btn-outline-light btn-sm" shape="round" size="small">
            取消編輯
          </a-button>
        </a-popconfirm>
      </span>
    </template>
    <template v-else-if="$route.name !== 'wordsGrid'">
      <div style="margin-left: 30px; margin-bottom: 15px">
        <a-button class="btn btn-dark btn-outline-light rounded" size="small" @click="onMove()">
          進入單字總覽新增
        </a-button>
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { WordsGroupsForm, groupArray as WordsGroupArray } from '@/interfaces/WordsGroups'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const $router = useRouter()
const $route = useRoute()

const { $WordsGroupsView, $WordsGroupsDetailsView } = toRefs(store.state.Views)

const updateNow = computed(() => $WordsGroupsDetailsView.value.updateNow)
const wordsCount = computed(() => $WordsGroupsView.value.groupArray.length)

const Ready = ref<boolean>(false)
const saveDisabled = ref<boolean>(true)

const formState = reactive({
  wordsGroup: {} as WordsGroupsForm
})

const onSave = async (): Promise<void> => {
  try {
    const wordsIdArray = $WordsGroupsView.value.groupArray.map(
      (item: WordsGroupArray) => item.ws_id
    )
    formState.wordsGroup.words_groups_details = wordsIdArray
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsGroupsStore/add', formState.wordsGroup)
    clearCheckbox()
    $router.push({ name: 'wordsGroups' })
  } catch (e) {
    //
  }
}

const onEditSave = async (): Promise<void> => {
  try {
    const wordsIdArray = $WordsGroupsView.value.groupArray.map(
      (item: WordsGroupArray) => item.ws_id
    )
    formState.wordsGroup.words_groups_details = wordsIdArray
    const editId = $WordsGroupsView.value.id
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsGroupsStore/update', {
      id: editId,
      data: formState.wordsGroup
    })
    clearCheckbox()
    $router.push({ name: 'wordsGroupsDetails', params: { id: editId } })
  } catch (e) {
    //
  }
}

const clearCheckbox = (): void => {
  store.dispatch('Views/updateWordsGroupsView', {
    variable: 'clear',
    data: true
  })
  store.dispatch('Views/updateWordsGroupsDetailsView', {
    variable: 'updateNow',
    data: false
  })
  formState.wordsGroup.wg_name = ''
  saveDisabled.value = false
}

const onRemove = (id: number, wsName: string): void => {
  store.dispatch('Views/updateWordsGroupsView', {
    variable: 'groupArray',
    data: { ws_id: id, ws_name: wsName, checked: false }
  })
}

const onMove = (): void => {
  const routeName = $route.name
  if (routeName !== 'wordsGrid') {
    $router.push({ name: 'wordsGrid' })
  }
}

onMounted(() => {
  formState.wordsGroup = { ...formState.wordsGroup }
  formState.wordsGroup.words_groups_details = []
  Ready.value = true
})

watchEffect(() => {
  if (
    formState.wordsGroup.wg_name == null ||
    formState.wordsGroup.wg_name === '' ||
    wordsCount.value === 0
  ) {
    saveDisabled.value = true
  } else {
    saveDisabled.value = false
  }
})

watch(wordsCount, (val) => {
  if (val > 0 && formState.wordsGroup.wg_name) {
    saveDisabled.value = false
  }
})

watch(updateNow, (val) => {
  if (val === true) {
    formState.wordsGroup.wg_name = $WordsGroupsView.value.wg_name
  } else {
    formState.wordsGroup.wg_name = ''
  }
})

watch(
  () => $WordsGroupsView.value.wg_name,
  (val) => {
    if (updateNow.value === true) {
      formState.wordsGroup.wg_name = val
    } else {
      formState.wordsGroup.wg_name = ''
    }
  }
)
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

.btn:disabled {
  color: #5b9bda;
  background-color: #00000008;
}
</style>
