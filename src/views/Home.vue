<template>
  <v-sheet class="d-flex flex-wrap justify-center">
    <v-sheet class="ma-2 pa-5 tabella align-self-sm-center">
      <tabella-numeri :number-blinking="numberBlinking" :number-data="numberActive"
                      :number-click="toggleNumber"></tabella-numeri>
    </v-sheet>
    <v-card class="ma-2 pa-5 align-self-sm-center" style="width: 400px">
      <h2 class="mb-8">Storia</h2>
      <v-virtual-scroll
        :height="500"
        :width="400"
        :items="history"
      >
        <template v-slot:default="{ item }">
          <v-list-item
            :title="item.titolo"
            :subtitle="new Date(item.data).toLocaleString()"
          >
            <template v-slot:prepend>
              <h3 class="ma-3">{{item.numero}}</h3>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>
    <v-card class="ma-2 pa-5 text-center align-self-sm-center" width="400px" >
      <h2 class="mb-8">Imposta i premi ancora disponibili</h2>
      <v-list-item
        v-for="(i,k) in prized"
        :key="i"
        :title="k"
        style="text-align: left"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-star"></v-icon>
        </template>
        <template v-slot:append >
          <v-text-field style="width: 80px" v-model="prized[k]" label="Qty" type="number" min="0" max="90"  @change="saveSync"></v-text-field>
        </template>
      </v-list-item>
    </v-card>
    <v-card class="ma-2 pa-5 text-center align-self-sm-center" width="300px" >
      <h2 class="mb-8">Inserisci da tastiera</h2>
      <v-text-field v-model="textField" ref="inputNumber" label="Numero" type="number" min="1" max="90"></v-text-field>
      <v-btn prepend-icon="mdi-dice-5" @click="random">Estrazione randomica</v-btn>

    </v-card>
    <v-card class="ma-2 pa-5 text-center align-self-sm-center" width="300px" >
      <h2 class="mb-8">Azioni</h2>
      <v-btn prepend-icon="mdi-lock-open" v-if="wwd === null" class="mb-2" @click="openT">Apri il tabellone</v-btn>
      <v-btn prepend-icon="mdi-lock" v-else class="mb-2" @click="closeT">Chiudi il tabellone</v-btn>
      <v-btn prepend-icon="mdi-backup-restore" class="mb-2" @click="restart">Ricomincia</v-btn>
      <v-btn prepend-icon="mdi-broom" class="mb-2" @click="clear">Cancella tutta la cache</v-btn>
      <p>Tip: Premi F11 sul monitor con la scheda aperta per mettere full screen</p>
    </v-card>
  </v-sheet>
</template>

<script>
import TabellaNumeri from "@/views/components/Tabella.vue";
import {v4} from 'uuid';

export default {
  name: "AdminList",
  components: {TabellaNumeri},
  data() {
    return {
      numberActive: [],
      numberBlinking: [],
      history:[],
      textField: "",
      prized: {
        "Ambo":1,
        "Terna": 1,
        "Quaterna": 1,
        "Cinquina": 1,
        "Tombola": 1
      },
      id:"",
      wwd: null
    }
  },
  mounted() {
    this.saveSync()
    var inp = this.$refs.inputNumber;
    let exporter = this;
    inp.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        exporter.toggleNumber(exporter.textField)
        exporter.textField = "";
      }
    });

  },
  methods: {
    openT(){
      this.wwd = window.open("./#/view/" + this.id, this.id,`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`)
    },
    closeT(){
      if (this.wwd!==null){
        this.wwd.close()
        this.wwd = null;
      }
    },
    restart(){
      this.closeT()
      localStorage.setItem("last","")
      document.location.reload()
    },
    clear(){
      localStorage.clear()
      document.location.reload()
    },
    random(){
      if (this.numberActive >= 90) return;
      // eslint-disable-next-line no-constant-condition
      while (true){
        let n = Math.floor(Math.random() * 91)
        if (!this.numberActive.includes(n)){
          this.toggleNumber(n)
          return;
        }
      }
    },
    saveSync(){
      if (this.id===""){
        let last = localStorage.getItem("last")
        if (last===null||last===""){
          this.id=v4();
          localStorage.setItem("last",this.id)
        }else{
          this.id=last;
          let da = localStorage.getItem(this.id);
          da = JSON.parse(da)
          this.numberActive  = da.numberActive;
          this.history = da.history;
          this.prized = da.prized;
        }
      }
      let data = {
        numberActive:this.numberActive,
        history:this.history,
        prized:this.prized,
        numberBlinking:this.numberBlinking
      }
      localStorage.setItem(this.id,JSON.stringify(data))
      if (this.wwd!==null){
        this.wwd.eval('window.postUpdate()')
      }
    },
    toggleNumber(number) {
      let n = parseInt(number);
      if (!isNaN(n) && n > 0 && n <= 90) {
        if (this.numberActive.includes(n)) {
          this.history.unshift({
            titolo: "Rimosso",
            numero: n,
            data: new Date().getTime()
          })
          const index = this.numberActive.indexOf(n);
          if (index > -1) {
            this.numberActive.splice(index, 1);
          }
        } else {
          this.history.unshift({
            titolo: "Aggiunto",
            numero: n,
            data: new Date().getTime()
          })
          this.numberActive.push(n)
          this.numberBlinking.push(n)
          let exporter= this;
          setTimeout(function (){
            const index = exporter.numberBlinking.indexOf(n);
            if (index > -1) {
              exporter.numberBlinking.splice(index, 1);
            }
            exporter.saveSync()
          },5000)
        }
        this.saveSync()
      }
    }
  }
}
</script>
<style scoped>
.tabella {
  width: 600px;
  height: 600px;
  font-size: 30px;
}
</style>
