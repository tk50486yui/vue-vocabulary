<template>
    <div>
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
                <div class="menu-scroll">
                    <!--  類別最頂層 -->
                    <a-menu mode="inline" theme="light">
                        <!--  第一層  for 顯示  -->
                        <template v-for="data in categories" :key="data.id">
                            <template v-if="data.children && data.children.length">
                                <a-sub-menu :key="data.id" :title="data.cate_name">
                                    <TreeCategoriesMenu :data="data" />
                                </a-sub-menu>
                            </template>
                            <template v-else>
                                <a-menu-item :key="data.id"> {{ data.cate_name }}</a-menu-item>
                            </template>
                        </template>
                        <!--  第一層  for 結束  -->
                    </a-menu>
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
import { ref, reactive, toRefs } from 'vue'
import { SyncOutlined, PlusCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
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
  name: 'CategoriesMenuView',
  components: {
    TreeCategoriesMenu,
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
        await new Promise(resolve => setTimeout(resolve, 1000))
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
    await this.refresh()
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

    const state = reactive({
      theme: 'dark',
      selectedKeys: ['1'],
      openKeys: ['sub1']
    })
    const changeTheme = checked => {
      state.theme = checked ? 'dark' : 'light'
    }

    return {
      activeKey,
      spinning,
      SyncOutlinedSpin,
      ...modal,
      ...toRefs(state),
      changeTheme
    }
  }
}
</script>

<style scoped>

.menu-scroll {
    position: relative;
    height: 350px;
    overflow: scroll
}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-title {
  margin-bottom: 8px !important;
}

.section-title h4 {
  color: #111111;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #ca1515;
  content: "";
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

.expanded {
  display: block;
}
</style>
