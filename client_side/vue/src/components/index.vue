<template>
  <div class="login">
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
    <mt-radio title="" v-model="value" :options="['新建房间', '加入房间']">
    </mt-radio>
    <mt-field v-if="show" label="房间号" placeholder="房间号" type="text" :attr="{ maxlength: 4 }" v-model="roomNum"></mt-field>
    <mt-button type="primary" @click="login">登录</mt-button>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        phone: '',
        value: '',
        roomNum: '',
        options: [{
            label: '被禁用',
            value: '值F',
            disabled: true
          },
          {
            label: '选项A',
            value: '值A'
          },
          {
            label: '选项B',
            value: '值B'
          }
        ]
      }
    },
    computed: {
      show() {
        return this.value == "加入房间"
      },
      newRoom() {
        if (this.value != "加入房间") {
          return true
        }
        return false
      }
    },
    methods: {
      open() {
        this.dialog = true
      },
      close() {
        this.dialog = false
      },
      login() {
        let body = {
          user: this.phone,
          roomNum: this.roomNum,
          newRoom: this.newRoom
        }
        for (var i in body) {
          if (body['user'].length < 11 || (!body['newRoom'] && body['roomNum'].length == 0)) {
            this.$messagebox.alert('请补全信息').then(action => {});
            return;
          }
        }
        this.$http.post('http://localhost:3000/login', body)
          .then((result) => {
            var result = result.data
            if (result.code == '200') {
              this.setLocalStorage('token', result.data.token)
              this.setLocalStorage('room',result.data.roomNum)
              this.setLocalStorage('user',result.data.id)
              this.$router.push('/map')
            } else {
              this.$messagebox.alert(result.message).then(action => {});
            }
          })
      },
      validLogin() {

      },
      setLocalStorage(key, val) {
        window.localStorage.removeItem(key)
        window.localStorage.setItem(key, val)
      }
    }
  }

</script>
<style lang="css">


</style>
