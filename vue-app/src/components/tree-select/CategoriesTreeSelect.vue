<template>
    <a-tree-select
      v-model:value="watchV"
      v-model:searchValue="searchValue"
      show-search
      :dropdown-style="{ maxHeight: '800px', overflow: 'auto' }"
      placeholder="類別"
      :tree-line="treeLine && { showLeafIcon }"
      allow-clear
      size="large"
      :tree-data="treeData"
      :field-names="{
        children: 'children',
        label: 'cate_name',
        value: 'id',
        key: 'id'}"
      @change="handleChange"
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
  </template>
<script>
import { ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  emits: ['update:modelValue'],
  data () {
    return {
      treeData: []
    }
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categoriesTransformed'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch'])
  },
  async created () {
    await this.fetch()
    this.treeData = ref(this.categoriesTransformed)
  },
  setup (props, context) {
    const selectedValue = ref(props.modelValue)
    const watchV = ref()
    const treeLine = ref(true)
    const showLeafIcon = ref(false)

    function handleChange (value) {
      selectedValue.value = value
      context.emit('update:modelValue', value)
    }

    const searchValue = ref('')

    return {
      searchValue,
      watchV,
      treeLine,
      showLeafIcon,
      handleChange
    }
  }
}
</script>
