<template>
  <div>
    <header class="header" :class="$theme">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xl-3 col-lg-2">
            <div class="header__logo">
              <router-link :to="{ name: 'wordsGrid' }">
                <img :src="logo" />
              </router-link>
            </div>
          </div>
          <div class="col-xl-6 col-lg-7">
            <nav class="header__menu">
              <ul class="nav-menu" :class="$theme">
                <li :class="{ active: activeIndex === 0 }">
                  <router-link :to="{ name: 'wordsGrid' }">
                    <div class="dropdown-container">
                      單字
                      <CaretDownOutlined />
                    </div>
                  </router-link>
                  <ul class="dropdown">
                    <li>
                      <router-link :to="{ name: 'wordsGrid' }">單字總覽</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'words' }">單字表</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'wordsAdd' }">單字新增</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'wordsUpload' }">圖片總覽</router-link>
                    </li>
                  </ul>
                </li>
                <li :class="{ active: activeIndex === 1 }">
                  <router-link :to="{ name: 'articles' }">文章</router-link>
                </li>
                <li :class="{ active: activeIndex === 2 }">
                  <router-link :to="{ name: 'tags' }">標籤</router-link>
                </li>
                <li :class="{ active: activeIndex === 3 }">
                  <router-link :to="{ name: 'categories' }">類別</router-link>
                </li>
                <li :class="{ active: activeIndex === 4 }">
                  <router-link :to="{ name: 'wordsGroups' }">群組</router-link>
                </li>
              </ul>
            </nav>
          </div>
          <div class="col-lg-3">
            <div class="header__right">
              <ul class="header__right__widget">
                <li>
                  <span :class="{ 'text-secondary': $searchShow }" @click="setSearchShow()">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                  </span>
                </li>
                <li>
                  <span @click="settingVisible = true">
                    <font-awesome-icon :icon="['fas', 'gear']" />
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="canvas__open">
            <span
              :class="{ 'text-secondary': $searchShow }"
              style="margin-right: 12px"
              @click="setSearchShow()"
            >
              <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
            </span>
            <span style="margin-right: 12px" @click="settingVisible = true">
              <font-awesome-icon :icon="['fas', 'gear']" />
            </span>
            <span @click="drawerVisible = true">
              <font-awesome-icon :icon="['fas', 'bars']" />
            </span>
          </div>
        </div>
      </div>
    </header>
  </div>
  <div class="drawer-theme" ref="navDrawer" :class="$theme">
    <a-drawer
      :getContainer="() => $refs.navDrawer"
      :width="230"
      placement="left"
      :closable="false"
      :visible="drawerVisible"
      @close="drawerVisible = false"
    >
      <template #title>
        <div class="drawer__logo">
          <router-link :to="{ name: 'wordsGrid' }">
            <img :src="logo" />
          </router-link>
        </div>
      </template>
      <NavDrawerView />
    </a-drawer>
  </div>
  <div class="drawer-theme" ref="settingDrawer" :class="$theme">
    <a-drawer
      :getContainer="() => $refs.settingDrawer"
      :height="230"
      placement="bottom"
      :closable="false"
      :visible="settingVisible"
      @close="settingVisible = false"
    >
      <el-switch
        v-model="shouldConnect"
        size="large"
        active-text="Socket 開啟中"
        inactive-text="Socket 關閉中"
      />
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import NavDrawerView from '@/views/shared/NavDrawerView.vue'
import logo from '@/assets/img/logo.png'
import '@/plugins/laravel-echo-setup'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $searchShow } = toRefs(store.state.Search)

const $route = useRoute()

const activeIndex = ref<number>(2)
const drawerVisible = ref<boolean>(false)
const settingVisible = ref<boolean>(false)
const shouldConnect = ref<boolean>(false)

const setSearchShow = (): void => {
  store.dispatch('Search/updateSearchShow', !$searchShow.value)
}

const setActive = (): void => {
  switch ($route.name) {
    case 'wordsGrid':
    case 'words':
    case 'wordsAdd':
    case 'wordsUpload':
      activeIndex.value = 0
      break
    case 'articles':
      activeIndex.value = 1
      break
    case 'tags':
      activeIndex.value = 2
      break
    case 'categories':
      activeIndex.value = 3
      break
    case 'wordsGroups':
      activeIndex.value = 4
      break
    default:
      activeIndex.value = 0
      break
  }
}

const joinChannel = () => {
  // @ts-expect-error:  necessary
  window.Echo.channel('shouldUpdate').listen('.BroadcastUpdate', async (event) => {
    if (event.data.message === 'should be update') {
      try {
        await store.dispatch('WordsStore/fetch')
        console.log('update words')
      } catch (e) {
        //
      }
    }
  })
}
const switchEchoConnection = () => {
  // @ts-expect-error:  necessary
  if (window.Echo) {
    if (shouldConnect.value) {
      // @ts-expect-error:  necessary
      window.Echo.connect()
      joinChannel()
    } else {
      // @ts-expect-error:  necessary
      window.Echo.disconnect()
    }
  } else {
    console.log('echo server error')
  }
}

onMounted(() => {
  setActive()
})

watchEffect(() => {
  setActive()
})
watchEffect(async () => {
  switchEchoConnection()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

/*---------------------
    Header
-----------------------*/
.canvas__open {
  display: none;
}

.dropdown-container {
  display: flex;
  align-items: center;
}

/*---------------------
    Header Logo
-----------------------*/
.header__logo {
  padding: 32px 0;
}

.header__logo a {
  display: inline-block;
}

.drawer__logo {
  padding-bottom: 4px;
}

.drawer__logo a {
  display: inline-block;
}

/*---------------------
    Nav Menu
-----------------------*/
.nav-menu {
  li a {
    font-size: 15px;
    text-transform: uppercase;
    font-weight: 500;
    display: block;
    padding: 2px 0;
    position: relative;
    text-decoration: none;
  }
}

/*---------------------
    Header Menu
-----------------------*/
.header__menu {
  padding: 30px 0 27px;
}

.header__menu ul li {
  list-style: none;
  display: inline-block;
  margin-right: 40px;
  position: relative;
}

.header__menu ul li.active a:after {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.header__menu ul li:hover a:after {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.header__menu ul li:hover .dropdown {
  top: 27px;
  opacity: 1;
  visibility: visible;
}

.header__menu ul li:last-child {
  margin-right: 0;
}

.header__menu ul li .dropdown {
  position: absolute;
  left: 0;
  top: 56px;
  width: 150px;
  background: #111111;
  text-align: left;
  padding: 2px 0;
  z-index: 9;
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all, 0.3s;
  -o-transition: all, 0.3s;
  transition: all, 0.3s;
}

.header__menu ul li .dropdown li {
  display: block;
  margin-right: 0;
}

.header__menu ul li .dropdown li a {
  font-size: 14px;
  color: #ffffff;
  font-weight: 400;
  padding: 8px 20px;
  text-transform: capitalize;
}

.header__menu ul li .dropdown li a:after {
  display: none;
}

.header__menu ul li a:after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #ca1515;
  content: '';
  -webkit-transition: all, 0.5s;
  -o-transition: all, 0.5s;
  transition: all, 0.5s;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
}

/*---------------------
    Header Right
-----------------------*/
.header__right {
  text-align: right;
  padding: 30px 0 27px;
}

.header__right__widget {
  display: inline-block;
}

.header__right__widget li {
  list-style: none;
  display: inline-block;
  font-size: 18px;
  color: #111111;
  margin-right: 20px;
  cursor: pointer;
}

.header__right__widget li:last-child {
  margin-right: 0;
}

.header__right__widget li a {
  font-size: 18px;
  color: #111111;
  position: relative;
}

.header__right__widget li a .tip {
  position: absolute;
  right: -12px;
  top: -11px;
  height: 18px;
  width: 18px;
  background: #111111;
  font-size: 10px;
  font-weight: 500;
  color: #ffffff;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
}

/*---------------------
    @media
-----------------------*/
@media only screen and (min-width: 1600px) and (max-width: 1900px) {
  .header {
    padding: 0 85px;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1599px) {
  .header__menu ul li {
    margin-right: 20px;
  }

  .header {
    padding: 0 30px;
  }
}

/* Medium Device = 1200px */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .header__menu ul li {
    margin-right: 20px;
  }
}

/* Tablet Device = 768px */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .canvas__open {
    display: block;
    font-size: 22px;
    color: #222;
    height: 35px;
    width: 120px;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 24px;
  }

  .header__menu {
    display: none;
  }

  .header__right {
    display: none;
  }
}

/* Wide Mobile = 480px */
@media only screen and (max-width: 767px) {
  .canvas__open {
    display: block;
    font-size: 22px;
    color: #222;
    height: 35px;
    width: 120px;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 24px;
  }

  .header__menu {
    display: none;
  }

  .header__right {
    display: none;
  }
}

/*---------------------
    Header Theme
-----------------------*/
.header {
  &.dark {
    background: var(--head-background);
    -webkit-box-shadow: 0px 5px 10px rgba(91, 91, 91, 0.1);
    box-shadow: 0px 5px 10px rgba(230, 9, 9, 0.1);
  }

  &.light {
    background: var(--head-background);
    -webkit-box-shadow: 0px 5px 10px rgba(91, 91, 91, 0.1);
    box-shadow: 0px 5px 10px rgba(230, 9, 9, 0.1);
  }

  &.dark :deep(.header__right .header__right__widget li) {
    color: var(--head-text);
  }

  &.light :deep(.header__right .header__right__widget li) {
    color: var(--head-text);
  }

  &.dark :deep(.canvas__open) {
    color: var(--head-text);
  }

  &.light :deep(.canvas__open) {
    color: var(--head-text);
  }
}

/*---------------------
    Navbar Theme
-----------------------*/
.nav-menu {
  &.dark li a {
    color: var(--head-text);
  }

  &.light li a {
    color: var(--head-text);
  }
}
</style>
