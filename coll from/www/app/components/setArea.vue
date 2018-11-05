<template>
    <div class="typeTestArea">
       <h3>设置题目</h3>
       <div class="con">
           标题：<input type="text" v-model="item.title"/>
       </div>
       <div class="con">
           是否必填<input type="checkbox" v-model="item.required"/>
       </div>
       <div class="con">
           题目类型：
           <input type="radio" value="singleOption" v-model="item.type" />单选
           <input type="radio" value="multipleOption" v-model="item.type" />多选
           <input type="radio" value="menuOption" v-model="item.type" />下选
       </div>
       <div class="con">
            <!-- 题目选项（更改之后，鼠标离开后双向修改 -->
            <div class="options" ref="option">
                <p v-for="(option,index) in item.option" :key="index">
                    <input type="text" v-model="option.v">
                    <span class="del" @click="delBtn(index)"></span>
                    <span class="changeOrder"></span>
                </p>
            </div>
             <button class="addoption" @click="addOption">添加新选项</button>
       </div>
    </div>
</template>
<script>
    export default {
        props:["item"],
        methods:{
            addOption(){
                this.item.option.push({"v":""});
            },
            delBtn(index){
                this.item.option.splice(index, 1);
            }
        },
        mounted(){
            var startIndex = 0; //全局变量
            var self = this;
            $(this.$refs.option).sortable({
                handle:".changeOrder",  //限制拖拽的对象
                //拖拽开始
                start:function(e, ui) {
                    // 获取当前拖拽的编号
                    startIndex = $(ui.item).index();
                },
                //拖拽结束
                stop:function(e,ui){
                    //拖拽结束后的编号
                    var endIndex = $(ui.item).index();
                    //视图中题目的选项也要跟着变化（头删尾插）
                    //从startIndex删除1项
                    var delOption = self.item.option.splice(startIndex,1)[0];

                    //从endIndex的位置添加之前删除的项
                    self.item.option.splice(endIndex,0 ,delOption)
                }
            })
        }
    }
</script>
<style lang='stylus'>
    .typeTestArea{
        padding:20px;
        .con{
            line-height: 150%;padding:10px 0;
        }
        input[type="text"]{
            width: 230px;height: 30px;
            color: #666;
            border-radius: 5px;
            border: 1px solid #ddd;
            padding-left: 5px;
        }
        .addoption{
            width: 230px;
            height: 35px;
            background: #2db7f5;
            color: #fff;
            border-radius: 6px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            border:none;
        }
        .addoption:hover{background:#18b666;}
        .options input{margin-bottom:10px;}
        .del,.changeOrder{
            display: inline-block;width: 16px;height: 16px;padding:2px;
            background:url(/images/del.svg);background-size:cover;
            position: relative;top:6px;left:5px;
        }
        .changeOrder{background: url(/images/order.svg);cursor:move;}
    }
</style>