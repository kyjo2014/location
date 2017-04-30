<template>
  <div class="map">
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
        picked: '',
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
          showCircle: false,
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
    mounted() {

    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      reply: function (val) {
        this.$set(this.markers, val.user, val)
      }
    },
    methods: {
      getName(name) {
        return `<div style='width:50px;height:50px;background:red'>${name}</div>`
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
        }, 1000)
        console.log(instance.watchPosition())
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
<style lang="css">


</style>
