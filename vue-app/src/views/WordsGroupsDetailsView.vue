<template>
    <template v-if="Ready">
        <h5>
            <router-link :to="{ name: 'wordsGroupsList' }"> 返回 </router-link>
             > {{ this.wordsGroup.wg_name }}
        </h5>
        <p></p>
        <div class="list-theme" :class="this.$theme">
            <a-list
                item-layout="horizontal"
                :data-source="this.wordsGroup.details"
            >
            <template #renderItem="{ item }">
                <a-list-item>
                <a-list-item-meta>
                    <template #description>
                        {{ item.ws_id}}. {{ item.ws_name}}
                    </template>
                </a-list-item-meta>
                </a-list-item>
            </template>
            <template #footer>
                <span class="span-text">
                    <template v-if="this.wordsGroup.details.length === 0">
                        尚無單字
                    </template>
                    <template v-else>
                        共 {{ this.wordsGroup.details.length }} 筆 單字
                    </template>
                </span>
                </template>
            </a-list>
        </div>
    </template>
</template>

<script>
import { ref } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'WordsGroupsDetailsView',
  computed: {
    ...mapGetters('WordsGroupsStore', ['wordsGroups']),
    ...mapGetters('WordsGroupsStore', ['wordsGroupsById']),
    ...mapState('Theme', ['$theme']),
    wgId () {
      return this.$route.params.id
    },
    wordsGroup () {
      return this.wordsGroupsById(this.wgId)
    }
  },
  methods: {
    ...mapActions('WordsGroupsStore', ['fetch'])
  },
  async created () {
    try {
      window.scrollTo({ top: 120, behavior: 'instant' })
      await this.fetch()
      this.Ready = true
    } catch (error) {}
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

</style>
