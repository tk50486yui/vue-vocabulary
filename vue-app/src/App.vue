<template>
  <div>
    <HeaderView />
    <!-- Breadcrumb Begin -->
    <div class="breadcrumb-option" :class="[this.$theme]">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__links" :class="[this.$theme]">
                        <a href="./index.html"><i class="fa fa-home"></i> Home</a>
                         <span class="btn1" :class="[this.$theme]">單字表</span>
                        <a-switch
                          :checked="this.$theme === 'dark'"
                          checked-children="暗黑模式"
                          un-checked-children="明亮模式"
                          @change="changeTheme"
                        />
                        <button type="button" class="btn btn-outline-light btn-sm btn1" :class="[this.$theme]">測試</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Section Begin -->
    <section class="spad" :class="[this.$theme]">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-3">
            <CategoriesMenuView />
          </div>
          <div class="col-lg-9 col-md-9">
            <nav>
              <router-link :to="{ name: 'words' }">Words</router-link>
            </nav>
            <nav>
              <router-link :to="{ name: 'home' }">Words Add</router-link>
            </nav>
            <nav>
              <router-link :to="{ name: 'success' }">Success Page</router-link>
            </nav>
            <nav>
              <router-link :to="{ name: 'error' }">Error Page</router-link>
            </nav>
            <ul>
              <li v-for="i in 2" :key="i">
                <router-link :to="{ name: 'users', params: { id: i } }">User {{ i }}</router-link>
              </li>
            </ul>

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

.breadcrumb__links a {
  font-size: 15px;
  font-weight: 500;
  color: #111111;
  margin-right: 18px;
  display: inline-block;
  position: relative;
}

.breadcrumb__links a:after {
  position: absolute;
  right: -14px;
  top: 0;
  content: "";
  font-family: "FontAwesome";
}

.breadcrumb__links a i {
  margin-right: 5px;
}

.breadcrumb__links span {
  font-size: 15px;
  font-weight: 500;
  color: #888888;
  display: inline-block;
}

</style>
