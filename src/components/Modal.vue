<template>
   <div>
       <div class="md-modal modal-msg md-modal-transition" :class="{ 'md-show': loginModalFlag }">
          <div class="md-modal-inner">
            <div class="md-top">
              <div class="md-title">Login in</div>
              <button class="md-close" @click="myLoginModalFlag = false">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <div class="error-wrap">
                  <span class="error error-show" v-if="errorTip">用户名或者密码错误</span>
                </div>
                <ul>
                  <li class="regi_form_input">
                    <i class="icon IconPeople"></i>
                    <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
                  </li>
                  <li class="regi_form_input noMargin">
                    <i class="icon IconPwd"></i>
                    <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
                  </li>
                </ul>
              </div>
              <div class="login-wrap">
                <a href="javascript:;" class="btn-login" @click="login" >登  录</a>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="loginModalFlag" @click="myLoginModalFlag = false"></div>
   </div>
</template>

<script type="text/ecmascript-6">
   export default {
       data () {
            return {
                userName: '',
                userPwd: '',
                errorTip: false,
                nickName: '',
                myLoginModalFlag: this.loginModalFlag
            }
       },
       props: {
         loginModalFlag: {
           type: Boolean
         }
       },
       watch: {
         loginModalFlag (val) {
           this.myLoginModalFlag = val
         },
         myLoginModalFlag (val) {
            this.$emit('getFlag', val)
         }
       },
       methods: {
            login () {
                if (!this.userName || !this.userPwd) {
                    this.errorTip = true
                    return
                }
                this.$ajax.post('/users/login', {
                    userName: this.userName,
                    userPwd: this.userPwd
                }).then((response) => {
                    let res = response.data
                    if (res.status === '0') {
                        this.errorTip = false
                        this.myLoginModalFlag = false
                        this.nickName = res.result.userName
                        this.$emit('getUserName', this.nickName)
                    } else {
                        this.errorTip = true
                    }
                })
            }
        }
   }
</script>

<style scoped>
 @import './../assets/css/login.css';
</style>
