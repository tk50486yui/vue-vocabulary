<template>
    <template v-if="Ready">
        <div class="demo-color-block">
            <span class="demonstration">
                <a-tag :style="
                        'background:' + this.selectedBackground
                         + ';color:'+ this.selectedColor
                        +';border-color:'+ this.selectedBorder">
                    With default value
                </a-tag>
            </span>
            <span class="main-body" :class="$theme">
                背景：
                <el-color-picker @active-change="activeBackground" size="large" v-model="this.selectedBackground" show-alpha />
                文字：
                <el-color-picker @active-change="activeColor" size="large" v-model="this.selectedColor" show-alpha />
                邊框：
                <el-color-picker @active-change="activeBorder" size="large" v-model="this.selectedBorder" show-alpha />
            </span>
            <a-button class="btn btn-primary btn-outline-light btn-sm button-add"
                    @click="onFinish"
                    :loading="confirmLoading"
            >
                儲存顏色
            </a-button>
        </div>
        <p></p>
        <div class="table-theme" :class="$theme">
            <a-table :dataSource="this.tagsColorArray"
                :columns="columns"
                :scroll="{ y: 600 }"
                :indentSize="12"
            >
            <template #bodyCell="{ column, record }">
                <!-- tc_color -->
                <template v-if="['tc_color'].includes(column.dataIndex)">
                    <template v-if="editTableData[record.id]">
                        <div>
                            <CheckOutlined class="button-edit-check" @click="onEditFinish(record)"/>
                            <CloseOutlined class="button-edit-close" @click="cancel(record)"/>
                            #{{ record.id }}
                            <span style="margin-left: 16px;">
                                <a-tag :style="
                                        'background:' + editTableData[record.id]['tc_background']
                                        + ';color:'+ editTableData[record.id]['tc_color']
                                        +';border-color:'+ editTableData[record.id]['tc_border']">
                                    With default value
                                </a-tag>
                            </span>
                            背景：
                            <el-color-picker @active-change="(value) => activeBackground(value, record.id)" size="large" v-model="editTableData[record.id]['tc_background']" show-alpha />
                            文字：
                            <el-color-picker @active-change="(value) => activeColor(value, record.id)" size="large" v-model="editTableData[record.id]['tc_color']" show-alpha />
                            邊框：
                            <el-color-picker @active-change="(value) => activeBorder(value, record.id)" size="large" v-model="editTableData[record.id]['tc_border']" show-alpha />
                        </div>
                    </template>
                    <template v-else>
                        <div class="column-container">
                            <EditOutlined class="button-edit" @click="edit(record)" />
                            #{{ record.id }}
                            <span style="margin-left: 16px;">
                                <a-tag :style="
                                        'background:' + record.tc_background
                                        + ';color:'+ record.tc_color
                                        +';border-color:'+ record.tc_border">
                                    With default value
                                </a-tag>
                            </span>
                            <DeleteBtn @confirm="onDelete(record.id)"/>
                        </div>
                    </template>
                </template>
            </template>
            </a-table>
        </div>
    </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import DeleteBtn from '@/components/button/DeleteBtn.vue'

export default {
  name: 'TagsColorView',
  components: {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteBtn
  },
  computed: {
    ...mapGetters('TagsColorStore', ['tagsColorArray']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsColorStore', ['fetch', 'add', 'update', 'deleteById']),
    async onFinish () {
      try {
        this.formState.tagColor.tc_color = this.selectedColor
        this.formState.tagColor.tc_background = this.selectedBackground
        this.formState.tagColor.tc_border = this.selectedBorder
        this.confirmLoading = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.add(this.formState.tagColor)
        await this.fetch()
        this.editDataSource = this.tagsColorArray
        this.selectedBackground = 'rgb(43, 17, 24)'
        this.selectedColor = 'rgb(255, 214, 214)'
        this.selectedBorder = 'rgb(215, 128, 150)'
        this.confirmLoading = false
      } catch (error) {}
    },
    async onEditFinish (record) {
      try {
        const editData = await this.save(record)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.update({ id: editData.id, data: editData })
        await this.fetch()
        this.editDataSource = this.tagsColorArray
        this.cancel(record)
      } catch (error) {}
    },
    async onDelete (id) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.deleteById(id)
        await this.fetch()
      } catch (error) {}
    },
    activeBackground (value, id) {
      if (id) {
        this.editTableData[id].tc_background = value
      } else {
        this.selectedBackground = value
      }
    },
    activeColor (value, id) {
      if (id) {
        this.editTableData[id].tc_color = value
      } else {
        this.selectedColor = value
      }
    },
    activeBorder (value, id) {
      if (id) {
        this.editTableData[id].tc_border = value
      } else {
        this.selectedBorder = value
      }
    }
  },
  async created () {
    try {
      await this.fetch()
      this.editDataSource = this.tagsColorArray
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const editDataSource = ref()
    const editTableData = reactive({})
    const confirmLoading = ref(false)
    const selectedBackground = ref('rgb(43, 17, 24)')
    const selectedColor = ref('rgb(255, 214, 214)')
    const selectedBorder = ref('rgb(215, 128, 150)')
    const formState = reactive({
      tagColor: {}
    })

    const edit = (record) => {
      editTableData[record.id] = cloneDeep(editDataSource.value.filter(item => record.id === item.id)[0])
    }

    const save = async (record) => {
      return editTableData[record.id]
    }

    const cancel = (record) => {
      delete editTableData[record.id]
    }

    const columns = [
      {
        dataIndex: 'operation',
        width: '10%',
        fixed: true
      },
      {
        dataIndex: 'tc_color',
        width: '90%'
      }
    ]

    return {
      Ready,
      columns,
      selectedColor,
      selectedBackground,
      selectedBorder,
      formState,
      confirmLoading,
      editDataSource,
      editTableData,
      edit,
      save,
      cancel
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.demo-color-block .demonstration {
  margin-right: 16px;
}

.column-container{
  display: flex;
  align-items: center;
}

.button-add{
    margin-left: 32px;
}

.button-edit{
  color:#ec5ef4;
  padding-right: 6px;
}

.button-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-edit-check{
  margin-right: 10px;
  color:#00DB00;
}

.button-edit-close{
  margin-left: auto;
  color:#EA0000;
  padding-right: 6px;
}
</style>
