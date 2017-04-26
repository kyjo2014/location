<template>
  <div id="app">
    <div class="amap-wrapper">
      <el-amap :vid="'amap-vue'" amapManager="AMapManager">
      </el-amap>
    </div>
    <div class="amap-page-container">
      <el-amap :vid="'amap-vue'" :center="center" :zoom="zoom" :map-manager="amapManager" :plugin="plugin" :events="events">
        <el-amap-marker v-for="marker in markers" key="marker" :position="getPos(marker)" :content="getName(marker.user)"></el-amap-marker>
      </el-amap>
      <button v-on:click="getMap">get map</button>
      <button type="button" name="button" v-on:click="addZoom">zoom++</button>
      <button type="button" name="button" v-on:click="subZoom">zoom--</button>
      <button type="button" name="button" v-on:click="changeCenter">change center</button>
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
        vid: 'amap-vue-1',
        zoom: 12,
        center: [121.59996, 31.197646],
        events: {
          'moveend': () => {
            let mapCenter = this.amapManager.getMap().getCenter();
            // this.center = [mapCenter.getLng(), mapCenter.getLat()];
          },
          'zoomchange': () => {
            this.zoom = this.amapManager.getMap().getZoom();
          },
          'click': (e) => {
            alert('map clicked');
          }
        },
        plugin: [{
          pName: 'Geolocation',
          showButton: false,
          panToLocation: false,
          events: {
            init(instance) {
              self.autoSend(instance)
              self.loginWs()
            },
            complete(result) {
              self.$socket.emit('emit_method', {
                pos: {
                  log: result.position.lng,
                  lat: result.position.lat
                }
              });
            }
          }
        }],
        amapManager: amapManager,
        // markers: [
        //   [121.59996, 31.197646],
        //   [121.40018, 31.197622],
        //   [121.69991, 31.207649]
        // ]
        markers: {

        }
      };
    },
    mounted() {

    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      update: function (val) {
        this.$set(this.markers,val.user,val)

      }
    },
    methods: {
      getName(name) {
        return `<div style='width:50px;height:50px;background:red'>${name}</div>`
      },
      getPos(user){
           return [user.position.log,user.position.lat]
          // return [131,26]
      },
      loginWs() {
        this.$socket.emit('online', {
          user: '01',
          room: 1
        });

      },
      autoSend(instance) {
        setInterval(() => {
          instance.getCurrentPosition()
        }, 1000)
      },
      getMap: function () {
        console.log(this.amapManager.getMap());
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

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .amap-wrapper {
    width: 500px;
    height: 500px;
  }

</style>
