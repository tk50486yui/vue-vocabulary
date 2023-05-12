<template>
  <div>
    <h1>id: {{ id }} - {{ word.id }}</h1>
    <div>單字名稱: {{ word.ws_name }}</div>
    <div>中文定義: {{ word.ws_definition }}</div>
    <div>發音 / 假名: {{ word.ws_pronunciation }}</div>
    <hr />

    Show
    <router-link :to="{ name: 'postsChild', params: { id: id } }">
      /users/{{ id }}/posts
    </router-link>

    <hr />
    <!-- 等等要給 Post.vue 的位置 -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserView',
  computed: {
    id () {
      return this.$route.params.id
    },
    ...mapGetters('WordsStore', ['word'])
  },
  watch: {
    id: async function (val) {
      await this.fetchById(val)
    }
  },
  methods: {
    ...mapActions('WordsStore', ['fetchById'])
  },
  async created () {
    await this.fetchById(this.id)
  }
}
</script>
