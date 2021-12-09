<template>
    <div class="mainContent flex">
      <!-- 左侧树形 -->
      <div class="leftBox bg-white">
        <!-- 按钮 -->
        <div class="btnBox flex justify-between padding-lr-xs padding-tb-sm tc">
          <div class="lBtn text-white text-16 hover-pointer" @click="addDialog = true" style="background:#226FEE">添加数据库</div>
          <div class="rBtn hover-pointer text-white" style="background:#226FEE">导入文件</div>
        </div>
        <!-- 搜索 -->
        <div class="btnBox flex justify-between padding-lr-xs tc">
          <searchInput :val="searchVal" @handleSearch="handleSearch" style="width:600px;position: relative;right:10px;"></searchInput>
          <el-button type="primary" @click="deletenode" style="width:100px;background: #226FEE">删除</el-button>
        </div>
        <!-- 树形初始化 调用接口图库中获取数据 -->
        <el-scrollbar style="height: calc(100% - 118px);">
          <el-tree
            :data="datanode"
            ref="tree"
            show-checkbox
            :filter-node-method="filterNode"
            @check="handleTree"
          ></el-tree>
        </el-scrollbar>
      </div>
      <!-- 右侧表格 -->
      <div class="rightBox margin-left-sm padding-lr-sm">
        <!-- 表格 -->
        <div style="height: calc(100% - 172px);">
          <el-table
            :data="tableData"
            stripe
            border
            height="100%"
            style="width: 100%;position: relative;left: 50px;top:50px">
            <el-table-column
              prop="date"
              label="字段"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="数据类型"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="zhushi"
              label="字段注释"
              align="center"
              width="180">
            </el-table-column>

          </el-table>
        </div>
      </div>
      <!-- 添加数据库弹窗 -->
      <el-dialog
        title="数据库连接"
        :close-on-click-modal="false"
        :visible.sync="addDialog">
        <div class="padding-right-sm">
          <el-form :model="addRuleForm" :rules="rules" ref="addRuleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="数据库地址：" prop="db_address">
              <el-input v-model="addRuleForm.db_address"></el-input>
            </el-form-item>
            <el-form-item label="数据库名称：" prop="db_name">
              <el-input v-model="addRuleForm.db_name"></el-input>
            </el-form-item>
            <el-form-item label="数据库类型：" prop="db_type">
              <el-select v-model="addRuleForm.db_type" placeholder="请选择">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="端口：" prop="port">
              <el-input v-model="addRuleForm.port"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="user">
              <el-input v-model="addRuleForm.user"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="addRuleForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="addDialog = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('addRuleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 删除弹窗 -->
    </div>
</template>
<script>
  import searchInput from "@/components/search-input/search-input.vue";
  export default {
    components:{
      searchInput
    },
    data() {
      return {
        searchVal: '',//搜索框内容
        datanode:[],//数据源节点
        nodechosed:[], //选中的节点，将节点的id返回给后端
        checkNodes: [],//获取选中的节点
        tableData: [
          {
            date: 'xzqdm',
            name: 'text',
            zhushi: '行政区代码'
          }
        ],
        addDialog: false,//添加数据库弹窗 显示隐藏

        addRuleForm: {//添加数据库表单
          db_address: '',//192.168.1.241',
          db_name: '',//'knowledge',
          db_type: '',//'pg',
          port: '',//'5432',
          user: '',//'postgres',
          password: '',//'postgres',
        },
        rules: {
        db_address: [
            { required: true, message: '请填写数据库地址', trigger: 'blur' }
          ],
          db_name: [
            { required: true, message: '请填写数据库名称', trigger: 'blur' }
          ],
          db_type: [
            { required: true, message: '请选择数据库类型', trigger: 'change' }
          ],
          port: [
            { required: true, message: '请填写端口', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ],
        },
        options: ['MySQL','pg','oracle','neo4j'],
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.$api.dataindex({}).then(res => {
          res.data.db.forEach(item =>{
            var tableArr = Object.keys(item.base_fileds).map(it => {return {label: it, origin: item.base_fileds[it]}});
            this.datanode.push({label:item.ip,noid:item.id,children: [{label: item.db_name+'（'+item.db_type+'）',children:tableArr}]})
          })
        }).catch(err => {
          this.$message.error('加载失败：' + err);
        });
      },
      handleTree(data, checked) {
        //console.log('节点数据',data); //查看data中是否包含树节点的id
        //console.log('选中的节点',this.nodechosed)
        this.checkNodes = [];
        this.checkNodes = checked.checkedNodes;
        if(this.checkNodes.length!==0 && this.nodechosed.indexOf(data.noid)===-1){  //如果选中且数组不存在该树节点的id
          this.nodechosed.push(data.noid); //选中该节点的id
          }
        if(this.checkNodes.length===0 && this.nodechosed.indexOf(data.noid)!==-1){//如果取消且数组中存在该树的节点id
          let iof=this.nodechosed.indexOf(data.noid)
          this.nodechosed.splice(iof,1)
        }
      },
      handleSearch() {
        console.log('搜索')
      },
      //树形结构过滤
      filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
      },
      //添加数据库 表单验证
      submitForm(formName) {
      this.$refs[formName].validate((valid) => {  //验证有效性
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "数据请求中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$api.data_add({   //在接口中传输数据
            db_address: this.addRuleForm.db_address,
            db_name: this.addRuleForm.db_name,
            db_type: this.addRuleForm.db_type,
            port: this.addRuleForm.port,
            user: this.addRuleForm.user,
            password: this.addRuleForm.password,
          }).then(res => {  //调用增加数据库接口后在前端展示
            loading.close();
            this.addDialog = false; //隐藏弹窗
            var _this = this;
            setTimeout(() => {
              loading.close();
              this.datanode=[];  //将数据源节点数组置空，重新加载页面
              _this.loadData();
            }, 1500)
          }).catch(err => {
            loading.close();
            this.$message.error('连接失败：' + err);
          })
        } else {
          return false;
        }
      });
    },
      deletenode(){
        this.$confirm('是否删除这些节点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            text: '删除中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$api.data_delete({
            id: this.nodechosed   //批量删除
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            var _this = this;
            setTimeout(() => {
              loading.close();
              this.datanode=[];
              this.nodechosed=[];
              _this.loadData();
            }, 1500)
          }).catch((err) => {
						loading.close();
						this.$message.error('删除失败：' + err)
					});
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mainContent {
    width: 100%;
    height: 100%;
  }

  .leftBox {
    width: 400px;
    height: 100%;
    overflow: hidden;
    .btnBox {
      div {
        width: 180px;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
      }
      .lBtn {
        border: 1px dashed #226FEE;
      }
      .rBtn {
        background: #5D9CFB;
      }
    }

    .treeBox {
      margin-right: -20px;
      height: calc(100% - 120px);
      overflow-y: scroll;
    }
  }

  .rightBox {
    width: calc(100% - 420px);
    height: 100%;

    .rightTop {
      height: 80px;
      >span {
        display: inline-block;
        width: 70px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
      }
    }
  }

  // 树形图样式修改
  /deep/ .el-tree-node__label {font-size: 16px;}
  /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {background: #C9E6FF;}
  /deep/ .el-tree-node__expand-icon {font-size: 18px; color: #5D9CFB;}
  /deep/ .el-tree-node__expand-icon.is-leaf {color: transparent; cursor: default;}
  /deep/ .el-tree-node__content {height: 40px;}

  // 表格
  /deep/ .el-table {
    .el-table__header{
      tr {
        th {
          background: #F3F7F8; color: #333;
        }
      }
    }
    .el-table__body {
      tr {
        td {color: #666;}
      }
    }
  }
  /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{background: #E0EEFF;}
  // 弹窗
  /deep/ .el-dialog {
    width: 700px;
    .el-dialog__header {
      background: linear-gradient(40deg, #4162DF, #226FEE);
      padding: 15px 20px 15px;
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
          font-size: 22px;
        }
      }
    }
    .el-dialog__title {color: #fff;}

    .el-dialog__footer {
      text-align: center;
    }

    .el-select {width: 100%;}

    .el-table {
      .el-input__inner {
        border: none;
        text-align: center;
        background: none;
      }
    }
  }
</style>
