<template>
  <el-container>
    <el-header>
      <div class="head_logo">
        <img
          src="https://s1.ax1x.com/2020/03/20/8cLrIs.png"
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
          class="el-menu-vertical-demo"
          background-color="#303540"
          text-color="#fff"
          :default-active="default_active"
          active-text-color="#409bfe"
          unique-opened
          :collapse="toogled"
          :collapse-transition="false"
          router
        >
          <el-submenu v-for="(menu, index) in menudata" :key="index" :index="menu.id.toString()">
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item
              v-for="(submenu, subindex) in menu.children"
              :key="subindex"
              :index="'/'+submenu.path"
              @click="saveNavState(submenu.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{submenu.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  home: 'Home',
  data () {
    return {
      default_active: '',
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
    },
    saveNavState (path) {
      this.default_active = '/' + path
      window.sessionStorage.setItem('default_active', '/' + path)
    }
  },
  created () {
    this.$http.get('menus').then(res => {
      if (res.status === 200) {
        this.menudata = res.data.data
      }
    })
    this.default_active = window.sessionStorage.getItem('default_active')
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
