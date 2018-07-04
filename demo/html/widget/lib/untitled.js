_this.dom_styleArea.css({ "display": "none" });
_this.dom_styleArea_button_width_panel.css({ "display": "none" });
_this.dom_styleArea_button_width_a.css({
    "cursor": `${_this.action_lineWidth==_this.action_lineWidth_a?"default":"pointer"}`,
    "background": `${_this.action_lineWidth==_this.action_lineWidth_a?_this.action_color:_this.button_color_disable}`
});
_this.dom_styleArea_button_width_b.css({
    "cursor": `${_this.action_lineWidth==_this.action_lineWidth_b?"default":"pointer"}`,
    "background": `${_this.action_lineWidth==_this.action_lineWidth_b?_this.action_color:_this.button_color_disable}`
});
_this.dom_styleArea_button_width_c.css({
    "cursor": `${_this.action_lineWidth==_this.action_lineWidth_c?"default":"pointer"}`,
    "background": `${_this.action_lineWidth==_this.action_lineWidth_c?_this.action_color:_this.button_color_disable}`
});
_this.dom_styleArea_button_color_panel.css({
    "background": `${_this.action_color}`
});