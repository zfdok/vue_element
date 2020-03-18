<template>
  <el-container>
    <el-header>
      <div class="head_logo">
        <img
          src="https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white-c4d7df0a00.png"
          alt
        />
        <span>管理系统</span>
      </div>
      <el-button @click="exit_login" type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="toogled ?' 64px':' 200px'">
        <div class="toogle_btn" @click="menu_toogled">{{toogled ? "👉":"👈"}}</div>
        <el-menu
          default-active="110"
          class="el-menu-vertical-demo"
          background-color="#303540"
          text-color="#fff"
          active-text-color="#409bfe"
          unique-opened
          :collapse="toogled"
          :collapse-transition="false"
        >
          <el-submenu v-for="(menu, index) in menudata" :key="index" :index="menu.id.toString()">
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item
              v-for="(submenu, subindex) in menu.children"
              :key="subindex"
              :index="submenu.id.toString()"
            >
              <i class="el-icon-menu"></i>
              <span>{{submenu.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>{{this.menudata}}</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  home: 'Home',
  data () {
    return {
      menudata: [],
      toogled: false,
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-key',
        101: 'el-icon-shopping-bag-2',
        102: 'el-icon-s-order',
        145: 'el-icon-data-line'
      }
    }
  },
  methods: {
    exit_login () {
      window.sessionStorage.clear()
      this.$router.replace('/')
      this.$message({
        message: '您已经退出登录',
        type: 'warning'
      })
    },
    menu_toogled () {
      this.toogled = !this.toogled
    }
  },
  created () {
    this.$http.get('menus').then(res => {
      console.log(res.data.data)
      if (res.status === 200) {
        this.menudata = res.data.data
      }
    })
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #353b3d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  color: #bbb;
  > div {
    height: 100%;
    display: flex;
    align-items: center;
    > img {
      height: 100%;
    }
    > span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #303540;
  overflow: hidden;
  .el-menu {
    border-right: none;
  }
  .toogle_btn {
    text-align: center;
    cursor: pointer;
    padding: 6px;
    user-select: none;
  }
  .toogle_btn:hover {
    background-color: #262a33;
  }
}
.el-main {
  background-color: #e0e4e7;
}
</style>
