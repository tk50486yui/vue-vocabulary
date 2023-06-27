<template>
    <template v-if="Ready">
        <div class="descriptions-theme" :class="this.$theme">
            <h3><router-link :to="{ name: 'wordsGrid' }"> back </router-link></h3>
            <p></p>
            <a-descriptions
                bordered
                :column="{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }"
            >
                <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
                <a-descriptions-item label="Billing">Prepaid</a-descriptions-item>
                <a-descriptions-item label="Time">18:00:00</a-descriptions-item>
                <a-descriptions-item label="Amount">$80.00</a-descriptions-item>
                <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
                <a-descriptions-item label="Official">$60.00</a-descriptions-item>
                <a-descriptions-item label="Config Info">
                Data disk type: MongoDB
                <br />
                Database version: 3.4
                <br />
                Package: dds.mongo.mid
                <br />
                Storage space: 10 GB
                <br />
                Replication factor: 3
                <br />
                Region: East China 1
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </template>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'WordDetailsView',
  components: {

  },
  computed: {
    ...mapGetters('WordsStore', ['words']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['fetch'])
  },
  async created () {
    try {
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)

    return {
      Ready
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.keyword-text{
    color:$keyword-color;
}
</style>
