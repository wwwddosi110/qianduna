<template>
  <div class="sideBox padding-top-lg">
    <img alt="Vue logo" src="./assets/images/kg.png" height="100" width="100" style="position: relative;left: 100px;top:-10px">
    <el-menu
      :default-active="'/'+$route.name"
      :router="true"
      :unique-opened="true"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="rgba(0,0,0,0)"
      text-color="#fff"
      active-text-color="#36bf36">
      <template v-for="(item, index) in nav">
        <template v-if="item.submenu">
          <el-submenu :index="item.id.toString()">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item v-for="(item2, index2) in item.submenu" :key="index2" :index="item2.name">{{item2.tit}}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.name">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        nav: [
          {
            id: 1,
            title: '图谱应用',
            icon: 'icon-shouyetianchong',
            name: '/',
            submenu: [
              {tit: '智能问答',name: '/'},
              {tit: '智能助手',name: '/znzs'}
            ],
          },
          {
            id: 2,
            title: '知识图谱',
            icon: 'icon-shujutupu',
            name: '/zstp',
          },
          {
            id: 3,
            title: '模型管理',
            icon: 'icon-shitimoxing',
            name: '/mxgl',
          },
          {
            id: 4,
            title: '数据源管理',
            icon: 'icon-people-network-full',
            submenu: [
              {tit: '结构化数据',name: '/sjygl'},
              {tit: '非结构化数据',name: '/fjghsj'}
            ],
          }
        ]
      }
    },
    created() {

    },
    methods: {
      navto(path) {
        this.$router.push(path)
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }

    }
  }
</script>

<style scoped lang="scss">
  .sideBox {
    width: 322px;
    height: 100%;
    background: #363636;
    box-shadow: 5px 0px 10px 0px rgba(40, 43, 49, 0.2);
    color: #fff;
    .logo {
      display: block;
      width: 118px;
      height: 118px;
      margin: 0 auto;
    }
  }

  /deep/ .el-menu {
    border-right: none;
    font-size: 40px;
  }

  /deep/ .el-submenu__title {
    font-size: 16px;
    i {color: #fff; font-size: 24px;}
    i.el-submenu__icon-arrow {margin-top: -10px;}
  }
  /deep/ .el-menu-item {
    font-size: 16px;
    i {color: #fff; font-size: 24px;}
    i.el-submenu__icon-arrow {margin-top: -10px;}
  }

  /deep/ .el-menu-item.is-active {background-color: #1D46E1!important}
  /deep/ .el-submenu__title:hover {background-color: #1D46E1!important}
  /deep/ .el-menu-item:hover {background-color: #1D46E1!important}

</style>
