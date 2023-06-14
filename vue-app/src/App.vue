<template>
  <div class="main-body" :class="this.$theme">
    <HeaderView />
    <!-- Breadcrumb Begin -->
    <div class="breadcrumb-option" :class="[this.$theme]">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__links" :class="[this.$theme]">
                      <router-link :to="{ name: 'words' }">
                        <font-awesome-icon :icon="['fas', 'house']" /> Home
                      </router-link>
                      <span class="breadcrumb-separator"><font-awesome-icon :icon="['fas', 'chevron-right']" size="xs"/></span>
                      <span>單字表</span>
                      <div class="breadcrumb__switch">
                        <a-switch
                          :checked="this.$theme === 'dark'"
                          checked-children="暗黑模式"
                          un-checked-children="明亮模式"
                          @change="changeTheme"
                        />
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 主頁面 -->
    <section class="spad" :class="[this.$theme]">
      <div class="container">
        <div class="row">
          <!-- 左側 Left -->
          <div class="col-lg-3 col-md-3">
            <CategoriesMenuView />
          </div>
          <!-- 右側 Right -->
          <div class="col-lg-9 col-md-9">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </section>
    <!-- Section End -->

    <FooterView />

  </div>
</template>
<script>
import CategoriesMenuView from '@/views/CategoriesMenuView.vue'
import HeaderView from '@/views/HeaderView.vue'
import FooterView from '@/views/FooterView.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    HeaderView,
    CategoriesMenuView,
    FooterView
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('Theme', ['updateTheme']),
    changeTheme (checked) {
      const theme = checked ? 'dark' : 'light'
      this.updateTheme(theme)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
}

/*---------------------
  Breadcrumb
-----------------------*/

.breadcrumb-separator {
  margin-right: 10px;
  margin-left: -5px;
  position: relative;
  display: inline-block;
}
.breadcrumb-separator font-awesome-icon {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
}

.breadcrumb__links a i {
  margin-right: 5px;
}

.breadcrumb__switch {
  margin-left: auto;
}

</style>
