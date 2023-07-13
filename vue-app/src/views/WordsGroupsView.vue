<template>
    <template v-if="Ready">
      <h4 class="main-body" :class="this.$theme">
        <span>單字組別</span>
      </h4>
    </template>
</template>

<script>
import { mapState } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'WordsGroupsView',
  components: {

  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
  },
  async created () {
    try {
      this.Ready = true
    } catch (error) {}
  },
  activated () {

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
