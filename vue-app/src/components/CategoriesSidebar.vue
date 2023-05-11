<template>
    <div class="shop__sidebar">
        <div class="sidebar__categories">
            <div class="section-title">
                <h4>詞組類別</h4>
            </div>
            <!--  類別最頂層  begin -->
            <div class="categories__accordion" id="accordionExample">
                <!--  第一層  for顯示區域 開始  -->
                <div class="accordion" v-for="data in getCategories" :key="data.id">
                    <div class="card">
                        <div class="card-heading">
                            <a data-toggle="collapse" :data-target="'#collapse' + data.id">{{ data.cate_name }}</a>
                        </div>
                        <!--  第二層以後區域 begin -->
                        <div :id="'collapse' + data.id" class="collapse" data-parent="#accordionExample">
                            <TreeCategories :data="data"></TreeCategories>
                        </div>
                        <!--  第二層以後區域 end   -->
                        <hr>
                    </div>
                </div>
                <!--  第一層  for顯示區域 結束  -->
            </div>
            <!-- 類別最頂層  end  -->
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
    ...mapGetters('CategoriesStore', ['getCategories'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetchCategories'])
  },
  async created () {
    await this.fetchCategories()
  }
}
</script>
