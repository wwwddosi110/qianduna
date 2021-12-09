<template>
  <div id="app">
    <div>
      <router-view v-if="alive" />
    </div>
    <!-- 侧边导航 -->
    <Slidebar></Slidebar>

    <div class="content padding-lg padding-bottom-sm">
      <!-- 顶部 -->
      <Top></Top>
      <!-- 页面内容 -->
      <div class="bigbox" style="height: calc(100% - 80px);">
        <el-scrollbar
          style="height: 100%;">
          <router-view/>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
  import Slidebar from "@/components/sidebar/sidebar";
  import Top from "@/components/top/top"
  export default {
    name: 'App',
     components: {
      Slidebar,
      Top,
    }

  }
</script>

<style>
* {padding: 0; margin: 0;}
body {
  position: absolute;
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  width: 100%;
  min-width: 1330px;
  min-height: 500px;
  height: 100%;
  display: flex;
}
.content {
  width: calc(100% - 322px);
  background: #F5F7FA;
}
/* 用来隐藏横向滚动条  这个样式不能写在局部的style scoped里面 */
.bigbox .el-scrollbar__wrap{
  overflow-x: hidden;
}
.bigbox .el-scrollbar__view {height: 100%;}
.bigbox .is-horizontal {
    display: none;
}
/* 用来隐藏横向滚动条.end*/
</style>
