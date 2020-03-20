<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avtar">
        <img src="https://s1.ax1x.com/2020/03/20/8gnMy8.md.jpg" alt />
      </div>
      <div>
        <el-form ref="login_formRef" class="login_form" :model="formdata" :rules="rules">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-s-custom" v-model="formdata.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="formdata.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      formdata: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.formdata.username = ''
      this.formdata.password = ''
      this.$refs.login_formRef.resetFields()
    },
    login () {
      this.$refs.login_formRef.validate(async value => {
        if (!value) return
        const result = await this.$http.post('login', this.formdata)
        if (result.data.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: '登录错误!请检查用户名和密码.',
            type: 'error'
          })
        }
        this.$message({
          showClose: true,
          message: '恭喜你，登陆成功',
          type: 'success'
        })
        window.sessionStorage.setItem('token', result.data.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avtar {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
