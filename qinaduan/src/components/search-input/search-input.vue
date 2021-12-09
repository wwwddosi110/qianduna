<template>
  <div class="searchBox flex align-center solid margin-lr-xs">
    <el-input v-model="searchVal" placeholder="请输入" ></el-input>
    <span class="hover-pointer tc text-white" @click="handleSearch">搜索</span>
  </div>
</template>

<script>
  export default {
    // props:['val'],
    data() {
      return {
        searchVal: ''
      }
    },
    created() {

    },
    methods: {
      handleSearch() {
        this.$emit('handleSearch', this.searchVal)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .searchBox {
    height: 40px;
    border-radius: 4px;
    span {
      display: inline-block;
      width: 70px;
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      background: #226FEE;
    }
    /deep/ .el-input__inner {
      border: none;
      height: 38px;
      line-height: 38px;
    }
  }
</style>
