<template>
    <div class="select-theme" :class="this.$theme" ref="selectMod">
        <a-tree-select
        :getPopupContainer="()=>this.$refs.selectMod"
        v-bind="$attrs"
        v-model:value="selectedValue"
        v-model:searchValue="searchValue"
        show-search
        allow-clear
        :tree-line="treeLine && { showLeafIcon }"
        :tree-data="this.tagsTransformed"
        :field-names="{
            children: 'children',
            label: 'ts_name',
            value: 'id',
            key: 'id'}"
        @change="handleChange"
        >
        <template #title="{ value: val, ts_name }">
            <b v-if="val === 1" style="color: #08c">{{val}}</b>
            <template v-else>
            <template
                v-for="(fragment, i) in ts_name
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
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
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
  setup (props, context) {
    const searchValue = ref('')
    const selectedValue = ref()
    const treeLine = ref(true)
    const showLeafIcon = ref(false)

    function handleChange (value) {
      selectedValue.value = value
      context.emit('update:modelValue', value)
    }
    function handleClear () {
      selectedValue.value = null
      context.emit('update:modelValue')
    }

    return {
      searchValue,
      selectedValue,
      treeLine,
      showLeafIcon,
      handleChange,
      handleClear
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
