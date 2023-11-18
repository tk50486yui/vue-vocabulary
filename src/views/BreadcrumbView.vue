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
            <template v-if="!this.activeHome && this.activeRoute != ''">
              <span class="breadcrumb-separator">
                <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs" />
              </span>
              <span class="active">
                {{ this.activeRoute }}
              </span>
            </template>
            <div class="breadcrumb-switch switch-theme" :class="$theme">
              <a-switch :checked="$theme === 'dark'" @change="changeTheme">
                <template #checkedChildren>
                  <el-icon><el-Moon /></el-icon>
                </template>
                <template #unCheckedChildren>
                  <el-icon><el-Sunny /></el-icon>
                </template>
              </a-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BreadcrumbView',
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('Theme', ['updateTheme']),
    changeTheme(checked) {
      const theme = checked ? 'dark' : 'light'
      this.updateTheme(theme)
    },
    getCurrentRoute() {
      const { name } = this.$route
      this.activeHome = false
      switch (name) {
        case 'wordsAdd':
          this.activeRoute = '單字新增'
          break
        case 'words':
          this.activeRoute = '單字表'
          break
        case 'wordsGrid':
        case 'wordDetails':
          this.activeRoute = '單字總覽'
          break
        case 'articles':
        case 'articlesContent':
          this.activeRoute = '文章總覽'
          break
        case 'categories':
          this.activeRoute = '類別列表'
          break
        case 'tags':
          this.activeRoute = '標籤列表'
          break
        case 'wordsGroups':
        case 'wordsGroupsDetails':
          this.activeRoute = '群組列表'
          break
        default:
          this.activeRoute = ''
          this.activeHome = true
          break
      }
    }
  },
  async created() {
    this.getCurrentRoute()
  },
  watch: {
    $route: function (val) {
      this.getCurrentRoute()
    }
  },
  setup() {
    const activeRoute = ref('')
    const activeHome = ref(false)
    return {
      activeRoute,
      activeHome
    }
  }
}
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
