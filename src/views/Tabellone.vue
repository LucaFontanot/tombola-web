<script>
import {useRoute} from "vue-router";
import TabellaNumeri from "@/views/components/Tabella.vue";

export default {
  name: "PopupWindow",
  components: {TabellaNumeri},
  data(){
    return {
      id:"",
      numberActive:[],
      numberBlinking:[],
      history:[],
      prized:{}
    }
  },
  mounted() {
    const route = useRoute()
    this.id= route.params.id;
    let exporter = this;
    window.postUpdate = function (){
      exporter.saveSync();
    }
    this.saveSync()
  },
  methods:{
    saveSync(){
      if (this.id!==""){
        let da = localStorage.getItem(this.id);
        da = JSON.parse(da)
        this.numberActive  = da.numberActive;
        this.numberBlinking = da.numberBlinking;
        this.history = da.history;
        this.prized = da.prized;
      }
    },
  }
}
</script>

<template>
<div>
  <div v-if="numberBlinking.length>0" class="bign blinking" >
    <a>{{numberActive[numberActive.length-1]}}</a>
  </div>
  <div class="d-flex flex-wrap justify-space-evenly">
    <div class="news-bar">
      <div class="news-content">
        Premi rimasti:
        <span class="ml-4" v-for="(i,k) in prized" :key="i" ><span v-if="prized[k]>0">{{k}}: {{prized[k]}}</span></span>
      </div>
    </div>
    <div class="news-bar">
      <div class="news-content">
        Ultimi numeri estratti:
        <span class="ml-4" v-for="i in (numberActive.length>=10? 10 : numberActive.length)" :key="i">{{numberActive[numberActive.length-i]}}</span>
      </div>
    </div>
  </div>
  <tabella-numeri class="tabella" :number-blinking="numberBlinking" :number-data="numberActive"
                  :number-click="function (){}"></tabella-numeri>
</div>
</template>

<style scoped>
.tabella {
  width: 100vw;
  height: 95vh;
  font-size: 60px;
}
.news-bar {
  width: 49vw;
  height: 5vh;
  overflow: hidden;
}

.news-content {
  white-space: nowrap;
  animation: scroll 20s linear infinite;
  font-size: 30px;
  font-weight: bold;
}

@keyframes scroll {
  from {
    transform: translateX(105%);
  }
  to {
    transform: translateX(-105%);
  }
}
.bign{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 400px;
  font-weight: bold;
  text-shadow: -7px 0 black, 0 7px black, 7px 0 black, 0 -7px black;
}
.blinking {
  animation: cambioColor 1s infinite;
}
@keyframes cambioColor {
  0%, 49.99% {
    color: #07ff41;
  }
  50%, 100% {
    color: #ff00dc;
  }
}
</style>
<style>
html{
  overflow: hidden;
}
</style>
