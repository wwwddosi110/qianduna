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
            <el-radio-button
              v-for="(item, index) in zyysArr"
              :key="index"
              :label="item.id"
            >{{item.text}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filtrate flex align-center padding-top padding-bottom-xs">
          <p class="text-16 tr">业务类型：</p>
          <el-radio-group v-model="ywlx" @change="ywlxChange" size="small">
            <el-radio-button
              v-for="(item, index) in ywlxArr"
              :key="index"
              :label="item.id"
            >{{item.text}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 内容列表 -->
    <div class="padding-top">
      <el-row :gutter="20">
        <!-- 添加 -->
        <el-col :span="sWidth">
          <div class="itemList addItem bg-white padding-lr-lg padding-tb hover-pointer" @click="navto('/zstpAdd')"
          >
            <div class="flex align-center justify-center tc">
              <p class="text-16 text-999">
                <i class="iconfont icon-add text-20"></i>
                <br>添加
              </p>
            </div>
          </div>
        </el-col>
        <!-- 列表 -->
        <el-col :span="sWidth" v-for="(item,index) in listData" :key="index">
          <div class="itemList bg-white">
            <div class="hover-pointer" @click="navto('/zstpDetail', item.id, item.title)">
              <!-- style="background-image: url(https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png);" -->
              <div class="imgBox" :style="{ backgroundImage:'url('+imgpath+')'}"></div>
              <p class=" padding-lr-xs titP text-18 hover-pointer ellipse" :title="item.title">{{item.title}}</p>
              <div class="margin-top-xs padding-lr-xs" style="height: 50px; overflow: hidden;">
                <p class="conP" :title="item.kgdecribe">{{item.kgdecribe}}</p>
              </div>
            </div>
            <div class="info flex text-12 padding-lr-xs">
              <p>
                <i class="iconfont icon-zuijin"></i>
                {{item.create_time}}
              </p>
              <i class="remove iconfont icon-shanchu hover-pointer text-red" @click="handleRemove(item.id)"></i>
            </div>
          </div>
        </el-col>
      </el-row>
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
      </div>-->
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
      zyys: '全部', //自然资源要素
      zyysArr: [],
      ywlx: '全部', //业务类型
      ywlxArr: [],
      listData: [], // 列表
      imgpath: require('@/assets/images/tp.jpg'), // 图片
      curPage: 1,
      pageSize: 10,
      total: 50,
      sWidth: document.body.clientWidth > 1400 ? 6 : 8 //根据屏幕宽度 设置栅格化布局 栏数
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    let _ths = this;
    // 设置栅格化布局  栏数
    window.onresize = () => { //生命周期结束
      return (() => {
        var w = document.body.clientWidth;
        if (w > 1400) {
          _ths.sWidth = 6;
        } else {
          _ths.sWidth = 8;
        }
      })();
    };
    //栏数.end
  },
  methods: {
    loadData() {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$api.zstpList({
        search: this.searchVal,
        resourcebeta: this.zyys == '全部' ? '' : this.zyys,
        businesstype: this.ywlx == '全部' ? '' : this.ywlx,
      }).then(res => {
        console.log('知识图谱列表', res);
        loading.close();
        this.listData = res.data.model;
        this.zyysArr = res.data.zr.map(item => {return {id: item, text: item}});
        this.ywlxArr = res.data.yewu.map(item => {return {id: item, text: item}});
        this.zyysArr.unshift({id: '全部', text: '全部'});
        this.ywlxArr.unshift({id: '全部', text: '全部'});
      }).catch(err => {
        loading.close();
        this.$message.error('加载失败：' + err);
      });
    },
    // 搜索
    handleSearch(val) {
      this.searchVal = val;
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
    navto(path, id, name) {
      if(path == '/zstpAdd') {
        console.log('知识图谱闯进',this.$store.state.curStep)
        this.$store.commit('changeZstpStatus', true)
        this.$store.commit('changeIsBack', false);
        this.$router.push(path)
      };
      if(path == '/zstpDetail') {
        this.$router.push({
          path: path,
          query: {
            id: id,
            name: name
          }
        })
      }
    },
    // 删除
    handleRemove(id) {
      this.$confirm('此操作将永久删除该图谱, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          text: '删除中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.deleteAtlas({
          id: id
        }).then(res => {//graph/delete/
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
};
</script>

<style lang="scss" scoped>
.topBox {
  border-radius: 4px;
}
.filtrate {
  border-bottom: 1px dashed #e6eaf0;
  p {
    width: 120px;
  }
}

/deep/ .el-radio-group {
  .el-radio-button__inner {
    border: none;
    border-radius: 4px;
    color: #8399ab;
  }
  .is-active {
    .el-radio-button__inner {
      color: #fff;
    }
  }
}

/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #226fee;
}

/deep/ .el-col {
  margin-bottom: 20px;
}
// 内容列表
.itemList {
  height: 280px;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  // .titP {
  //   i {font-size: 24px; vertical-align: middle;}
  // }
  .imgBox {
    width: 100%;
    height: 160px;
    background-position: center;
    background-size: cover;
  }
  .conP {
    line-height: 24px;
    color: #888;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  // .versions {color: #5D9CFB;}
  .info {
    color: #8399ab;
    i {
      margin-right: 5px;
    }
    .remove {
      margin-left: auto;
      float: right\0;
    }
  }
}

.addItem {
  div {
    height: 100%;
    border: 1px dashed #e3e3e3;
  }
}
</style>
