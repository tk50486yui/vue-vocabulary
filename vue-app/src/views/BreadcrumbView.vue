<template>
    <!-- Breadcrumb -->
    <div class="breadcrumb-theme" :class="$theme">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb-links" :class="$theme">
                        <span>
                            <router-link :to="{ name: 'home' }">
                                <font-awesome-icon :icon="['fas', 'house']" />  首頁
                            </router-link>
                        </span>
                        <template v-if="!this.activeHome">
                            <span class="breadcrumb-separator">
                                <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs"/>
                            </span>
                            <span class="active">
                                {{  this.activeRoute }}
                            </span>
                        </template>
                        <div class="breadcrumb-switch">
                            <a-switch
                            :checked="this.$theme === 'dark'"
                            checked-children="深色主題"
                            un-checked-children="亮色主題"
                            @change="changeTheme"
                            />
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
    changeTheme (checked) {
      const theme = checked ? 'dark' : 'light'
      this.updateTheme(theme)
    },
    async created () {
      this.getCurrentRoute()
    },
    getCurrentRoute () {
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
          this.activeRoute = '單字總覽'
          break
        case 'wordDetails':
          this.activeRoute = '單字詳細說明'
          break
        case 'articles':
          this.activeRoute = '文章總覽'
          break
        case 'articlesContent':
          this.activeRoute = '文章內容'
          break
        case 'categories':
          this.activeRoute = '類別列表'
          break
        case 'categoriesDrag':
          this.activeRoute = '類別順序調整'
          break
        case 'tags':
          this.activeRoute = '標籤列表'
          break
        case 'tagsDrag':
          this.activeRoute = '標籤順序調整'
          break
        case 'wordsGroups':
          this.activeRoute = '群組列表'
          break
        case 'wordsGroupsDetails':
          this.activeRoute = '群組詳細說明'
          break
        default:
          this.activeRoute = ''
          this.activeHome = true
          break
      }
    }
  },
  watch: {
    $route: function (val) {
      this.getCurrentRoute()
    }
  },
  setup () {
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
.breadcrumb-links{
    display: flex;
}
.breadcrumb-links a{
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
    content: "";
    -webkit-transition: all, 0.5s;
    -o-transition: all, 0.5s;
    transition: all, 0.5s;
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
}

</style>
