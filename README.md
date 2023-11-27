# vue-vocabulary

使用 Typescript 撰寫 Vue 3，搭配 Vite 及 Vuex 進行前端開發。

搭配後端 API：

[Laravel 版本（新）](https://github.com/tk50486yui/laravel-vocabulary.git)

[Slim 版本（舊）](https://github.com/tk50486yui/slim-vocabulary.git)

----
## 使用工具

``` 
    vue3
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
    └─ src                //  主程式目錄
        ├─ api            //  宣告 API 與攔截器
        ├─ assets
        ├─ components     //  Vue Component
        ├─ interfaces     //  Interface
        ├─ libs           //  函式庫
        ├─ plugins
        ├─ repositories   //  API 接口
        ├─ router
        ├─ stores         //  Vuex
        │   └─modules     //  Vuex 資料儲存區
        ├─ views          //  Vue Component
        ├─ App.vue        //  Root Component
        └─ main.ts        //  主程式入口
```

----
### 版面元件

使用非常多的 [ant-design-vue](https://www.antdv.com/docs/vue/introduce) （v4.x）元件。

----
### 版面樣式

基礎版型是使用 [Colorlib](https://colorlib.com/) 所提供的樣板，並進行響應式設計，整體呈現以網頁為主。

----
### 主題顏色

網站主要顏色為深色模式，可切換成明亮模式。主題顏色是透過 SCSS 來管理切換。
