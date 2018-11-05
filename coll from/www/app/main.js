import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        nowedit:1 //当前编辑的题号
    },
    mutations:{
        //修改全局的nowedit
        changeNowEdit(state,{nowedit}){
            state.nowedit = nowedit
        }
    }
})

new Vue({
    el:"#app",
    store,
    render:(h)=>h(App)
})