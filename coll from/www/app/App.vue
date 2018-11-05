<template>
    <div class="wrap">
        <div class="leftPart">
            <typeTestArea></typeTestArea>
        </div>
        <div class="centerPart">
            <div :class="{outerBox:true,onedit:$store.state.nowedit == index+1}" v-for="(item,index) in q">
                <!-- <singleOption class="cbox"></singleOption> -->
                <!-- :is="item.type"表示要显示的选项类型 -->
                <div :is="item.type" class="cbox" :item="item" :index="index"></div>
                <span :data-index="index" class="edit" @click="$store.commit('changeNowEdit', {nowedit:index+1})"></span>
                <span :data-index="index" class="up"></span>
                <span :data-index="index" class="down"></span>
            </div>
        </div>
        <div class="rightPart">
            <setArea v-if="$store.state.nowedit != 0" :item="q[$store.state.nowedit-1]"></setArea>
        </div>
    </div>
</template>
<script>
    import singleOption from "./components/singleOption.vue";
    import multipleOption from "./components/multipleOption.vue";
    import menuOption from "./components/menuOption.vue";
    import setArea from "./components/setArea.vue";
    import typeTestArea from "./components/typeTestArea.vue";

    export default {
        components:{
            singleOption,
            multipleOption,
            menuOption,
            setArea,
            typeTestArea
        },
        // methods:{
        //     changeNowEdit(nowedit){
        //         this.$store.commit("changeNowEdit", {nowedit})
        //     }
        // },
        data(){
            return {
                q:[
                    {
                        "title":"你觉得下面哪个学校牛叉？",
                        "type" :"singleOption",
                        "option":[
                            {"v":"家里蹲大学"},
                            {"v":"英国贱桥大学"},
                            {"v":"美国麻绳礼工"},
                            {"v":"蓝翔技工学校"}
                        ],
                        "required":false  //是否为必填项
                    },
                    {
                        "title":"你喜欢吃的食物？",
                        "type" :"multipleOption",
                        "option":[
                            {"v":"榴莲"},
                            {"v":"香蕉"},
                            {"v":"葡萄"},
                            {"v":"梨子"}
                        ],
                        "required":false  //是否为必填项
                    },
                    {
                        "title":"治疗失眠最有效的方法是？",
                        "type" :"menuOption",
                        "option":[
                            {"v":"吃安眠药"},
                            {"v":"看国产电视剧"},
                            {"v":"催眠术"},
                            {"v":"用大锤打晕"}
                        ],
                        "required":false  //是否为必填项
                    }
                ]
            }
        },
        //组件上树后的生命周期钩子
        mounted(){
            var self = this;
            //draggable（拖拽）和sortable(拖拽排序)结合使用
            //拖拽
            $(".typeTestArea li").draggable({
                connectToSortable:".centerPart", //可拖拽到什么位置
                helper:"clone",  //克隆拖拽
                revert:"invalid" //拖拽停止时，归位动画
            });
            //拖拽排序
            $(".centerPart").sortable({
                cancel:".cbox, span", //禁止从匹配的元素上拖拽排序
                //当排序停止时触发该事件
                stop:function(event,ui){
                    //获取拖拽后的排序编号和data-titletype属性值
                    var index = $(ui.item[0]).index();
                    var titleType = $(ui.item[0]).data("titletype");

                    //拖拽后题目名称消失
                    $(ui.item[0]).remove();

                    //然后从index开始，不删除，添加新项
                    self.q.splice(index, 0, {
                        "title":"一个新的题目，请编辑",
                        "type" :"menuOption",
                        "option":[
                            {"v":"新选项A"},
                            {"v":"新选项B"},
                            {"v":"新选项C"},
                            {"v":"新选项D"}
                        ],
                        "required":false  //是否为必填项
                    });
                    //拖拽添加题目完成后，让新的题目变成当前编辑状态
                    self.$store.commit("changeNowEdit",{nowedit:index+1})
                }
            })
            //事件委托，上箭头、下箭头、编辑按钮
            //向上排序交换数组的位置
            $(".centerPart").on("click",".up",function(event){
                var index = $(this).data("index"); //获取题目编号
                if(index > 0){ //如果大于0即可交换位置
                    //尾删头插
                    //temp是要添加的新项（就是被点击之后删除的那一项）
                    var temp = self.q.splice(index, 1)[0];
                    //从当前的上一题开始，删0项，添加新项
                    self.q.splice(index-1, 0, temp)
                }
            })

            $(".centerPart").on("click",".down",function(event){
                var index = $(this).data("index"); //获取题目编号
                var temp = self.q.splice(index, 1)[0];
                //从当前的上一题开始，删0项，添加新项
                self.q.splice(index+1, 0, temp)
            })
        }
    }
</script>
<style lang='stylus'>
    .wrap{
        width: 1300px;
        min-height:500px;
        margin:50px auto;overflow: hidden;
        .leftPart, .rightPart{
            float: left;
            width: 350px;
            min-height:500px;
            background: #ccc;
        }
        .centerPart{
            float: left;
            width: 600px;
            min-height:500px;
            padding: 20px;
            overflow: hidden;
            box-sizing:border-box;background: #fff;
            .outerBox{
                width: 500px;position: relative;
                .cbox{
                    width: 500px;padding:10px 0px;
                    border-bottom:1px solid #eee;position: relative;
                    .qTitle{
                        font-size:18px;font-weight:bold;margin-bottom:10px;
                    }
                    label{margin-right:10px; cursor: pointer;}
                    select{
                        width: 300px;height: 30px;
                        border: 1px solid #bdbdbd;border-radius:6px;
                    }
                }
                .edit{
                    position: absolute;right:20px;top:15px;
                    width: 20px;height: 20px;
                    background:url(/images/edit.svg);
                    background-size:cover;display: none;
                }
                .down{
                    position: absolute;right:50px;top:15px;
                    width: 16px;height: 16px;
                    background:url(/images/down.svg);
                    background-size:cover;display: none;
                }
                .up{
                    position: absolute;right:80px;top:15px;
                    width: 16px;height: 16px;
                    background:url(/images/up.svg);
                    background-size:cover;display: none;
                }
                &:hover .edit, &:hover .down ,&:hover .up{display: block;}
                &.onedit{animation:donghua 0.5s linear infinite alternate;}
                @-webkit-keyframes donghua{
                    0%{box-shadow:0 0 0 red;}
                    100%{box-shadow:0 0 20px red;}
                }
            }
        }
    }
</style>