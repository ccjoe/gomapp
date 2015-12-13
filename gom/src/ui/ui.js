define(function(require){
    /**
     * 所有UI组件的集合, 引入组件可以通过注入UI模块,引用某一个组件可以通过UI.ComponentsName 或是 直接引入ComponentName(如Button)
     * @class Gom.UI
     * @alias UI
     */
    return {
        Button: require('Button'),
        Header: require('Header'),
        List:   require('List'),
        Modal:  require('Modal'),
        Sides:  require('Sides'),
        Scroll:  require('Scroll'),
        Slide:  require('Slide'),
        Select: require('Select'),
        Toggle: require('Toggle')
    }
});
