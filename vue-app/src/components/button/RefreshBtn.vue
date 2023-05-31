<template>
    <button type="button" class="btn btn-primary btn-outline-light btn-sm float-end me-md-3">
        <SyncOutlined :spin="spin"/>
    </button>
</template>

<script>
import { SyncOutlined } from '@ant-design/icons-vue'
export default {
  name: 'RefreshBtn',
  props: {
    spin: Boolean
  },
  components: {
    SyncOutlined
  }
}
</script>
