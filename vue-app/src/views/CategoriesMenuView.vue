<template>
  <div class="sidebar__categories">
    <div class="section-title d-flex justify-content-between align-items-center" :class="this.$theme">
      <h4>詞組類別</h4>
      <div class="button-container">
        <PlusBtn class="button-container" @click="visible=true"/>
        <RefreshBtn class="button-container btn-secondary" :spin="SyncOutlinedSpin" @click="refresh"/>
      </div>
    </div>
    <div class="collapse-theme" :class="this.$theme">
      <!--  重整區塊  -->
      <a-spin :spinning="spinning">
        <!--  主摺疊  -->
        <a-collapse v-model:activeKey="activeKey">
          <!--  子摺疊區塊  -->
          <a-collapse-panel key="1">
              <div class="menu-scroll">
                  <!--  類別最頂層 -->
                  <a-menu mode="inline">
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
          </a-collapse-panel>
        </a-collapse>
      </a-spin>
    </div>
  </div>
  <p></p>
  <!-- Modal  -->
  <div class="cate-menu-modal" ref="cateMod" :class="this.$theme">
    <a-modal v-model:visible="visible" :footer="null" :getContainer = '()=>$refs.cateMod'>
      <template #title >
      <div class="modal-head-text" :class="this.$theme">新增分類</div>
      </template>
      <p></p>
      <a-form
        ref="formRef"
        :model="formState"
        :validate-messages="validateMsg"
        @finish="onFinish">
        <a-form-item class="input-theme" :class="this.$theme" :name="['category', 'cate_name']" :rules="[{ required: true }]">
          <a-textarea  v-model:value="formState.category.cate_name"  placeholder="類別名稱" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item :name="['category', 'cate_parent_id']">
          <CategoriesTreeSelect  placeholder="選擇分類層級" size="large" ref="treeSelect"
            v-model:value="formState.category.cate_parent_id"
            @change="handleTreeSelectChange"/>
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
              <a-button type="primary" html-type="submit" :loading="confirmLoading">Submit</a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import PlusBtn from '@/components/button/PlusBtn.vue'
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

export default {
  name: 'CategoriesMenuView',
  components: {
    TreeCategoriesMenu,
    RefreshBtn,
    PlusBtn,
    CategoriesTreeSelect
  },
  computed: {
    ...mapGetters('CategoriesStore', ['categories']),
    ...mapState('Theme', ['$theme'])
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
      this.formState.category.cate_parent_id = typeof value !== 'undefined' ? value : null
    },
    resetForm () {
      this.formState.category.cate_parent_id = null
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

    const formState = reactive({
      category: {}
    })

    const { categoryForm } = mapGetters('CategoriesStore', ['categoryForm'])

    onMounted(() => {
      formState.category = { ...categoryForm }
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

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

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

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #ca1515;
  content: "";
}

.cate-menu-modal {
  /* modal head */
  &.dark :deep(.ant-modal-header){
    background:var(--head-background);
    color:var(--head-text);
  }

  &.light :deep(.ant-modal-header){
    background:var(--head-background);
    color:var(--head-text);
  }

  /* modal body */
  &.dark :deep(.ant-modal-content){
    background:var(--body-background);
  }

  &.light :deep(.ant-modal-content){
    background:var(--body-background);
  }

}
.modal-head-text  {
  &.dark{
    color:var(--head-text);
  }

  &.light{
    color:var(--head-text);
  }
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
