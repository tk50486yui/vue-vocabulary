<template>
    <div class="card-body">
        <ul>
            <li v-for="item in data.children" :key="item.id">
              <!-- if -->
              <a v-if="item.children && item.children.length">
                <div class="card-heading">
                  <a data-toggle="collapse" :data-target="'#collapse' + item.id">{{ item.cate_name }}</a>
                </div>
              </a>
              <!-- if end -->
              <!-- else -->
              <a v-else>
                <router-link :to="{ name: 'wordsByCateID', params: { cateID: item.id }}">
                  {{ item.cate_name }}
                </router-link>
              </a>
              <!-- else end -->
              <!-- if -->
              <div v-if="item.children && item.children.length"
                :id="'collapse' + item.id" class="collapse" :data-parent="'#collapse' + data.id">
                  <TreeCategories :data="item" :parent-id="data.id"></TreeCategories>
              </div>
              <!-- if end -->
            </li>
        </ul>
    </div>
</template>

<script>
import TreeCategories from '@/components/TreeCategories.vue'
export default {
  name: 'TreeCategories',
  props: {
    data: Object,
    parentId: Number
  },
  components: {
    TreeCategories
  }
}
</script>
