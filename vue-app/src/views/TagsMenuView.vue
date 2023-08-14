<template>
    <template v-if="Ready">
      <div class="section-title" :class="this.$theme">
        <h4>標籤總覽</h4>
      </div>
    </template>
</template>

<script>
import { ref } from 'vue'
import { mapState } from 'vuex'

export default {
  name: 'TagsMenuView',
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

.section-title {
  margin-bottom: 8px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #f6aaf1;
  content: "";
}

</style>
