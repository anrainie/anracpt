/**
 * 组件包，这里应该靠用AMD模式来写。
 * @type {{created: myMixin.created, data: (()), methods: {hello: myMixin.methods.hello}}}
 */
window.Component = window.Component || {};

/**
 * 绑定
 * @param el 指定对象的el
 * @param cpt 组定的组件名
 * @returns {*}
 */
Component.bind = function (el, cpt) {
    var x = $('<temp></temp>');
    $(el).append(x);
    var C = cpt.extend({
        el: x.get(0)
    });
    return new C();
};

/**
 * 画板元素
 * @type {*}
 */
Component.PaletteItem = Vue.extend({
    template: '<div>{{model.name}}</div>',
    props: ['model'],
    mixins: [
        {
            mounted(){
                //让画板元素可以被拖拽
                $(this.$el).draggable({
                    revert: true
                });
            },
            methods: {
                init: function (item) {
                }
            },
        }
    ],
});

/**
 * 画板
 * props:[items]
 * @type {*}
 */
Component.Palatte = Vue.extend({
    template: '<ol><li v-for="(item,index) in items"><pitem class="paletteItem" :model="item" :idx="index"><pitem></pitem></li></ol>',
    mixins: [
        {
            created: function () {

            },
            props: {
                items: {
                    type: Array,
                    default: [],
                }
            },
            data(){
                return {}
            },
            methods: {
                init: function (item) {
                }
            },
            components: {
                pitem: Component.PaletteItem
            }
        }
    ],
});

var common = {
    mounted(){
        var el = $(this.$el);
        var self = this;
        el.draggable({
            containment: 'parent',
            stop(e){
                if (self.model.style)
                    for (var s in self.model.style)
                        self.model.style[s] = $(this).get(0).style[s];
            }
        });
        el.resizable({
            stop(e){
                if (self.model.style)
                    for (var s in self.model.style)
                        self.model.style[s] = $(this).get(0).style[s];
            },

        });

        //双击打开对话框
        el.dblclick(() => {
            window.__dialog = window.__dialog || Component.bind($('#dialog'), Component.Dialog);
            window.__dialog.open(this);
        });
        //增加Action
        el.bind({
            mouseenter: function () {
            },
            mouseleave: function () {
            }
        })
    },
    setModel(model){
        this.model = model;
    }
};


/**
 * 组件属性编辑对话框
 */
Component.Dialog = Vue.extend({
    template: '<div> <div v-for="(val, key, index) in config" :style="val.style">' +
    '<span>{{key}}:</span> ' +
    '<input v-if="val.type==\'Text\'" v-model="model[key]"/>' +
    '<span v-if="val.type==\'Image\'"><input readonly v-model="model[key]"/><button>选择</button></span>' +
    '<span v-if="val.type==\'RichText\'"><textarea  style="val.style" v-model="model[key]"/></span>' +

    '</div></div>',
    mixins: [
        {
            data(){
                return {
                    config: {
                        // key: null,
                    },
                    model: {},
                    owner: {},
                }
            },
            mounted(){
                var self = this;
                $(this.$el).dialog({
                    autoOpen: false,
                    buttons: {
                        '保存': function () {
                            self.close();
                        },
                        '取消': function () {
                            $(self.$el).dialog("close")
                        }
                    }
                });
            },
            methods: {
                open(owner){
                    this.model = JSON.parse(JSON.stringify(owner.model));
                    this.config = owner.propSet[owner.defPropSet];
                    this.owner = owner;
                    $(this.$el).dialog("open");
                },
                close(){
                    this.owner.model = JSON.parse(JSON.stringify(this.model));
                    $(this.$el).dialog("close")
                },
            }
        }]
});

/**
 * 图文组件
 */
Component.ImageAndTextCpt = Vue.extend({
    template: '<div class="imageAndTextCpt" style="word-wrap:break-word" :style="model.style">' +
    '<img align="left" hspace="5" vspace="5" :src="model.image" :style="model.imageStyle"/>' +
    '{{model.text}}</div>',
    mixins: [
        {
            props: {
                model: {
                    default: {},
                }
            },
            data(){
                return {
                    propSet: {
                        0: {
                            image: {type: 'Image'},
                            text: {
                                type: 'RichText', style: {
                                    position: 'absolute',
                                    height: '100px',
                                    width: '200px',
                                }
                            },
                        },
                        1: {},
                    },
                    defPropSet: 0,
                }
            },
            methods: {},
        },
        common,
    ],
});

Component.ImageListCpt = Vue.extend({
    template: '<div class="ImageListCpt" ><div style="float:left"  :style="model.style" v-for="image in model.images"><img :src="image.src" :style="image.style"/></div></div>',
    mixins: [
        {
            props: {
                model: {
                    default: {},
                }
            },
            methods: {},

        }, common
    ],
});

Component.SwiperCpt = Vue.extend({
    template: '<div class="swiper-container swiper-container-horizontal" :style="model.style">' +
    '<div class="swiper-wrapper">' +
    '<div v-for="(image,index) in model.images" class="swiper-slide " ><img :src="image.src" :style="image.style">{{index}}</div>' +
    '</div>' +
    '<div class="swiper-button-next"></div>' +
    '<div class="swiper-button-prev"></div>' +
    '</div>',
    mixins: [
        {
            props: {
                model: {
                    default: {},
                }
            },
            methods: {},
            mounted(){
                //TODO 仅作为测试使用
                setTimeout(() => {
                    new Swiper('.swiper-container', {
                        loop: true,

                        // 如果需要前进后退按钮
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    })
                });
            },

        }, common
    ],
});