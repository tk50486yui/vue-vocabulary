<template>
    <button type="button" class="btn btn-dark btn-outline-light btn-sm float-end me-md-1">
        <PlusCircleFilled />
    </button>
</template>

<script>
import { PlusCircleFilled } from '@ant-design/icons-vue'
export default {
  name: 'PlusBtn',
  props: {
    spin: Boolean
  },
  components: {
    PlusCircleFilled
  }
}
</script>
