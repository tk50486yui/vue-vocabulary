# vue-vocabulary

透過 Typescript 撰寫 Vue 3，並使用 Vite 及 Vuex 進行前端開發，最後部署於 Docker 環境。

搭配後端 API：

[Laravel 版本（新）](https://github.com/tk50486yui/laravel-vocabulary.git)

[Slim 版本（舊）](https://github.com/tk50486yui/slim-vocabulary.git)

----
## 系統簡介

日文單字顯示介面，配合後端及資料庫存放資料，並透過標籤、類別、文章及群組管理已儲存的生字，實現彈性備忘的功能。

[簡易 Demo](https://vue.yuex.site/vue-vocabulary/)

----
## 開發環境

``` 
    vue3
    vite
    vue-router 
    vuex
    typescript
    axios
``` 
----
## Docker

``` 
docker-compose build
``` 

``` 
docker-compose up -d
``` 
----
## 目錄架構
```    
+ vue-vocabulary
    ├─ nginx              //  nginx.conf
    └─ src                //  主程式目錄
        ├─ api            //  宣告 API 與攔截器
        ├─ assets
        ├─ components     //  Vue Component
        ├─ interfaces     //  Interface
        ├─ libs           //  Library
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

[Ant Design Vue](https://www.antdv.com/docs/vue/introduce) （v4.x）

[Element Plus](https://element-plus.org/en-US/)

----
### 版面樣式

基礎版型是使用 [Colorlib](https://colorlib.com/) 所提供的樣板，並進行響應式設計，整體呈現以網頁為主。

----
### 主題顏色

網站主要顏色為深色模式，可切換成明亮模式。主題顏色是透過 SCSS 來管理切換。
