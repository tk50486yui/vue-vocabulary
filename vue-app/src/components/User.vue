<template>
  <div>
    <h1>User: {{ myid }} - {{ userInfo?.name }}</h1>
    <div>username: @{{ userInfo.username }}</div>
    <div>email: {{ userInfo.email }}</div>
    <div>phone: {{ userInfo.phone }}</div>
    <hr />

    Show
    <router-link :to="{ name: 'postsChild', params: { id: myid } }">
      /users/{{ myid }}/posts
    </router-link>

    <hr />
    <!-- 等等要給 Post.vue 的位置 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    myid () {
      return this.$route.params.id
    }
  },
  watch: {
    myid: async function (val) {
      this.userInfo = await this.fetchID(val)
    }
  },
  methods: {
    async fetchID (id) {
      return await fetch('https://jsonplaceholder.typicode.com/users/' + id)
        .then((response) => response.json())
        .then((json) => json)
    }
  },
  async created () {
    this.userInfo = await this.fetchID(this.myid)
  }
}
</script>
