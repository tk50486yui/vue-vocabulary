# VueProject

使用 Vue 進行頁面設計。

搭配後端：

[Laravel 版本](https://github.com/tk50486yui/laravel-project.git)

[Slim 版本](https://github.com/tk50486yui/SlimProject.git)

----
## Vue 3.2.3

使用 vue-cli 建立，搭配 vue-router 及 vuex 進行開發，並使用 eslint 規範。


----
## Node 18.15.0

``` 
    vue
    vue-router
    vuex
    axios
    ant-design-vue
    bootstrap
``` 

----
## 目錄架構
```    
  + public  // index
  + src     // 主程式目錄
    ├─api           // 宣告 api 與攔截器
    ├─assets        // 素材
    ├─components    // 定義各式組件 (.vue) (.js)
    ├─plugins       // plugin
    ├─repositories  // 取得資料 (.js)
    ├─router        // Vue 路由控制
    ├─stores        // 處理 repository 的資料並輸出 (vuex)
    │  └─modules
    ├─views         // 顯示頁面 (.vue)
    ├─App.vue       // 主頁面
    └─main.js       // 主程式
```

----
## 版面樣式

基礎版型是使用 [Colorlib](https://colorlib.com/) 所提供的樣板，並透過 bootstrap 5 進行響應式設計，整體設計以網頁為主。

----
## 版面元件

使用非常多的 [ant-design-vue](https://www.antdv.com/docs/vue/introduce-cn) （v3.x）元件。

----
## 主題顏色

網站主要顏色為深色模式，可切換成明亮模式。主題顏色是透過 SCSS 來管理切換。
