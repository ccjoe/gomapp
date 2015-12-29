define(function() { return function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<script id="ui.button" type="text/template">\n<button class="btn btn-{{= data.type }} {{= data.outline ? \'btn-outlined\':\'\'}} {{= data.isblock ? \'btn-block\' : \'\'}}">\n    {{ if(data.icon){ }}<span class="icon {{= data.icon }}"></span>{{ } }}\n    {{= data.title }}\n    {{ if(data.badge!==void 0){ }}\n    <span class="badge badge-{{= data.type}}">{{=data.badge}}</span>\n    {{ } }}\n</button>\n</script>\n\n<script id="ui.header" type="text/template">\n{{ _.each([\'left\', \'right\'], function(posi){ }}\n{{ var type= data[posi].type, text = data[posi].text, icon=data[posi].icon || \'icon-\'+posi+\'-nav\'; }}\n{{ if(type === \'button\'){ }}<button class="btn pull-{{=posi}}">{{= text }}</button>{{ } }}\n{{ if(type === \'icon\'){  }}<a class="icon {{= icon }} pull-{{=posi}}">{{= text }}</a>{{ } }}\n{{ if(type === \'link\'){  }}<button class="btn btn-link btn-nav pull-{{=posi}}">{{= text }}</button>{{ } }}\n{{ }); }}\n\n<div class="title-wrapper {{=data.subtitle ? \'title-ms\' : \'\'}}">\n    <h1 class="title">{{=data.title}}</h1>\n    {{ if(data.subtitle){ }}<h2 class="subtitle">{{=data.subtitle}}</h2>{{ } }}\n</div>\n</script>\n\n<script id="ui.list" type="text/template">\n{{= data.card ? \'<div class="card">\' : \'\' }}\n<ul class="table-view">\n    {{ _.each(data.list, function(item){ }}\n\n    <li class="{{= item.isDivider?\'table-view-divider\':\'table-view-cell\' }}{{= item.collapse ? \' table-view-collapse\' : \'\' }}">\n        {{ if(item.isDivider){ }}{{=item.title}}{{ return; } }}\n        <a class="navigate-right" href="{{= item.hash ? item.hash : \'javascript:\' }}">\n            {{ if(item.badge !== void 0){ }}\n            <span class="badge">{{=item.badge}}</span>\n            {{ } }}\n            {{ if(data.media){ }}\n            {{ if(data.media === \'img\' && item.img){ }}\n            <img class="media-object pull-left" src="{{= item.img }}">\n            {{ }else{ }}\n            <span class="media-object pull-left icon {{= item.icon }}"></span>\n            {{ } }}\n            {{ } }}\n            <div class="media-body">\n                {{=item.title}}\n                <p>{{=item.content}}</p>\n            </div>\n        </a>\n    </li>\n    {{  }); }}\n</ul>\n{{= data.card ? \'</div>\' : \'\' }}\n</script>\n\n<script id="ui.modal" type="text/template">\n{{ if(data.type.indexOf(\'toast\') === -1 ){ }}\n<div class="{{=data.type != \'loading\' ? \'modal-layout\' : \'\'}} modal-{{=data.type}} {{=data.class}}">\n    {{ if(data.close===true){ }} <span class="icon icon-close"></span> {{ } }}\n    <div class="modal-inner">\n        {{ if(data.type === \'loading\'){ }}\n        <div class="spinner">\n            <div class="double-bounce1"></div>\n            <div class="double-bounce2"></div>\n        </div>\n        {{ }else{ }}\n        <div class="modal-title">\n            {{if(data.type===\'bottom\' && data.btns.yes && data.btns.no){ }}<span class=\'btn modal-btn btn-link modal-btn-no\'>{{=data.btns.no}}</span>{{=data.title}}<span class=\'btn modal-btn btn-link modal-btn-yes\'>{{=data.btns.yes}}</span>\n            {{ }else{ }}  {{=data.title}}  {{ } }}\n        </div>\n        <div class="modal-text">{{=data.content}}</div>\n        {{ } }}\n    </div>\n    {{ var btns = data.btns; if(btns && (data.type!==\'bottom\')){ }}\n    <div class="modal-buttons">\n        {{ if(btns.yes){ }}<span class="modal-button modal-btn modal-btn-yes modal-button-bold">{{= btns.yes}}</span> {{ } }}\n        {{ if(btns.no){ }}<span class="modal-button modal-btn modal-btn-no modal-button-bold">{{= btns.no}}</span> {{ } }}\n        {{ if(btns.cancel){ }}<span class="modal-button modal-btn modal-btn-def modal-button-bold">{{= btns.def}}</span> {{ } }}\n    </div>\n    {{ } }}\n</div>\n{{ }else{ }}\n<div class="modal-toast modal-{{=data.type}}" >\n    {{var type = data.type.match(/toast-(\\w+)/)[1] }}\n    <span class="icon icon-{{= type===\'info\' ? \'info\' : (type===\'error\'?\'close\': \'check\')  }}">{{=data.content}}</span>\n</div>\n{{ } }}\n</script>\n\n<script id="ui.sides" type="text/template">\n<div class="sides-overlay"></div>\n<div class="sides sides-{{= data.position }}"></div>\n</script>\n\n<script id="ui.switch" type="text/template">\n{{ var switchType = /(^\\w+)-?(\\w+)?/.exec(data.type), isSlide = switchType[1]===\'slide\', position = switchType[2];}}\n<div class="switch-container slide-container {{= isSlide ? \'slide-container-\'+position : \'tab-container slide-container-horizontal\'}}">\n    {{ if(isSlide || (!isSlide && position===\'top\')){ }}\n    <div class="switch-pagination {{= isSlide ? \'slide-pagination\' : \'segmented-control\'}}">\n        {{ _.each(data.list, function(item, i){ }}\n            <span  index="{{=i}}" class="switch-pagination-bullet {{= isSlide ? \'slide-pagination-bullet\' : \'control-item\'}} {{= i===0 ? \'active\' : \'\' }}">{{=item.title}}</span>\n        {{ }); }}\n    </div>\n    {{ } }}\n    <div class="switch-wrapper slide-wrapper" index="0">\n        <!--<div class="slide-slide slide-slide-active"></div>\n        <div class="slide-slide slide-slide-next"></div>-->\n        {{_.each(data.list, function(item, i){ }}\n            <div class="switch-item control-content">{{=item.content}}</div>\n        {{ }); }}\n    </div>\n    {{ if(!isSlide && position===\'bottom\'){ }}\n    <nav class="bar bar-tab switch-pagination">\n        {{ _.each(data.list, function(item, i){ }}\n        <a class="tab-item switch-pagination-bullet {{= i===0 ? \'active\' : \'\' }}" href="#" index="{{=i}}">\n            {{ if(item.icon){ }}<span class="icon {{=item.icon}}"></span> {{ } }}\n            <span class="tab-label">{{=item.title}}</span>\n        </a>\n        {{ }); }}\n    </nav>\n    {{ } }}\n</div>\n</script>\n';}return __p;} });