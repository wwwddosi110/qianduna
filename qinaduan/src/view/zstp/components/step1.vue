<template>
    <div class="padding-xl">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="概念模型" prop="gnmx">
          <el-select v-model="ruleForm.gnmx" placeholder="请选择概念模型" style="width: 100%;">
            <el-option v-for="(item, index) in gnmxArr" :key="index" :label="item[0]" :value="item[0]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图谱名称" prop="tpmc" placeholder="请输入创建的图谱名称">
          <el-input v-model="ruleForm.tpmc" oninput="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" :readonly="!state"></el-input>
        </el-form-item>
        <el-form-item label="图谱描述" prop="tpms" placeholder="请输入至少五个字的图谱描述">
          <el-input type="textarea" v-model="ruleForm.tpms"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        id: '',//已入库图谱id
        xid:'',
        gnmxArr: [],//概念模型下拉数据
        ruleForm: {
          gnmx: '',
          tpmc: '',
          tpms: ''
        },
        rules: {
          gnmx: [
            { required: true, message: '请选择需要创建的概念模型', trigger: 'change' }
          ],
          tpmc: [
            { required: true, message: '请输入创建的图谱名称', trigger: 'blur' },
          ],
          tpms: [
            { required: true, message: '请输入至少五个字的图谱描述', trigger: 'blur' },
            { min: 5, message: '请输入至少五个字的图谱描述', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      console.log('该死的缓存',this.$store.state.curStep)

      this.$store.state.curStep=1  //三步全局设置
      this.loadData();
      if(!this.state) {//从详情添加进入 有参数    JSON.stringify(this.$route.query) !== '{}'
        let {id, model_name, kg_name, kg_decribe} = this.$route.query;
        this.id = id;
        this.ruleForm.gnmx = model_name;
        this.ruleForm.tpmc = kg_name;
        this.ruleForm.tpms = kg_decribe;
      }
    },
    computed: {
      state() {
        return this.$store.state.zstpStatus
      }
    },
    methods: {
      loadData() {//概念模型下拉数据
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let tpio=JSON.parse(this.storage.getSession('create_state'));
        this.$api.modelDown({}).then(res => {
          loading.close();
          this.gnmxArr = res.data.modelname;  //modelname是一个数组
        }).catch(err => {
          this.$message.error(err);
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 图谱信息进行缓存   第二步 提交用
            this.gnmxArr.forEach(item=>{
              if(item[0]===this.ruleForm.gnmx){
                this.xid=item[1]
              }
            })
            var tpInfo = {
              kgmodel: this.ruleForm.gnmx,
              model_id:this.xid,
              kg_name: this.ruleForm.tpmc,
              kg_decribe: this.ruleForm.tpms,
            };
            this.storage.setSession('tpInfo', JSON.stringify(tpInfo));  //缓存
            if(!this.state) return this.$store.commit('addStep')
            const loading = this.$loading({
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$api.stepInfo({///graph/create_info/
              // kgmodel: this.ruleForm.gnmx,
              kg_name: this.ruleForm.tpmc,
              // kg_decribe: this.ruleForm.tpms,
            }).then(res => {
              console.log(res)
              loading.close();
              if(res.data.msg == '图谱名称已存在，请重新输入！') return this.$message.error(res.data.msg)
              if(res.data.msg == '保存成功！') {
                this.$store.state.curStep++
              }
            }).catch(err => {
              console.log(err)
              this.$message.error('失败：',err)
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-form-item {margin-bottom: 60px;}
</style>
