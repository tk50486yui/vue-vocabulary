<template>
  <footer class="footer" :class="$theme">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="footer__copyright__text" :class="$theme">
            <p>
              Copyright &copy; 2023 All rights reserved | This template is made with
              <i class="fa fa-heart" aria-hidden="true"></i> by
              <a href="https://colorlib.com" target="_blank">Colorlib</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.footer__copyright__text p {
  margin-bottom: 0;
}

.footer__copyright__text i {
  color: #ca1515;
}

.footer__copyright__text a:hover {
  color: #ca1515;
}

/*---------------------
    Footer Theme
-----------------------*/
.footer {
  margin-top: 360px;

  &.dark {
    background: var(--body-background);
  }

  &.light {
    background: var(--body-background);
  }
}

.footer__copyright__text {
  border-top: 1px solid #e1e1e1;
  padding: 18px 0 25px;
  text-align: center;

  &.dark {
    background: var(--body-background);
    color: var(--head-text);
  }

  &.light {
    background: var(--body-background);
    color: var(--head-text);
  }
}

.footer__copyright__text {
  &.dark a {
    color: var(--footer-a-text);
  }

  &.light a {
    color: var(--footer-a-text);
  }
}
</style>
