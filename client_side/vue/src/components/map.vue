<template>
  <div class="map">
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="top" modal="false" closeOnClickModal="false">
     <!--<div style="width:70%; height:100px;background: red;margin: 0 auto" class="userList">
        <mt-swipe :auto="4000">
          <mt-swipe-item v-for="marker in 4" key="marker">
            {{marker}}
          </mt-swipe-item>
        </mt-swipe>

      </div>-->
      <div class="serverInfo">
        {{serverInfo}}
      </div>
      <div class="infoList">
        账号：<span>{{id}}</span> 房间号：
        <span>{{room}}</span>
      </div>
    </mt-popup>

    <div class="amap-wrapper">
      <el-amap :vid="'amap-vue'" amapManager="AMapManager">
      </el-amap>
    </div>
    <div class="amap-page-container">
      <el-amap :vid="'amap-vue'" :center="center" :zoom="zoom" :map-manager="amapManager" :plugin="plugin" :events="events">
        <el-amap-marker v-for="marker in markers" key="marker" :position="getPos(marker)" :content="getName(marker.user)"></el-amap-marker>
      </el-amap>

    </div>
  </div>
</template>
<script>
  import {
    AMapManager
  } from 'vue-amap';
  let amapManager = new AMapManager();
  export default {
    name: 'amap-page',
    data: function () {
      let self = this
      return {
        serverInfo: 'no thing',
        id: '123',
        room: '123',
        popupVisible: true,
        picked: '',
        vid: 'amap-vue-1',
        zoom: 12,
        center: [121.59996, 31.197646],
        events: {
          'moveend': () => {
            let mapCenter = this.amapManager.getMap().getCenter();
            this.center = [mapCenter.getLng(), mapCenter.getLat()];
          },
          'zoomchange': () => {
            this.zoom = this.amapManager.getMap().getZoom();
          },
          'click': (e) => {}
        },
        plugin: [{
          pName: 'Geolocation',
          showMarker: true,
          showButton: true,
          panToLocation: false,
          showCircle: false,
          markerOptions: this.getMarker(),
          events: {
            init(instance) {
              self.watchPos(instance)
            },
            complete(result) {
              self.$socket.emit('authenticate', {
                token: self.token
              }).emit('update', {
                pos: {
                  log: result.position.lng,
                  lat: result.position.lat
                }
              });

            },
            error(err) {
              console.log(err)
            }
          }
        }],
        amapManager: amapManager,
        markers: {

        }
      };
    },
    computed: {
      token() {
        return window.localStorage['token']
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$socket.close()
      next()
    },
    mounted() {
      this.$socket.emit('online')
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      reply: function (val) {
        this.$set(this.markers, val.user, val)
      },
      unauthorized: function (val) {
        this.$router.replace('/login')
      },
      join: function(val) {
        this.serverInfo = val
        this.popupVisible = true
      },
      authenticated: function () {


      }
    },
    methods: {
      string2hash(input) {
        const I64BIT_TABLE =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
        var hash = 5381;
        var i = input.length - 1;

        if (typeof input == 'string') {
          for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
        } else {
          for (; i > -1; i--)
            hash += (hash << 5) + input[i];
        }
        var value = hash & 0x7FFFFFFF;

        var retValue = '';
        do {
          retValue += I64BIT_TABLE[value & 0x3F];
        }
        while (value >>= 6);

        return retValue;
      },
      getMarker() {
        return {
          content: `<div class="markers" style='width:50px;height:50px;'><p>自己</p><i class="fa fa-arrow-down" style="color: white"></i></div>`
        }
      },
      getName(name) {
        var hashedN = this.string2hash(name)
        return `<div  class="markers" style='width:50px;height:50px;'>
        <p>
        ${name}
        </p>
        <i class="fa fa-arrow-down" style="color: rgb(${hashedN[0].charCodeAt()},${hashedN[1].charCodeAt()},${hashedN[2].charCodeAt()})">
        </i>
        </div>`
      },
      getPos(user) {
        return [user.position.log, user.position.lat]
      },
      loginWs() {
        this.$socket.emit('online', {
          user: '01',
          room: 1
        });

      },
      watchPos(instance) {
        setInterval(() => {
          instance.getCurrentPosition()
        }, 3000)
      },
      getMap: function () {
        this.instance.getCurrentPosition((status, result) => {
          console.log(result)

        });
      },
      uploadPos() {

      },
      addMarker: function () {
        let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
        let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
        this.markers.push([lng, lat]);
      },
      addZoom() {
        this.zoom++;
      },
      subZoom() {
        this.zoom--;
      },
      changeCenter() {
        this.center = [this.center[0] + 0.1, this.center[1] + 0.1];
        console.log(this.center);
      }
    }
  };

</script>
<style lang="css">
  .mint-popup {
    width: 100%;
  }

  .map {
    height: 100%;
  }

  .amap-wrapper {
    width: 100%;
    height: 100%;
  }

  p {
    margin: 0px;
  }

</style>
