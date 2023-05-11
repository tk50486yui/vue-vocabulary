<template>
  <div>
    <!-- Section Begin -->
    <section class="shop spad">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-3">
            <CategoriesSidebar />
          </div>
          <div class="col-lg-9 col-md-9">
            <nav>
              <router-link :to="{ name: 'about' }">About</router-link>
            </nav>
            <ul>
              <li v-for="i in 2" :key="i">
                <router-link :to="{ name: 'users', params: { id: i } }">User {{ i }}</router-link>
              </li>
            </ul>
            <router-view />
          </div>
        </div>
      </div>
    </section>
    <!-- Section End -->
  </div>
</template>
<script>
import CategoriesSidebar from '@/components/CategoriesSidebar.vue'

export default {
  name: 'App',
  components: {
    CategoriesSidebar
  }
}
</script>
