$(document).ready(function() {
    defaultParameters = {
        collapsible: true,
        heightStyle: "content",
        icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }
    }

    $(".accordion-element-open-initial").accordion(defaultParameters);
    $(".accordion-element").accordion({...defaultParameters, ...{active: false} });
});