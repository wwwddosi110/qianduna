<template>
    <div class="bg-white radius-4 padding-tb-sm">
      <!-- 步骤条 -->
      <div class="stepBox flex align-center">
        <div class="bloxkBox text-white radius-4 text-20">知识图谱<br/>创建流程</div>
        <div class="step flex-sub">
          <el-steps :active="curStep" finish-status="success" align-center style="margin-left: -60px;margin-top: -10px">
            <el-step title="基本信息"></el-step>
            <el-step title="知识映射"></el-step>
            <el-step title="完成创建"></el-step>
          </el-steps>
        </div>
      </div>
      <!-- 步骤条.end -->

      <div class="titBox text-18 text-theme padding-lr-xl"><span>{{curStep == 1 ? '基本信息' : (curStep == 2 ? '知识映射' : '完成创建')}}</span></div>

      <stepOne v-show="curStep == 1"></stepOne>
      <stepTwo v-show="curStep == 2"></stepTwo>
      <stepThree v-if="curStep == 3"></stepThree>

    </div>
</template>
<script>
  import stepOne from "./components/step1.vue";
  import stepTwo from "./components/step2.vue";
  import stepThree from "./components/step3.vue";
  export default {
    components: {
      stepOne,
      stepTwo,
      stepThree
    },
    data() {
      return {
        title: '基本信息', //1 基本信息   2 数据源   3创建图谱
      }
    },
    computed: {
      curStep() {//当前步骤
        return this.$store.state.curStep
      }
    },
    created() {
    },
    destroyed() {
      this.$store.commit('initStep');
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .radius-4 {border-radius: 4px;}

  .stepBox {
    margin-bottom: 26px;
    .bloxkBox {
      background: #59C870;
      padding: 15px;
      line-height: 28px;
      margin-left: 70px;
      margin-top: -20px;
    }
    .el-step.is-horizontal {
      display: inline-block;
    }
    /deep/ .el-step {
      .el-step__title.is-success {color: #59C870;}
      .el-step__title.is-process {
        color: #8399AB;
        font-weight: normal;

      }

      .el-step__head.is-process {
        color: #8399AB;
        font-weight: normal;
        .el-step__icon.is-text {border-color: #DDDDDD;}
      }

    }
  }

  .titBox {
    background: #EFF6FF;
    span {
      display: inline-block;
      line-height: 50px;
      border-bottom: 4px solid #409EFF;
    }
  }
</style>
