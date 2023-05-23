<template>
  <div>
    <HeaderView />
    <!-- Breadcrumb Begin -->
    <div class="breadcrumb-option">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__links">
                        <a href="./index.html"><i class="fa fa-home"></i> Home</a>
                         <span :class="[theme]">單字表</span>
                        <a-switch
                          :checked="theme === 'dark'"
                          checked-children="Dark"
                          un-checked-children="Light"
                          @change="changeTheme"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Section Begin -->
    <section class="spad">
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
    <!-- Footer Section Begin -->
    <footer class="footer">
      <div class="container">
          <div class="row">
              <div class="col-lg-12">
                  <div class="footer__copyright__text">
                      <p>Copyright &copy; 2023 All rights reserved | This template is made with <i class="fa fa-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a></p>
                  </div>
              </div>
          </div>
      </div>
    </footer>
  <!-- Footer Section End -->
  </div>
</template>
<script>
import CategoriesMenuView from '@/views/CategoriesMenuView.vue'
import HeaderView from '@/views/HeaderView.vue'
import { reactive, toRefs } from 'vue'

export default {
  name: 'App',
  components: {
    HeaderView,
    CategoriesMenuView
  },
  setup () {
    const MainState = reactive({
      theme: 'light'
    })
    const changeTheme = checked => {
      MainState.theme = checked ? 'dark' : 'light'
    }
    return {
      ...toRefs(MainState),
      changeTheme
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.dark{
  color: var(--primary-color) !important;
}

.light {
  color: var(--primary-color) !important;
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
}
.spad {
  padding-top: 50px;
  padding-bottom: 50px;
}
/*---------------------
  Breadcrumb
-----------------------*/

.breadcrumb-option {
  padding-top: 35px;
}

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
/*---------------------
  Footer
-----------------------*/
.footer__copyright__text {
  border-top: 1px solid #e1e1e1;
  padding: 18px 0 25px;
  text-align: center;
  margin-top: 35px;
}

.footer__copyright__text p {
  margin-bottom: 0;
}

.footer__copyright__text a {
  color: #5C5C5C;
}

.footer__copyright__text i {
  color: #ca1515;
}

.footer__copyright__text a:hover {
  color: #ca1515;
}
</style>
