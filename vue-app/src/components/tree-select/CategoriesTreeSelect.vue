<template>
  <div class="select-theme" :class="this.$theme" ref="selectMod">
    <a-tree-select
      :getPopupContainer="()=>this.$refs.selectMod"
      v-bind="$attrs"
      v-model:searchValue="searchValue"
      show-search
      allow-clear
      :tree-line="treeLine && { showLeafIcon }"
      :tree-data="this.categoriesTransformed"
      :field-names="{
        children: 'children',
        label: 'cate_name',
        value: 'id',
        key: 'id'}"
    >
      <template #title="{ value: val, cate_name }">
        <b v-if="val === 1" style="color: #08c">{{val}}</b>
        <template v-else>
          <template
            v-for="(fragment, i) in cate_name
              .toString()
              .split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
          >
            <span
              v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
              :key="i"
              style="color: #08c"
            >
              {{ fragment }}
            </span>
            <template v-else>{{ fragment }}</template>
          </template>
        </template>
      </template>
    </a-tree-select>
  </div>

</template>
<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('CategoriesStore', ['categoriesTransformed']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch'])
  },
  async created () {
    await this.fetch()
  },
  setup () {
    const searchValue = ref('')
    const treeLine = ref(true)
    const showLeafIcon = ref(false)

    return {
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
