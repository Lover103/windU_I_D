//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/page.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);

        },
        template : Template, //VIEW对应的模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "Page");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("on/off_offset", false);
            this.set("on/off_size", false);
        },
        extOptions : [{
            type : "none",
            title : "视图模型",
            name : "viewModelName",
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "fed5f05f-70dc-4a0a-b072-658640df6c18",
        name : "Page",
        tip : "应用最基础组件，其他组件都需要部署其中，大部分场景一个界面仅需一个。",
        type : "frame",
        icon : "Page.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
