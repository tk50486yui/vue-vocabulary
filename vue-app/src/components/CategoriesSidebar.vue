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
                @click="visible=true">
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
                                <div :data-target="'#collapse' + data.id" data-toggle="collapse">
                                 <router-link class="text-primary card-router-link"
                                    :to="{ name: 'wordsByCateID', params: { cateID: data.id }}">
                                    {{ data.cate_name }}
                                  </router-link>
                                </div>
                            </div>
                            <!--  第二層以後區域 begin -->
                            <div :id="'collapse' + data.id" class="collapse" data-parent="#accordionExample">
                                <TreeCategories :data="data"></TreeCategories>
                            </div>
                            <!--  第二層以後區域 end   -->
                          </template>
                          <template v-else>
                            <div>
                              <router-link class="text-dark"
                                :to="{ name: 'wordsByCateID', params: { cateID: data.id }}">
                                {{ data.cate_name }}
                              </router-link>
                            </div>
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
  <a-modal v-model:visible="visible" title="新增分類" :footer="null">
    <p></p>
    <a-form
      ref="formRef"
      :model="formState"
      :validate-messages="validateMsg"
      @finish="onFinish">
      <a-form-item :name="['category', 'cate_name']" :rules="[{ required: true }]">
        <a-textarea  v-model:value="formState.category.cate_name"  placeholder="類別名稱" :auto-size="{ minRows: 3}" allow-clear />
      </a-form-item>
      <p></p>
      <a-form-item :name="['category', 'cate_parent_id']">
        <CategoriesTreeSelect v-model="formState.category.cate_parent_id" ref="treeSelect" @update:modelValue="handleTreeSelectChange"/>
      </a-form-item>
      <a-form-item>
        <div class="modal-button-container">
          <div class="modal-clear-button">
              <a-button @click="resetForm" danger>Clear</a-button>
          </div>
          <div class="modal-cancel-button">
              <a-button @click="visible=false">Cancel</a-button>
          </div>
          <div class="modal-submit-button">
            <a-button class="" type="primary" html-type="submit" :loading="confirmLoading">Submit</a-button>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { ref, reactive } from 'vue'
import TreeCategories from '@/components/TreeCategories.vue'
import { SyncOutlined, PlusCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

const formState = reactive({
  category: {
    cate_name: '',
    cate_parent_id: '',
    cate_level: '',
    cate_sort_order: ''
  }
})

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const validateMsg = {
  required: 'required'
}

export default {
  name: 'CategoriesSidebar',
  components: {
    TreeCategories,
    SyncOutlined,
    PlusCircleFilled,
    CategoriesTreeSelect
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categories'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch']),
    ...mapActions('CategoriesStore', {
      addCategory: 'add'
    }),
    async onFinish (values) {
      try {
        this.confirmLoading = true
        console.log(values.category)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addCategory(values.category)
        this.resetForm()
        this.confirmLoading = false
        this.visible = false
        this.refresh()
      } catch (error) {
        this.confirmLoading = false
      }
    },
    async refresh () {
      try {
        this.SyncOutlinedSpin = true
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 1500))
        await this.fetch()
        this.SyncOutlinedSpin = false
        this.spinning = false
      } catch (error) {
        this.SyncOutlinedSpin = false
        this.spinning = false
      }
    },
    handleTreeSelectChange (value) {
      this.formState.category.cate_parent_id = typeof value !== 'undefined' ? value : ''
    },
    resetForm () {
      this.$refs.treeSelect.handleClear()
      this.formRef.resetFields()
    }
  },
  async created () {
    await this.fetch()
  },
  setup () {
    const activeKey = ref(['1'])
    const spinning = ref(false)
    const SyncOutlinedSpin = ref(false)

    const modal = {
      visible: ref(false),
      confirmLoading: ref(false),
      formRef: ref(),
      formState,
      layout,
      validateMsg
    }

    return {
      activeKey,
      spinning,
      SyncOutlinedSpin,
      ...modal
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

.card-router-link {
  display: inline !important;
  text-decoration: none;
}

.modal-button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

.modal-clear-button {
  margin-right: auto;
}

.modal-cancel-button {
  margin-right: 10px;
}

.modal-submit-button {
  margin-left: 10px;
}
</style>
