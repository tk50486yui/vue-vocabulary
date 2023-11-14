<template>
  <div class="select-theme" :class="$theme" ref="selectMod">
      <a-select
          :getPopupContainer="()=>this.$refs.selectMod"
          v-bind="$attrs"
          :options="tagsColor"
          show-search
          allowClear
          :field-names="{
            label: 'id',
            value: 'id'}"
        >
            <template #option="{ id, tc_color, tc_background, tc_border  }">
                #{{ id }}
                <a-tag :style="
                        'background:' + tc_background
                        + ';color:'+ tc_color
                        +';border-color:'+ tc_border">
                    default
                </a-tag>
            </template>
        </a-select>
    </div>
</template>
<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    selectData () {
      return this.tagsColor
    },
    ...mapGetters('TagsColorStore', ['tagsColor']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsColorStore', ['fetch'])
  },
  async created () {
    await this.fetch()
  },
  setup () {
    const searchValue = ref('')
    const treeLine = ref(true)
    const showLeafIcon = ref(false)
    const options = ref(
      [
        {
          id: 'jack2',
          tc_color: 'Jack'
        },
        {
          id: 'lucy2',
          tc_color: 'Lucy'
        }]
    )
    return {
      options,
      searchValue,
      treeLine,
      showLeafIcon
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
