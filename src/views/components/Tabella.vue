<script>
export default {
  name: "TabellaNumeri",
  props:{
    numberClick: Function,
    numberData: Array,
    numberBlinking: Array
  },
  data(){
    return {

    }
  },
  mounted() {

  },
  methods:{}
}
</script>

<template>
  <table class="minitable"  cellspacing="0">
    <tr v-for="n in 9" :key="n" class="row">
      <td v-for="m in 10" :key="m" :class="{
        'cell': true,
        'active': numberData.includes((10*(n-1) + m)) && numberData[numberData.length-1] != (10*(n-1) + m),
        'blinking': numberBlinking.includes((10*(n-1) + m)),
        'latest': numberData.includes((10*(n-1) + m)) && numberData[numberData.length-1] == (10*(n-1) + m)
      }" v-on:click="numberClick(10*(n-1) + m)">
        {{(10*(n-1) + m)}}
      </td>
    </tr>
  </table>
</template>

<style>
.minitable{
  height: 100%;
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-family: 'Chivo Mono', monospace;
}
.cell{
  border-color: black;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
}
.active{
  background-color: #ffcc00;
}
.latest{
  background-color: #ff6200;
}
.blinking {
  animation: cambioSfondo 1s infinite;
}
@keyframes cambioSfondo {
  0%, 49.99% {
    background-color: red;
  }
  50%, 100% {
    background-color: #21ff03;
  }
}


</style>
