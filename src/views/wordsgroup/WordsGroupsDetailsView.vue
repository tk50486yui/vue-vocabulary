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
      <EditOutlined class="button-edit" :class="$theme" @click="onEdit()" />
    </div>
    <p></p>
    <div class="list-theme" :class="$theme">
      <a-list item-layout="horizontal" :data-source="wordsGroup.details">
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                {{ index + 1 }}. {{ item.ws_name }}
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
  </template>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'
import { DeleteBtn } from '@/components/button'
import { WordsGroupsDetails } from '@/interfaces/WordsGroups'

export default defineComponent({
  name: 'WordsGroupsDetailsView',
  components: {
    DeleteBtn
  },
  computed: {
    wgId(): number {
      return Number(this.$route.params.id)
    },
    wordsGroup() {
      return this.wordsGroupsById(this.wgId) || null
    },
    editShow() {
      return this.$WordsGroupsDetailsView.updateNow
    },
    ...mapGetters('WordsGroupsStore', ['wordsGroups', 'wordsGroupsById']),
    ...mapState('Views', ['$WordsGroupsView', '$WordsGroupsDetailsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsGroupsStore', ['fetch', 'deleteById']),
    ...mapActions('Views', [
      'updateWordsGroupsView',
      'updateWordsGroupsDetailsView'
    ]),
    async onDelete(id: number): Promise<void> {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.deleteById(id)
        this.$router.push({ name: 'wordsGroups' })
      } catch (error) {
        //
      }
    },
    onEdit(): void {
      if (this.editShow === false) {
        this.updateWordsGroupsDetailsView({ variable: 'updateNow', data: true })
        this.injectEditData()
      } else {
        this.updateWordsGroupsDetailsView({
          variable: 'updateNow',
          data: false
        })
        let inBlock = false
        if (this.$WordsGroupsView.id !== this.wordsGroup.id) {
          this.updateWordsGroupsView({
            variable: 'groupArray',
            data: { clear: true }
          })
          this.injectEditData()
          this.updateWordsGroupsDetailsView({
            variable: 'updateNow',
            data: true
          })
          inBlock = true
        }
        if (!inBlock) {
          this.updateWordsGroupsView({
            variable: 'groupArray',
            data: { clear: true }
          })
        }
      }
    },
    injectEditData(): void {
      this.updateWordsGroupsView({
        variable: 'wg_name',
        data: this.wordsGroup.wg_name
      })
      this.updateWordsGroupsView({ variable: 'id', data: this.wordsGroup.id })
      this.wordsGroup.details.forEach((item: WordsGroupsDetails) => {
        this.updateWordsGroupsView({
          variable: 'groupArray',
          data: { ws_id: item.ws_id, ws_name: item.ws_name, checked: true }
        })
      })
    }
  },
  async created() {
    try {
      window.scrollTo({ top: 120, behavior: 'instant' })
      await this.fetch()
      this.Ready = true
    } catch (error) {
      //
    }
  },
  setup() {
    const Ready = ref(false)
    return {
      Ready
    }
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