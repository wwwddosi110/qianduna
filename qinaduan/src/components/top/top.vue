<template>
    <div class="flex justify-between padding-bottom-lg">
      <p class="logotext" style="color: blueviolet">自然资源知识图谱平台</p>
      <div class="topBox flex">
        <!-- <div class="topTime">2021年5月11日 星期二  09:37:33</div> -->
        <span class="searchIcon tc"><i class="el-icon-search text-18"></i></span>
        <div class="userBox flex align-center padding-lr-sm hover-pointer">
          <p class="text-theme ellipse padding-right-xs">管理员</p>
          <i class="el-icon-caret-bottom text-theme"></i>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .logotext {
    font-size: 38px;
    line-height: 38px;
    font-weight: bold;
    color: #222;
  }

  .topBox {
    line-height: 38px;
    .topTime {
      color: #A1A7BB;
    }

    .searchIcon {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: #D8E4FB;
      margin: 0 18px 0 27px;
    }

    .userBox {
      width: 150px;
      height: 40px;
      background: #D8E4FB;
      border-radius: 20px;
      p {
        width: 95px;
        color: #FB3636;
      }
    }
  }

</style>
