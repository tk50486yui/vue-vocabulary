<template>
  <!-- Breadcrumb -->
  <div class="breadcrumb-theme" :class="$theme">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb-links" :class="$theme">
            <span>
              <router-link :to="{ name: 'home' }">
                <font-awesome-icon :icon="['fas', 'house']" /> 首頁
              </router-link>
            </span>
            <template v-if="!activeHome && activeRoute != ''">
              <span class="breadcrumb-separator">
                <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs" />
              </span>
              <span class="active">
                {{ activeRoute }}
              </span>
            </template>
            <div class="breadcrumb-switch switch-theme" :class="$theme">
              <a-switch :checked="$theme === 'dark'" @change="changeTheme">
                <template #checkedChildren>
                  <el-icon><el-Moon /></el-icon>
                </template>
                <template #unCheckedChildren>
                  <span class="text-info">
                    <el-icon><el-Sunny /></el-icon>
                  </span>
                </template>
              </a-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const $route = useRoute()

const activeRoute = ref<string>('')
const activeHome = ref<boolean>(false)

const changeTheme = (checked: boolean): void => {
  const theme = checked ? 'dark' : 'light'
  store.dispatch('Theme/updateTheme', theme)
}

const getCurrentRoute = (): void => {
  activeHome.value = false
  switch ($route.name) {
    case 'wordsAdd':
      activeRoute.value = '單字新增'
      break
    case 'words':
      activeRoute.value = '單字表'
      break
    case 'wordsGrid':
    case 'wordDetails':
      activeRoute.value = '單字總覽'
      break
    case 'articles':
    case 'articlesContent':
      activeRoute.value = '文章總覽'
      break
    case 'categories':
      activeRoute.value = '類別列表'
      break
    case 'tags':
      activeRoute.value = '標籤列表'
      break
    case 'wordsGroups':
    case 'wordsGroupsDetails':
      activeRoute.value = '群組列表'
      break
    default:
      activeRoute.value = ''
      activeHome.value = true
      break
  }
}

onBeforeMount(() => {
  getCurrentRoute()
})

watch($route, () => {
  getCurrentRoute()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.breadcrumb-theme {
  padding-top: 35px;
}

.breadcrumb-links {
  display: flex;
}

.breadcrumb-links a {
  font-size: 15px;
  font-weight: 500;
  margin-right: 18px;
  display: inline-block;
  position: relative;
  text-decoration: none;
}

.breadcrumb-links a i {
  margin-right: 5px;
}

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

.breadcrumb-switch {
  margin-left: auto;
}

.breadcrumb-links span:hover a:after {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.breadcrumb-links span a:after {
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
    Breadcrumb Theme
-----------------------*/
.breadcrumb-theme {
  &.dark {
    background: var(--body-background);
  }

  &.light {
    background: var(--body-background);
  }
}

.breadcrumb-links {
  &.dark {
    background: var(--body-background);
  }

  &.light {
    background: var(--body-background);
  }

  &.dark a {
    color: var(--head-text);
  }

  &.light a {
    color: var(--head-text);
  }

  &.dark span {
    color: var(--breadcrumb-text);
  }

  &.light span {
    color: var(--breadcrumb-text);
  }

  &.dark span.active {
    color: var(--breadcrumb-text-active);
  }

  &.light span.active {
    color: var(--breadcrumb-text-active);
  }
}
</style>
