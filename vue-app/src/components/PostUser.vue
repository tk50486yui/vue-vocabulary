<template>
  <div>
    <h1>{{ userId }}</h1>
    <ol>
      <li v-for="post in words" :key="post.id">
        <h3>{{ post.ws_name }}</h3>
        <p>{{ post.ws_definition }}</p>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PostUser',
  computed: {
    ...mapGetters('WordsStore', ['words']),
    userId () {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions('WordsStore', ['fetch'])
  },
  async created () {
    await this.fetch()
  }
}
</script>
