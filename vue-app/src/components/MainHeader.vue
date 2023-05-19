<template>
    <!-- Header Section Begin -->
    <div class="offcanvas-menu-overlay"></div>
        <div class="offcanvas-menu-wrapper">
            <div class="offcanvas__close">+</div>
            <ul class="offcanvas__widget">
                <li><span class="icon_search search-switch"></span></li>
                <li><a href="#"><span class="icon_heart_alt"></span>
                    <div class="tip">2</div>
                </a></li>
                <li><a href="#"><span class="icon_bag_alt"></span>
                    <div class="tip">2</div>
                </a></li>
            </ul>
            <div class="offcanvas__logo">
                <a href="./shop.html"><img src="templates/img/wordlogo.png" alt=""></a>
            </div>
            <div id="mobile-menu-wrap"></div>
        </div>
        <div id="main-header">
            <header class="header">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xl-3 col-lg-2">
                            <div class="header__logo">
                                <a href="./shop.html"><img src="templates/img/wordlogo.png" alt=""></a>
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-7">
                            <nav class="header__menu">
                                <ul>
                                    <li><a href="./index.html">Home</a></li>
                                    <li class="active"><a href="./shop.html">單字表</a></li>
                                    <li><a href="#">Pages</a>
                                        <ul class="dropdown">
                                            <li><a href="./product-details.html">Product Details</a></li>
                                            <li><a href="./shop-cart.html">Shop Cart</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="./blog.html">Blog</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div class="col-lg-3">
                            <div class="header__right">
                                <ul class="header__right__widget">
                                    <li><span class="icon_search search-switch"></span></li>
                                    <li>
                                        <a href="#"><span class="icon_bag_alt"></span>
                                            <div class="tip">1</div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="canvas__open">
                        <i class="fa fa-bars"></i>
                    </div>
                </div>
            </header>
        </div>
    <!-- Header Section End -->

</template>
<script>

export default {
  name: 'MainHeader'
}
</script>
<link rel="stylesheet" href="<%= BASE_URL %>templates/css/style.css" type="text/css">
