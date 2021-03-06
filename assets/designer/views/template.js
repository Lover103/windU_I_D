jQuery(function($) {
    var Template = loadTemplate("../assets/designer/views/template/templateItem.html");
    var desTemplateItemView = Backbone.View.extend({
        initialize : function() {
            this.model.templateItemView = this;
            this.listenTo(this.model.items, "add", this.add);
            this.listenTo(this.model, "change:uuid", this.change);
            this.render();

        },
        render : function() {
            this.$el = $(Template(this.model.toJSON()));
            this.delegateEvents();
            return this;
        },
        events : {
            "click .del-controls" : function(e) {
                window.desUIEditorMobileViewInstance.removeItem(this.model.view);
                e.stopPropagation();
            },
            "click .top-controls" : function(e) {
                var col = this.model.collection;
                col.remove(this.model);
                col.unshift(this.model,{silent:true});
                var view = this.model.templateItemView;
                $("ul:first", this.model.parentView.$el).prepend(view.$el);
                this.model.view.$el.parent().prepend(this.model.view.$el);
            },
            "click .bottom-controls" : function(e) {
                var col = this.model.collection;
                col.remove(this.model);
                col.push(this.model,{silent:true});
                var view = this.model.templateItemView;
                $("ul:first", this.model.parentView.$el).append(view.$el);
                this.model.view.$el.parent().append(this.model.view.$el);
            },
            "click" : function(e) {
                this.model.view.focus();
                e.stopPropagation();
            }
        },
        bindings : {
        },
        change : function(data) {
            $(".control-item-name:first", this.$el).text(data.changed.uuid);
        },
        add : function(model) {
            var view = model.templateItemView || new desTemplateItemView({
                model : model
            });
            model.parentView = this;
            $("ul:first", this.$el).append(view.$el);
        }
    });
    var desTemplateView = Backbone.View.extend({
        initialize : function() {
            this.listenTo(this.collection, "add", this.add);
        },
        collection : new Backbone.Designer.Items(),
        events : {
           "click .root-item":function(){
               window.desUIEditorMobileViewInstance.focus();
               $(".root-item",this.$el).addClass("control-item-focus");
           }
        },
        focusView : this,
        bindings : {
        },
        add : function(model) {
            var view = model.templateItemView || new desTemplateItemView({
                model : model
            });
            model.parentView = this;
            $("ul:first", this.$el).append(view.$el);
        },
        focusItem : function(view) {
            $("li>div", this.$el).removeClass("control-item-focus");
            $(".root-item",this.$el).removeClass("control-item-focus");
            if (view.model.templateItemView) {
                $("div:first", view.model.templateItemView.$el).addClass("control-item-focus");
            } else {
            }
        }
    });
    window.desTemplateRootViewInstance = new desTemplateView({
        el : "#control_tree "
    });
});

