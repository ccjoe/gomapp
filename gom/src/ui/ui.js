define(function(require){
    /**
     * @class UI
     */
    return {
        /**
         * @class UI.Button
         * @alias Button
         * @extends {View}
         */
        Button: require('Button'),
        /**
         * @class UI.Header
         * @alias Header
         * @see Header
         * @extends {View}
         */
        Header: require('Header'),
        /**
         * @class UI.List
         * @alias List
         * @extends {View}
         */
        List:   require('List'),
        /**
         * @class UI.Modal
         * @alias Modal
         * @extends {View}
         */
        Modal:  require('Modal'),
        /**
         * @class UI.Sides
         * @alias Sides
         * @extends {View}
         */
        Sides:  require('Sides'),
        /**
         * @class UI.Scroll
         * @alias Scroll
         * @extends {View}
         */
        Scroll:  require('Scroll'),
        /**
         * @class UI.Slide
         * @alias Slide
         * @extends {View}
         */
        Slide:  require('Slide'),
        /**
         * @class UI.Select
         * @alias Select
         * @extends {View}
         */
        Select: require('Select'),
        /**
         * @class UI.Toggle
         * @alias Toggle
         * @extends {View}
         */
        Toggle: require('Toggle')
    }
});
