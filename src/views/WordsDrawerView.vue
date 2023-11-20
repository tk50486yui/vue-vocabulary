<template>
  <!-- drawer words add -->
  <div class="drawer-theme" ref="wordsDrawer" :class="$theme">
    <a-drawer
      :getContainer="() => $refs.wordsDrawer"
      v-bind="$attrs"
      placement="left"
      :width="drawerWidth"
    >
      <WordsAddView />
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { mapState } from 'vuex'
import WordsAddView from '@/views/WordsAddView.vue'

export default defineComponent({
  name: 'WordsDrawerView',
  components: {
    WordsAddView
  },
  computed: {
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$desktop', '$tablet', '$mobile'])
  },
  methods: {
    // drawer
    onDrawerShow(): void {
      this.setDrawerStyle()
    },
    setDrawerStyle(): void {
      this.drawerWidth =
        this.drawerWidthMap[
          this.$desktop
            ? 'desktop'
            : this.$tablet
              ? 'tablet'
              : this.$mobile
                ? 'mobile'
                : 'desktop'
        ]
    }
  },
  watch: {
    $desktop() {
      this.setDrawerStyle()
    },
    $tablet() {
      this.setDrawerStyle()
    },
    $mobile() {
      this.setDrawerStyle()
    }
  },
  setup() {
    const drawerWidth = ref(500)
    const drawerWidthMap = {
      desktop: 500,
      tablet: 400,
      mobile: 300
    }

    return {
      drawerWidth,
      drawerWidthMap
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
