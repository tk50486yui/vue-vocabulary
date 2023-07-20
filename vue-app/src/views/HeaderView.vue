<template>
<div>
    <header class="header" :class="[this.$theme]">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xl-3 col-lg-2">
                    <div class="header__logo">
                        <router-link :to="{ name: 'words' }">
                            <img :src="require('@/assets/logo.png')" />
                        </router-link>
                    </div>
                </div>
                <div class="col-xl-6 col-lg-7">
                    <nav class="header__menu" >
                        <ul class="nav-menu" :class="[this.$theme]">
                            <li>
                                <router-link :to="{ name: 'home' }">首頁</router-link>
                            </li>
                            <li class="active">
                                <router-link :to="{ name: 'words' }">表格</router-link>
                            </li>
                            <li><router-link :to="{ name: 'tags' }">標籤</router-link></li>
                            <li><router-link :to="{ name: 'articles' }">文章</router-link></li>
                            <li><router-link :to="{ name: 'wordsGroupsList' }">群組</router-link></li>
                            <li><router-link :to="{ name: 'wordsGrid' }">單字</router-link></li>
                            <li><router-link :to="{ name: 'words' }">測試</router-link>
                                <ul class="dropdown">
                                    <template v-for="i in 2" :key="i">
                                        <li>
                                            <router-link :to="{ name: 'users', params: { id: i } } ">
                                                User {{ i }}
                                            </router-link>
                                        </li>
                                    </template>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="col-lg-3">
                    <div class="header__right">
                        <ul class="header__right__widget">
                            <li><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="canvas__open">
                <font-awesome-icon :icon="['fas', 'bars']" />
            </div>
        </div>
    </header>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'HeaderView',
  computed: {
    ...mapState('Theme', ['$theme'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
/*---------------------
    Header
-----------------------*/

.canvas__open {
    display: none;
}

/*---------------------
    Header Logo
-----------------------*/
.header__logo {
    padding: 32px 0;
}

.header__logo a {
    display: inline-block;
}

/*---------------------
    Header Menu
-----------------------*/
.header__menu {
    padding: 30px 0 27px;
}

.header__menu ul li {
    list-style: none;
    display: inline-block;
    margin-right: 40px;
    position: relative;
}
.header__menu ul li.active a:after {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
}

.header__menu ul li:hover a:after {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
}

.header__menu ul li:hover .dropdown {
    top: 27px;
    opacity: 1;
    visibility: visible;
}

.header__menu ul li:last-child {
    margin-right: 0;
}

.header__menu ul li .dropdown {
    position: absolute;
    left: 0;
    top: 56px;
    width: 150px;
    background: #111111;
    text-align: left;
    padding: 2px 0;
    z-index: 9;
    opacity: 0;
    visibility: hidden;
    -webkit-transition: all, 0.3s;
    -o-transition: all, 0.3s;
    transition: all, 0.3s;
}

.header__menu ul li .dropdown li {
    display: block;
    margin-right: 0;
}

.header__menu ul li .dropdown li a {
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    padding: 8px 20px;
    text-transform: capitalize;
}

.header__menu ul li .dropdown li a:after {
    display: none;
}

.header__menu ul li a:after {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #ca1515;
    content: "";
    -webkit-transition: all, 0.5s;
    -o-transition: all, 0.5s;
    transition: all, 0.5s;
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
}

/*---------------------
    Header Right
-----------------------*/
.header__right {
    text-align: right;
    padding: 30px 0 27px;
}
.header__right__widget {
    display: inline-block;
}

.header__right__widget li {
    list-style: none;
    display: inline-block;
    font-size: 18px;
    color: #111111;
    margin-right: 20px;
    cursor: pointer;
}

.header__right__widget li:last-child {
    margin-right: 0;
}

.header__right__widget li a {
    font-size: 18px;
    color: #111111;
    position: relative;
}

.header__right__widget li a .tip {
    position: absolute;
    right: -12px;
    top: -11px;
    height: 18px;
    width: 18px;
    background: #111111;
    font-size: 10px;
    font-weight: 500;
    color: #ffffff;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
}

/*---------------------
    @media
-----------------------*/
@media only screen and (min-width: 1600px) and (max-width: 1900px) {
    .header {
        padding: 0 85px;
    }
}

@media only screen and (min-width: 1200px) and (max-width: 1599px) {
    .header__menu ul li {
        margin-right: 20px;
    }
    .header {
        padding: 0 30px;
    }
}

/* Medium Device = 1200px */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
    .header__menu ul li {
        margin-right: 20px;
    }
}

/* Tablet Device = 768px */
@media only screen and (min-width: 768px) and (max-width: 991px) {
    .canvas__open {
        display: block;
        font-size: 22px;
        color: #222;
        height: 35px;
        width: 35px;
        line-height: 35px;
        text-align: center;
        border: 1px solid #323232;
        border-radius: 2px;
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: 24px;
    }
    .header__menu {
        display: none;
    }
    .header__right {
        display: none;
    }
}
/* Wide Mobile = 480px */
@media only screen and (max-width: 767px) {
    .canvas__open {
        display: block;
        font-size: 22px;
        color: #222;
        height: 35px;
        width: 35px;
        line-height: 35px;
        text-align: center;
        border: 1px solid #323232;
        border-radius: 2px;
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: 24px;
    }
    .header__menu {
        display: none;
    }
    .header__right {
        display: none;
    }
}
</style>
