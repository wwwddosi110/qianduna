<template>
    <div>
      <div class="topBox bg-white padding-lr padding-bottom">
        <!-- 搜索 -->
        <div class="padding-tb-sm" style="width: 540px;">
          <searchInput @handleSearch="handleSearch"></searchInput>
        </div>
        <!-- 筛选条件 -->
        <div class="filtrateBox">
          <div class="filtrate flex align-center padding-top padding-bottom-xs">
            <p class="text-16 tr">自然资源要素：</p>
            <el-radio-group v-model="zyys" @change="zyysChange" size="small">
              <el-radio-button v-for="(item, index) in zyysArr" :key="index" :label="item.id">{{item.text}}</el-radio-button>
            </el-radio-group>
          </div>

          <div class="filtrate flex align-center padding-top padding-bottom-xs">
            <p class="text-16 tr">业务类型：</p>
            <el-radio-group v-model="ywlx" @change="ywlxChange" size="small">
              <el-radio-button v-for="(item, index) in ywlxArr" :key="index" :label="item.id">{{item.text}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!-- 内容列表 -->
      <div class="padding-top">
        <el-row :gutter="20">
          <!-- 添加 -->
          <el-col :span="sWidth">
            <div class="itemList addItem bg-white padding-lr-lg padding-tb hover-pointer" @click="navto('/add-detail','first')">
              <div class="flex align-center justify-center tc">
                <p class="text-16 text-999"><i class="iconfont icon-add text-20"></i><br/>添加</p>
              </div>
            </div>
          </el-col>
          <!-- 列表 -->
          <el-col :span="sWidth" v-for="(item, index) in resdata" :key="index">
            <div class="itemList bg-white padding-sm">
              <div @click="navto('/add-detail','detail', item.id)">
                <p class="titP text-18 hover-pointer ellipse" :title="item.modelname"><i class="iconfont icon-shitimoxing text-theme margin-right-xs"></i>{{item.modelname}}</p>
                <div class="margin-top-xs hover-pointer" style="height: 75px; overflow: hidden;">
                  <p class="conP" :title="item.Modeldecribe">{{item.Modeldecribe}}</p>
                </div>
              </div>
              <div class="versions flex justify-between padding-top-xs padding-bottom">
                <p>当前版本：{{item.Modelversion}}</p>
                <p>当前状态：{{item.Modelstatus}}</p>
              </div>
              <div class="info flex text-12">
                <p><i class="iconfont icon-yonghu"></i>创建人</p>
                <p class="margin-left"><i class="iconfont icon-zuijin"></i>{{item.created}}</p>
                <i class="remove iconfont icon-shanchu hover-pointer text-red" @click="handleRemove(item.id)"></i>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-empty v-if="resdata.length < 1" description="暂无数据~"></el-empty>
        <!-- 分页 -->
        <!-- <div class="tc">
          <el-pagination
            background
            @size-change="sizeChange"
            :current-page="curPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div> -->
      </div>

    </div>
</template>
<script>
  import searchInput from "@/components/search-input/search-input.vue";
  export default {
    components: {
      searchInput
    },
    data() {
      return {
        searchVal: '',
        resdata: [],//列表数据
        zyys: '全部',//自然资源要素
        zyysArr: [
          // {id: '全部', text: '全部'},
          // {id: '土地', text: '土地'},
          // {id: '森林', text: '森林'},
          // {id: '矿产', text: '矿产'}
        ],
        ywlx: '全部',//业务类型
        ywlxArr: [
          // {id: '全部', text: '全部'},
          // {id: '土地报批', text: '土地报批'},
          // {id: '用地预审', text: '用地预审'},
          // {id: '土地供应', text: '土地报批'},
          // {id: '地籍登记', text: '地籍登记'}
        ],
        curPage: 1,
        pageSize: 10,
        total: 50,
        sWidth: document.body.clientWidth > 1400 ? 6 : 8,//根据屏幕宽度 设置栅格化布局 栏数
      }
    },
    created() {
      this.loadData();
    },
    mounted() {
      let _ths = this;

      // 设置栅格化布局  栏数
      window.onresize = () => {
        return (() => {
          var w = document.body.clientWidth;
          if(w > 1400) {
            _ths.sWidth = 6;
          }else {
            _ths.sWidth = 8;
          }
        })();
      };
      //栏数.end

    },
    methods: {
      // 模型管理列表加载
      loadData() {
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.modelList({//     /model_manager/index/
          search: this.searchVal,
          resourcebeta: this.zyys == '全部' ? '' : this.zyys,
          businesstype: this.ywlx == '全部' ? '' : this.ywlx,
        }).then(res => {
          loading.close();
          console.log('模型列表', res);
          if(res.status == 200) {
            this.resdata = res.data.model;
            this.zyysArr = res.data.zr.map(item => {return {id: item, text: item}});
            this.ywlxArr = res.data.yewu.map(item => {return {id: item, text: item}});
            this.zyysArr.unshift({id: '全部', text: '全部'});
            this.ywlxArr.unshift({id: '全部', text: '全部'});
          }
        })
      },
      // 搜索
      handleSearch(data) {
        this.searchVal = data;
        this.loadData();
      },
      // 自然资源要素条件切换
      zyysChange(e) {
        this.zyys = e;
        this.loadData()
      },
      // 业务类型条件切换
      ywlxChange(e) {
        this.ywlx = e;
        this.loadData()
      },
      // 页面跳转
      navto(path, param, id) {
        if(!param) {
          this.$router.push(path)
        }else {
          this.$router.push({
            path: path,
            query: {status: param, id: id}
          })
        }
      },
      // 删除
      handleRemove(id) {
        this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            text: '删除中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$api.deleteModel({
            id: id
          }).then(res => {///model_manager/delete/
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            var _this = this;
            setTimeout(() => {
              loading.close();
              _this.loadData();
            }, 1500)

          }).catch((err) => {
						loading.close();
						this.$message.error('删除失败：' + err)
					});
        }).catch((err) => {
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .topBox {
    border-radius: 4px;
  }
  .filtrate {
    border-bottom: 1px dashed #E6EAF0;
    p {
      width: 120px;
    }
  }

  /deep/ .el-radio-group {
    .el-radio-button__inner {
      border: none;
      border-radius: 4px;
      color: #8399AB;
    }
    .is-active {
      .el-radio-button__inner {color: #fff;}
    }
  }

  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {background-color: #226FEE;}

  /deep/ .el-col {margin-bottom: 20px;}
  // 内容列表
  .itemList {
    height: 230px;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    .titP {
      i {font-size: 24px; vertical-align: middle;}
    }
    .conP {
      line-height: 24px;
      color: #888;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .versions {color: #5D9CFB;}
    .info {
      color: #8399AB;
      i {margin-right: 5px;}
      .remove {margin-left: auto; float: right\0;}
    }
  }

  .addItem {
    div {
      height: 100%;
      border: 1px dashed #E3E3E3;
    }
  }


</style>
