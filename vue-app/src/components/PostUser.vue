<template>
  <div>
      <a-tree-select
      v-model:value="value"
      show-search
      style="width: 100%"
      placeholder="Please select"
      allow-clear
      multiple
      tree-default-expand-all
      :tree-data="treeData"
      tree-node-filter-prop="label"
      >
      <template #tagRender="{ label, closable, onClose, option }">
        <a-tag :closable="closable" :color="option.color" style="margin-right: 3px" @close="onClose">
          {{ label }}&nbsp;&nbsp;
        </a-tag>
      </template>

      </a-tree-select>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('TagsStore', ['tagsTransformed']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch'])
  },
  async created () {
    await this.fetch()
  },
  setup () {
    const value = ref(['1', '2', '3'])
    const treeData = ref([{
      label: 'parent 1',
      value: '1',
      color: 'pink',
      children: [{
        label: 'parent 1-0',
        value: '2',
        color: 'orange',
        children: [{
          label: 'my leaf',
          value: '3',
          color: 'green'
        }, {
          label: 'your leaf',
          value: 'leaf2',
          color: 'cyan'
        }]
      }, {
        label: 'parent 1-1',
        value: 'parent 1-1',
        color: 'blue'
      }]
    }])
    watch(value, () => {
      console.log('select', value.value)
    })
    return {
      value,
      treeData
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
