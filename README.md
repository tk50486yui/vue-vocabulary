# vue-vocabulary

使用 Typescript 撰寫 Vue 3，並透過 Vite 和 Vuex 進行前端開發，最後在 Docker 環境中進行部署。

搭配後端 API：[Laravel 版本（新）](https://github.com/tk50486yui/laravel-vocabulary.git)

舊版 API：[Slim 版本（舊）](https://github.com/tk50486yui/slim-vocabulary.git)

----
### 系統簡介

系統主要目的是製作一套日文單字顯示介面，並與後端及資料庫協同工作，同時透過標籤、類別、文章及群組管理，實現已儲存生字的彈性備忘功能。

[簡易 Demo](https://vue.yuex.site/vue-vocabulary/)

----
### 開發工具

``` 
    vue3
    vite
    vue-router 
    vuex
    typescript
    axios
``` 
----
### Docker

``` bash
docker-compose build
``` 

``` bash
docker-compose up -d
``` 

``` bash
docker-compose exec vue-nginx sh
``` 

``` bash
npm install
npm run build
``` 
----
### 目錄架構
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
