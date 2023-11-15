<template>
    <!-- drawer words add -->
    <div class="drawer-theme" ref="wordsDrawer" :class="$theme">
      <a-drawer
          :getContainer = "()=>$refs.wordsDrawer"
          v-bind="$attrs"
          placement="left"
          :width="this.drawerWidth"
        >
          <WordsAddView />
      </a-drawer>
    </div>
</template>

<script>
import { ref } from 'vue'
import { mapState } from 'vuex'
import WordsAddView from '@/views/WordsAddView.vue'

export default {
  name: 'WordsDrawerView',
  components: {
    WordsAddView
  },
  computed: {
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$desktop']),
    ...mapState('Screen', ['$tablet']),
    ...mapState('Screen', ['$mobile'])
  },
  methods: {
    // drawer
    onDrawerShow () {
      this.setDrawerStyle()
      this.drawerVisible = true
    },
    setDrawerStyle () {
      this.drawerWidth = this.drawerWidthMap[
        this.$desktop ? 'desktop' : this.$tablet ? 'tablet' : this.$mobile ? 'mobile' : 'desktop'
      ]
    }
  },
  watch: {
    '$desktop' (val) {
      this.setDrawerStyle()
    },
    '$tablet' (val) {
      this.setDrawerStyle()
    },
    '$mobile' (val) {
      this.setDrawerStyle()
    }
  },
  setup () {
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

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
