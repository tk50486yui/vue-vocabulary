<template>
  <div class="shop__sidebar">
      <div class="sidebar__categories">
          <div class="section-title">
              <h4>詞組類別</h4>
          </div>
          <div ddata-bs-spy="scroll" data-bs-offset="0" class="scrollspy-example" tabindex="0">
            <!--  類別最頂層  begin -->
            <div class="categories__accordion" id="accordionExample">
                <!--  第一層  for顯示區域 開始  -->
                <div class="accordion" v-for="data in categories" :key="data.id">
                    <div class="card">
                        <template v-if="data.children && data.children.length">
                          <div class="card-heading">
                              <router-link class="text-dark" data-toggle="collapse"
                              :data-target="'#collapse' + data.id"
                              :to="{ name: 'wordsByCateID', params: { cateID: data.id }}">
                                {{ data.cate_name }}
                              </router-link>
                          </div>
                          <!--  第二層以後區域 begin -->
                          <div :id="'collapse' + data.id" class="collapse" data-parent="#accordionExample">
                              <TreeCategories :data="data"></TreeCategories>
                          </div>
                          <!--  第二層以後區域 end   -->
                        </template>
                        <template v-else>
                          <router-link class="text-secondary" :to="{ name: 'wordsByCateID', params: { cateID: data.id }}">
                            {{ data.cate_name }}
                          </router-link>
                        </template>
                        <hr>
                    </div>
                </div>
                <!--  第一層  for顯示區域 結束  -->
            </div>
            <!-- 類別最頂層  end  -->
        </div>
      </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TreeCategories from '@/components/TreeCategories.vue'

export default {
  name: 'CategoriesSidebar',
  components: {
    TreeCategories
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categories'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch'])
  },
  async created () {
    await this.fetch()
  }
}
</script>
<style scoped>
.scrollspy-example {
    position: relative;
    height: 350px;
    overflow: auto;
}
</style>
