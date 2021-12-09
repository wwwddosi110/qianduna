<template>
  <div class="tc">
    <div class="padding-tb-lg">
      <div class="text-32" style="margin-top:40px">
        <p style="color: #FB3636">{{info.massage}}</p>
      </div>
      <!--  v-if="info.create == 'fail'" -->
      <div class="flex justify-center" style="margin-top:-10px">
        <p class="btnP tc text-white text-18 hover-pointer" @click="navto">立即查看</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        info: null,
      }
    },
    created() {
      this.info = JSON.parse(this.storage.getSession('cjInfo'))
      console.log('缺失的信息',this.info)
      console.log('大数据',this.$store.state.curStep)
      const loading = this.$loading({
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {loading.close()},1500)
    },
    methods: {
      backAmend() {
        this.$store.state.curStep--;
        this.$store.commit('changeIsBack', true)
        this.storage.setSession('tpid', )
      },
      navto() {
        var id = this.info.id || this.$route.query.id;
        console.log('知识图谱的id', id)
        this.$router.push({
          path: '/zstpDetail',
          query: {id: id}
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .step3 {
    background: #7EEC95;
    height: 350px;
    i {font-size: 66px;}

    .p-absolute {
      left: 40px;
      bottom: 14px;
      background: rgba(29, 70, 225, 0.4);
      border-radius: 4px;
      padding: 12px 25px;
      i {
        font-size: 16px;
      }
    }
  }
  .btnP {
    display: inline-block;
    width: 140px;
    line-height: 50px;
    background: #008B8B;
    border-radius: 4px;
    margin-top: 100px;
  }
</style>
