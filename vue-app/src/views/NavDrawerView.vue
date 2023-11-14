<template>
   <nav class="drawer__menu">
        <ul class="nav-menu">
            <li>
                <router-link :to="{ name: 'wordsGrid' }">
                    <div class="dropdown-container">
                        單字
                        <CaretDownOutlined />
                    </div>
                </router-link>
                <ul class="dropdown">
                    <li><router-link :to="{ name: 'wordsGrid' }">單字總覽</router-link></li>
                    <li><router-link :to="{ name: 'words' }">單字表</router-link></li>
                    <li><router-link :to="{ name: 'wordsAdd' }">單字新增</router-link></li>
                </ul>
            </li>
            <li>
                <router-link :to="{ name: 'articles' }">文章</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'categories' }">類別</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'tags' }">標籤</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'wordsGroups' }">群組</router-link>
            </li>
        </ul>
    </nav>
</template>
<script>
import { mapState } from 'vuex'
import { CaretDownOutlined } from '@ant-design/icons-vue'
export default {
  name: 'NavDrawerView',
  components: {
    CaretDownOutlined
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {

  },
  setup () {
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.drawer__menu ul li {
    list-style: none;
}
.drawer__menu{
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

</style>
