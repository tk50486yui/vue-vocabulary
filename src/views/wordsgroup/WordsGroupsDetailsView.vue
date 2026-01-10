<template>
  <template v-if="Ready && wordsGroup">
    <span class="back-link-theme" :class="$theme">
      <router-link :to="{ name: 'wordsGroups' }"> 返回 </router-link>
      <span class="link-separator h5">
        <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs" />
      </span>
      <span class="h4">
        {{ wordsGroup.wg_name }}
      </span>
    </span>
    <div class="d-flex justify-content-end">
      <EditOutlined
        :class="{ 'text-secondary': editShow, 'button-edit': !editShow, [$theme]: true }"
        @click="onEdit()"
      />
    </div>
    <p></p>
    <div class="list-theme" :class="$theme">
      <a-list item-layout="horizontal" :data-source="wordsGroup.details">
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <span class="list-item-link">
                  <router-link :to="{ name: 'wordDetails', params: { id: item.ws_id } }">
                    <div class="popover-theme" :class="$theme" ref="popoverMod">
                      <a-popover
                        :title="item.ws_name"
                        trigger="hover"
                        :getPopupContainer="() => $refs.popoverMod"
                      >
                        <template #content>
                          <p></p>
                          {{ item.ws_pronunciation }}
                          <p></p>
                          {{ item.ws_definition }}
                          <p></p>
                          {{ item.ws_slogan }}
                          <p></p>
                          <div v-html="item.ws_description"></div>
                          <p></p>
                          {{ item.created_at }}
                        </template>
                        {{ index + 1 }}. {{ item.ws_name }}
                      </a-popover>
                    </div>
                  </router-link>
                </span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
        <template #footer>
          <span class="span-text">
            <template v-if="wordsGroup.details.length === 0">
              尚無單字
              <p></p>
              <DeleteBtn @confirm="onDelete(wgId)" />
            </template>
            <template v-else>
              共 {{ wordsGroup.details.length }} 筆 單字
              <p></p>
              <DeleteBtn @confirm="onDelete(wgId)" />
            </template>
          </span>
        </template>
      </a-list>
    </div>
    <a-back-top />
  </template>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { DeleteBtn } from '@/components/button'
import { WordsGroupsDetails } from '@/interfaces/WordsGroups'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const route = useRoute()
const router = useRouter()

const Ready = ref<boolean>(false)

const wgId = computed(() => Number(route.params.id))
const wordsGroup = computed(
  () => store.getters['WordsGroupsStore/wordsGroupsById'](wgId.value) || null
)
const editShow = computed(() => store.state.Views.$WordsGroupsDetailsView.updateNow)

const onDelete = async (id: number): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsGroupsStore/deleteById', id)
    router.push({ name: 'wordsGroups' })
  } catch (e) {
    //
  }
}

const onEdit = (): void => {
  if (!editShow.value) {
    store.dispatch('Views/updateWordsGroupsDetailsView', {
      variable: 'updateNow',
      data: true
    })
    store.dispatch('Views/updateWordsGroupsView', {
      variable: 'clear',
      data: true
    })
    injectEditData()
  } else {
    store.dispatch('Views/updateWordsGroupsDetailsView', {
      variable: 'updateNow',
      data: false
    })
    let inBlock = false
    if (store.state.Views.$WordsGroupsView.id !== wordsGroup.value.id) {
      store.dispatch('Views/updateWordsGroupsView', {
        variable: 'clear',
        data: true
      })
      injectEditData()
      store.dispatch('Views/updateWordsGroupsDetailsView', {
        variable: 'updateNow',
        data: true
      })
      inBlock = true
    }
    if (!inBlock) {
      store.dispatch('Views/updateWordsGroupsView', {
        variable: 'clear',
        data: true
      })
    }
  }
}

const injectEditData = (): void => {
  store.dispatch('Views/updateWordsGroupsView', {
    variable: 'wg_name',
    data: wordsGroup.value.wg_name
  })
  store.dispatch('Views/updateWordsGroupsView', {
    variable: 'id',
    data: wordsGroup.value.id
  })
  wordsGroup.value.details.forEach((item: WordsGroupsDetails) => {
    store.dispatch('Views/updateWordsGroupsView', {
      variable: 'groupArray',
      data: { ws_id: item.ws_id, ws_name: item.ws_name, checked: true }
    })
  })
}

onMounted(async () => {
  try {
    window.scrollTo({ top: 120, behavior: 'instant' })
    await store.dispatch('WordsGroupsStore/fetch')
    Ready.value = true
  } catch (error) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.button-edit {
  &.dark {
    color: var(--edit-icon);
  }

  &.light {
    color: var(--edit-icon);
  }
}
</style>
