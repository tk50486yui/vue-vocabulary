<template>
  <div class="shop__sidebar">
      <div class="sidebar__categories">
        <div class="section-title">
              <h4>詞組類別</h4>
              <button type="button" class="btn btn-secondary btn-outline-light btn-sm float-end me-md-1 button-container"
                @click="refresh">
                <SyncOutlined :spin="SyncOutlinedSpin"/>
              </button>
              <button type="button" class="btn btn-dark btn-outline-light btn-sm float-end me-md-1 button-container"
                @click="showModal">
                <PlusCircleFilled/>
              </button>
        </div>
        <!--  主摺疊  -->
        <a-collapse v-model:activeKey="activeKey">
          <!--  子摺疊區塊  -->
          <a-collapse-panel key="1">
          <!--  重整區塊  -->
          <a-spin :spinning="spinning">
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
          </a-spin>
          </a-collapse-panel>
        </a-collapse>
      </div>
  </div>
  <a-modal
      v-model:visible="visible"
      title="Title"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <p>{{ modalText }}</p>
    </a-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { ref } from 'vue'
import TreeCategories from '@/components/TreeCategories.vue'
import { SyncOutlined, PlusCircleFilled } from '@ant-design/icons-vue'

export default {
  name: 'CategoriesSidebar',
  components: {
    TreeCategories,
    SyncOutlined,
    PlusCircleFilled
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categories'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch']),
    async refresh () {
      try {
        this.SyncOutlinedSpin = true
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 1500))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.spinning = false
      } catch (error) {}
    }
  },
  async created () {
    await this.fetch()
  },
  setup () {
    const activeKey = ref(['1'])
    const spinning = ref(false)
    const SyncOutlinedSpin = ref(false)
    const modalText = ref('Content of the modal')
    const visible = ref(false)
    const confirmLoading = ref(false)
    const showModal = () => {
      visible.value = true
    }
    const handleOk = () => {
      modalText.value = 'The modal will be closed after two seconds'
      confirmLoading.value = true
      setTimeout(() => {
        visible.value = false
        confirmLoading.value = false
      }, 2000)
    }
    return {
      activeKey,
      spinning,
      SyncOutlinedSpin,
      modalText,
      visible,
      confirmLoading,
      showModal,
      handleOk
    }
  }
}
</script>

<style scoped>
.scrollspy-example {
    position: relative;
    height: 350px;
    overflow: auto;
}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-title {
  margin-bottom: 8px !important;
}

</style>
