<template>
  <div>
    <template v-for="item in data.children" :key="item.id">
      <template v-if="item.children && item.children.length">
        <a-sub-menu :key="item.id">
            <template #title>
              <a @click="handleTagsFilter(item.id)" style="display: inline-block">
                <span class="dropdown-container">
                  {{ item.ts_name }}
                  <template v-if="this.$filtersTags.includes(item.id)">
                    <CheckOutlined :style="{ 'font-size':'10px'}" :rotate="10"/>
                  </template>
                </span>
              </a>
            </template>
            <TreeTagsMenu :data="item" />
        </a-sub-menu>
      </template>
      <template v-else>
        <a-menu-item :key="item.id">
          <a @click="handleTagsFilter(item.id)" style="display: inline-block">
            <span class="dropdown-container">
              # {{ item.ts_name }}
              <template v-if="this.$filtersTags.includes(item.id)">
                <CheckOutlined :style="{ 'font-size':'10px'}" :rotate="10"/>
              </template>
            </span>
          </a>
        </a-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
import { CheckOutlined } from '@ant-design/icons-vue'
export default {
  name: 'TreeTagsMenu',
  props: {
    data: Object,
    parentId: String
  },
  components: {
    TreeTagsMenu,
    CheckOutlined
  },
  computed: {
    ...mapState('Search', ['$filtersTags'])
  },
  methods: {
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Search', ['pushFiltersTags']),
    async handleTagsFilter (id) {
      await this.pushFiltersTags(id)
      this.updateSearchClass('word')
      if (this.$route !== 'wordsGrid') {
        this.$router.push({ name: 'wordsGrid' })
      }
    }
  }
}
</script>
<style scoped>

.dropdown-container{
  display: flex;
  align-items: center;
}
.card-router-link {
  display: inline !important;
}
</style>
