jQuery(function($) {

    var pro_templates = {
        "select" : loadTemplate("../assets/designer/views/template/pro_select.html"),
        "input" : loadTemplate("../assets/designer/views/template/pro_input.html"),
        "checkbox" : loadTemplate("../assets/designer/views/template/pro_checkbox.html"),
        "icon" : loadTemplate("../assets/designer/views/template/pro_icon.html"),
    }
    var desUIControlsPropertiesView = Backbone.View.extend({
        initialize : function() {
        },
        el : '#desUIControlsProperties',
        events : {
            "click .del-width" : function(e) {
                this.model.unset("size_w");
            },
            "click .del-height" : function(e) {
                this.model.unset("size_h");
            },
            "click .full-width" : function(e) {
                this.model.set("size_w", "100%");
            },
            "click .full-height" : function(e) {
                this.model.set("size_h", "100%");
            },
            "click .del-offset" : function(e) {
                this.model.unset("offset_x");
                this.model.unset("offset_y");
            },
            "click .lock-size" : function(e) {
                var val = !this.model.get("on/off_size");
                this.model.set("on/off_size", val);
                $(e.toElement).removeClass( val ? "fa-lock" : " fa-unlock");
                $(e.toElement).addClass( val ? "fa-unlock" : " fa-lock");
            },
            "click .lock-offset" : function(e) {
                var val = !this.model.get("on/off_offset");
                this.model.set("on/off_offset", val);
                $(e.toElement).removeClass( val ? "fa-lock" : " fa-unlock");
                $(e.toElement).addClass( val ? "fa-unlock" : " fa-lock");
            },
            "click .del-controls" : function(e) {
                if (window.desUIEditorMobileViewInstance.$current != window.desUIEditorMobileViewInstance) {
                    window.desUIEditorMobileViewInstance.$current.model.templateItemView.remove();
                    window.desUIEditorMobileViewInstance.$current.remove();
                    window.desUIEditorMobileViewInstance.$current = window.desUIEditorMobileViewInstance;
                }
            },
            "click #pro_btn_css" : function(e) {
                var val = $("#pro_con_css").val();
                $("#css-select-form")[0].options = {
                    val : val,
                    input : "#pro_con_css"
                };
                $("#css-select-form").modal();
            }
        },
        bindings : {
            "#pro_con_name" : "uuid",
            "#pro_con_flex" : "flex",
            "#pro_con_position" : "position",
            "#pro_con_layout" : {
                observe : "layout",
                updateView : function(val) {
                    val == "box" && $(".box_layout", this.$el).removeClass("hide");
                    val == "box" || $(".box_layout", this.$el).addClass("hide");
                    return true;
                },
                updateModel : function(val, event, options) {
                    val == "box" && $(".box_layout", this.$el).removeClass("hide");
                    val == "box" || $(".box_layout", this.$el).addClass("hide");
                    return true;
                }
            },
            "#pro_con_size_w" : "size_w",
            "#pro_con_size_h" : "size_h",
            "#pro_con_offset_x" : {
                observe : "offset_x",
                update : function($el, val, model, options) {
                    $el.val(parseInt(val));
                }
            },
            "#pro_con_offset_y" : {
                observe : "offset_y",
                update : function($el, val, model, options) {
                    $el.val(parseInt(val));
                }
            },
            ".lock-offset" : {
                observe : "on/off_offset",
                update : function($el, val, model, options) {
                    $el.removeClass( val ? "fa-lock" : " fa-unlock");
                    $el.addClass( val ? "fa-unlock" : " fa-lock");
                }
            },
            ".lock-size" : {
                observe : "on/off_size",
                update : function($el, val, model, options) {
                    $el.removeClass( val ? "fa-lock" : " fa-unlock");
                    $el.addClass( val ? "fa-unlock" : " fa-lock");
                }
            },
            ".align_hor input" : {
                observe : "layout_pack",
                events : ["change"],
                initialize : function($el, model, options) {
                    var obj = $("[value='" + model.get("layout_pack") + "']", this.$el);
                    $(obj.parent()).addClass("active");
                }
            },
            "#box_align_orient input" : {
                observe : "layout_orient",
                events : ["change"],
                initialize : function($el, model, options) {
                    model.get("layout_orient") == "ub-ver" ? $el.parent().addClass("active") : $el.parent().removeClass("");
                    model.get("layout_orient") == "ub-ver" ? $("i", $el.parent()).addClass("fa-rotate-90") : ($el.parent()).removeClass("fa-rotate-90");

                },
                updateModel : function(val, event, options) {
                    val == "ub-ver" ? $("#box_align_orient i", this.$el).addClass("fa-rotate-90") : $("#box_align_orient i", this.$el).removeClass("fa-rotate-90");
                    return true;
                }
            },
            "#box_align_dir input" : {
                observe : "layout_dir",
                events : ["change"],
                initialize : function($el, model, options) {
                    model.get("layout_dir") == "ub-rev" ? $el.parent().addClass("active") : $el.parent().removeClass("");
                }
            },
            "#pro_con_css" : {
                observe : "css",
                events : ["blur"],
                "update" : function($el, val) {
                    var tag_input = $("#pro_con_css", this.$el);
                    var $tag_obj = tag_input.data('tag');
                    for(var i= $tag_obj.values.length-1;i>=0;i--){
                        $tag_obj.remove(i);
                    }
                    if (val) {
                        var items = val.split(",");
                        for (var i in items)
                            $tag_obj.add(items[i]);
                    }

                }
            }
        },
        bind : function(control) {
            this.unstickit();
            var $ext = $("#pro_ext_options", this.$el);
            $ext.empty();
            this.model = control.model;
            this.stickit();
            this.custom();

        },
        custom : function() {
            var options = this.model.extOptions;
            var $ext = $("#pro_ext_options", this.$el);
            for (var i in options) {
                var option = options[i];
                var template = pro_templates[option.type];
                var $pro_el = $(template(option));
                $ext.append($pro_el);
                switch(option.type) {
                case "input":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"]
                    });
                    break;
                case "icon":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"],
                        "update" : function($el, val) {
                            var tag_input = $("#pro_" + option.name);
                            try {
                                tag_input.tag({
                                    placeholder : tag_input.attr('placeholder'),
                                    //enable typeahead by specifying the source array
                                    //source : ace.vars['US_STATES'],//defined in ace.js >> ace.enable_search_ahead
                                })

                                //programmatically add a new
                                var $tag_obj = tag_input.data('tag');
                                var items = val.split(",");
                                for (var i in items)
                                $tag_obj.add(items[i]);

                                tag_input.on("added", function() {
                                    $(this).blur();
                                })
                                tag_input.on("removed", function() {
                                    $(this).blur();
                                })
                            } catch(e) {
                                console.log(e.message)
                            }
                        }
                    });
                    break;
                default:
                    this.addBinding(null, "#pro_" + option.name, option.name);
                    break;
                }
            }
        }
    });
    window.desUIControlsPropertiesViewInstance = new desUIControlsPropertiesView();
});
