# vue-vocabulary

使用 Vue 3 進行前端頁面設計。

搭配後端 API：

[Laravel 版本（新）](https://github.com/tk50486yui/laravel-vocabulary.git)

[Slim 版本（舊）](https://github.com/tk50486yui/slim-vocabulary.git)

----
## Vue 3.2.3

使用 Typescript 撰寫 Vue 3，搭配 Vite 及 Vuex 進行前端開發。

----
## Node 18.15.0

``` 
    vue
    vite
    vue-router
    vuex
    typescript
    axios

``` 
----
## 目錄架構
```    
+ vue-vocabulary
    │
    └─ src                //  主程式目錄
        ├─
        ├─ api            //  定義 API 與攔截器
        ├─ assets         //  素材
        ├─ components     //  Vue 組件 (.vue) (.ts)
        ├─ interfaces     //  宣告 interface 型別
        ├─ libs           //  函式庫
        ├─ plugins        //  定義插件
        ├─ repositories   //  API 接口
        ├─ router         //  Vue 路由控制
        ├─ stores         //  Vuex 資料流
        │   └─modules     //  負責 repository 的資料輸入輸出
        ├─ views          //  Vue 組件 (.vue)
        ├─ App.vue        //  Vue 根組件
        └─ main.ts        //  主程式入口
```

----
## 版面樣式

基礎版型是使用 [Colorlib](https://colorlib.com/) 所提供的樣板，並進行響應式設計，整體呈現以網頁為主。

----
## 版面元件

使用非常多的 [ant-design-vue](https://www.antdv.com/docs/vue/introduce) （v4.x）元件。

----
## 主題顏色

網站主要顏色為深色模式，可切換成明亮模式。主題顏色是透過 SCSS 來管理切換。
