"use strict";angular.module("superstockApp",["ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","ui.grid","agGrid","ui.grid.pinning","firebase.auth","firebase.ref","ui.slider","btorfs.multiselect","uiSwitch"]),$(document).on("click",".ag-row",function(){var a=$(this),b=a.prop("class").indexOf("click-row");$(".ag-row").removeClass("click-row"),b>-1?a.removeClass("click-row"):a.addClass("click-row")}),angular.module("superstockApp").factory("draw",["$firebaseArray",function(a){var b=function(b,c,d,e,f){var g=a(b),h=[],i=!0;g.$watch(function(a){if(0!=i&&0!=g.length){var b=g[g.length-1],e={};c.idLabel&&(e[c.idLabel]=b.$id);var f=b.$value.split("|");for(var j in c.labelList)c.labelList[j].format.indexOf("percent")>-1?e[c.labelList[j].fieldName]=Math.ceil(1e4*f[j])/100:c.labelList[j].format.indexOf("bigNum")>-1||c.labelList[j].format.indexOf("number")>-1?e[c.labelList[j].fieldName]=parseFloat(f[j]):e[c.labelList[j].fieldName]=f[j];d(e),h.push(e)}}),g.$loaded(function(){i=!1,e(h),b.on("child_added",function(a,b){var d={};c.idLabel&&(d[c.idLabel]=a.key);var e=a.val().split("|");for(var g in c.labelList)c.labelList[g].format.indexOf("percent")>-1?d[c.labelList[g].fieldName]=Math.ceil(1e4*e[g])/100:c.labelList[g].format.indexOf("bigNum")>-1||c.labelList[g].format.indexOf("number")>-1?d[c.labelList[g].fieldName]=parseFloat(e[g]):d[c.labelList[g].fieldName]=e[g];f.added(d,a,b)}),b.on("child_changed",function(a,b){var d={};c.idLabel&&(d[c.idLabel]=a.key);var e=a.val().split("|");for(var g in c.labelList)c.labelList[g].format.indexOf("percent")>-1?d[c.labelList[g].fieldName]=Math.ceil(1e4*e[g])/100:c.labelList[g].format.indexOf("bigNum")>-1||c.labelList[g].format.indexOf("number")>-1?d[c.labelList[g].fieldName]=parseFloat(e[g]):d[c.labelList[g].fieldName]=e[g];f.changed(d,a,b)}),b.on("child_removed",function(a){f.removed(a)})})};return{drawGrid:b}}]),angular.module("superstockApp").factory("utils",function(){return{getCellTemplate:function(a,b){switch(a){case"priceChange":return'<div title="{{COL_FIELD}}" ng-class="{\'ui-grid-cell-contents\': true, \'"grid-cell-red"\': COL_FIELD < 0, \'"grid-cell-green"\': COL_FIELD >= 0}">{{COL_FIELD | number}}</div>';case"EPS":return'<div title="{{COL_FIELD}}" ng-class="{\'ui-grid-cell-contents\': true, \'"grid-cell-red"\': COL_FIELD < 1000, \'"grid-cell-green"\': COL_FIELD > 1000}">{{COL_FIELD | number}}</div>';case"revenueChange":case"EPSChange":case"profitChange":return'<div title="{{COL_FIELD}}" ng-class="{\'ui-grid-cell-contents\': true, \'"grid-cell-red"\': COL_FIELD < 0, \'"grid-cell-green"\': COL_FIELD > 0}">{{COL_FIELD | number}}</div>';case"point":return"<div title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true, '\"grid-cell-red\"': COL_FIELD < 5, '\"grid-cell-green\"': COL_FIELD >= 5, 'grid-cell-purple': COL_FIELD >= 7}\">{{COL_FIELD | number}}</div>";case"roe":return'<div title="{{COL_FIELD}}" ng-class="{\'ui-grid-cell-contents\': true, \'"grid-cell-red"\': COL_FIELD < 10, \'"grid-cell-green"\': COL_FIELD > 10 }">{{COL_FIELD | number}}</div>';case"fxEffect":case"cashFlow":return'<div title="{{COL_FIELD}}" ng-class="{\'ui-grid-cell-contents\': true, \'"grid-cell-red"\': COL_FIELD < 0, \'"grid-cell-green"\': COL_FIELD > 0 }">{{COL_FIELD | number}}</div>';default:return b?'<div title="{{COL_FIELD}}" class="ui-grid-cell-contents">{{COL_FIELD | number}}</div>':'<div title="{{COL_FIELD}}" class="ui-grid-cell-contents">{{COL_FIELD}}</div>'}},getCellTemplateSummary:function(a,b){switch(a){case"symbol":return"<div class=\"chart-pointer\" title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true,                        'grid-cell-purple': grid.appScope.colorCanslim(row,'purple'),                         '\"grid-cell-green\"': grid.appScope.colorCanslim(row,'green'),                         'grid-cell-fill': grid.appScope.fillCanslim(row)}\">{{COL_FIELD}}                        <img class='chart-icon' src='./images/icon-graph.png' ng-click=\"grid.appScope.symbolClick(row,col)\"/></div>";case"totalValue":return"<div title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true,                         'grid-cell-purple': COL_FIELD >= 5e9, 'grid-cell-fill': COL_FIELD >= 5e9}\">{{COL_FIELD | number}}</div>";case"EPS":return"<div title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true, '\"grid-cell-red\"': COL_FIELD < 1000, '\"grid-cell-green\"': COL_FIELD > 1000, 'grid-cell-fill grid-cell-purple': COL_FIELD >= 3000}\">{{COL_FIELD | number}}</div>";case"Canslim":return"<div title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-purple': COL_FIELD, 'grid-cell-fill': COL_FIELD }\">{{COL_FIELD}}</div>";case"pricePeak":return"<div title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true,                         'grid-cell-purple': COL_FIELD && 'cao nhất 30 phiên' == COL_FIELD.trim().toLowerCase(),                         'grid-cell-fill': COL_FIELD && 'cao nhất 30 phiên' == COL_FIELD.trim().toLowerCase()}\">{{COL_FIELD}}</div>";case"signal1":case"signal2":return"<div title=\"{{COL_FIELD}}\" ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-purple': COL_FIELD, 'grid-cell-fill': COL_FIELD}\">{{COL_FIELD}}</div>";case"chart":case"symbol2":return"<div class=\"chart-pointer\" title=\"{{COL_FIELD}}\" ng-click=\"grid.appScope.symbolClick(row,col)\" ng-class=\"{'ui-grid-cell-contents': true,                        'grid-cell-purple': grid.appScope.colorCanslim(row,'purple'),                         '\"grid-cell-green\"': grid.appScope.colorCanslim(row,'green'),                         'grid-cell-fill': grid.appScope.fillCanslim(row)}\">{{COL_FIELD}}</div>";default:return"number"==b||"bigNum"==b?'<div title="{{COL_FIELD}}" class="ui-grid-cell-contents">{{COL_FIELD | number}}</div>':'<div title="{{COL_FIELD}}" class="ui-grid-cell-contents">{{COL_FIELD}}</div>'}},getCellClass:function(a,b){var c=a.colDef.field,d=a.value,e=[];switch((b[c].indexOf("number")>-1||b[c].indexOf("percent")>-1||b[c].indexOf("bigNum")>-1)&&e.push("ui-cell-align-right"),a.value&&b[c].indexOf("percent")>-1&&e.push("percent"),c){case"priceChange":0>d?e.push("grid-cell-red"):e.push("grid-cell-green");break;case"EPS":1e3>d?e.push("grid-cell-red"):e.push("grid-cell-green");break;case"revenueChange":case"EPSChange":case"profitChange":0>d?e.push("grid-cell-red"):e.push("grid-cell-green");break;case"point":5>d?e.push("grid-cell-red"):d>=5&&7>d?e.push("grid-cell-green"):e.push("grid-cell-purple");break;case"roe":10>d?e.push("grid-cell-red"):e.push("grid-cell-green");break;case"fxEffect":case"cashFlow":0>d?e.push("grid-cell-red"):d>0&&e.push("grid-cell-green")}return e},getCellClassSummary:function(a,b){var c=a.colDef.field,d=a.value,e=["ag-cell-orange-bg"];switch((b[c].indexOf("number")>-1||b[c].indexOf("percent")>-1||b[c].indexOf("bigNum")>-1)&&e.push("ui-cell-align-right"),a.value&&b[c].indexOf("percent")>-1&&e.push("percent"),c){case"symbol":""!=d&&(""!=a.data.signal1||""!=a.data.signal2)&&(""!=a.data.Canslim?e.push("ag-cell-purple-color"):e.push("grid-cell-green"),e.push("ag-cell-fill-bg"));break;case"totalValue":d>=5e9&&(e.push("ag-cell-purple-color"),e.push("ag-cell-fill-bg"));break;case"EPS":d>=3e3?(e.push("ag-cell-purple-color"),e.push("ag-cell-fill-bg")):d>1e3?e.push("grid-cell-green"):1e3>d&&e.push("grid-cell-red");break;case"newPoint":d>=7?(e.push("ag-cell-purple-color"),e.push("ag-cell-fill-bg")):d>=5?e.push("grid-cell-green"):4>=d&&e.push("grid-cell-red"),e.push("text-center");break;case"Canslim":case"pricePeak":""!=d&&(e.push("ag-cell-fill-bg"),e.push("ag-cell-purple-color")),e.push("text-center");break;case"symbol2":""!=d&&(""!=a.data.signal1||""!=a.data.signal2)&&(""!=a.data.Canslim?e.push("ag-cell-purple-color"):e.push("grid-cell-green"),e.push("ag-cell-fill-bg")),e.push("ag-cell-green-bg"),e.push("text-center");break;case"signal1":case"signal2":""!=d&&(e.push("ag-cell-fill-bg"),e.push("ag-cell-purple-color")),e.push("ag-cell-green-bg"),e.push("text-center");break;case"sellSignal":e.push("ag-cell-red-bg"),e.push("text-center")}return e},getMarketSummary:function(){$.ajaxSetup({async:!1});var a="";return $.getJSON("https://superstock.firebaseio.com/market_summary.json",{},function(b){b&&b.data&&(a=b.data)}),a},getSellSignals:function(){$.ajaxSetup({async:!1});var a=[];return $.getJSON("https://superstock.firebaseio.com/sell_symbols.json",{},function(b){b&&b.data&&(a=b.data.split("|"))}),a},getCompanyInformation:function(a){$.ajaxSetup({async:!1});var b=[];return $.getJSON("https://superstock.firebaseio.com/profile/"+a+".json",{},function(a){a&&a.data&&(b=a.data)}),b}}}),angular.module("superstockApp").filter("reverse",function(){return function(a){return angular.isArray(a)?a.slice().reverse():[]}}),angular.module("firebase.auth",[]).constant("SIMPLE_LOGIN_PROVIDERS",["password","facebook"]).constant("loginRedirectPath","/login").factory("auth",["$firebaseAuth",function(a){return a()}]),angular.module("firebase.ref",["firebase"]).factory("Ref",function(){return firebase.database().ref()}),angular.module("superstockApp").controller("LoginCtrl",["$scope","auth","$location",function(a,b,c){function d(a){var b=(rootRef.child("users").child(a.uid),$q.defer());return ref.set({email:email,name:e(email)},function(a){$timeout(function(){a?b.reject(a):b.resolve(ref)})}),b.promise}function e(a){return f(a.substr(0,a.indexOf("@"))||"")}function f(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}function g(){c.path("/account")}function h(b){a.err=b}a.loginBtn=!0,a.logoutBtn=!0,b.$onAuthStateChanged(function(b){b&&(console.log(" logged: "+b.uid),a.logoutBtn=!0,a.loginBtn=!1,c.path("/account"))}),a.oauthLogin=function(a){b.$signInWithPopup(a).then(function(a){console.log("logged"),g()})["catch"](function(a){console.log("login error"),h(a)})},a.anonymousLogin=function(){b.$signInAnonymously().then(function(a){console.log("logged ",a.uid)})["catch"](function(a){console.log("login error ",a)})},a.passwordLogin=function(a,c){b.$signInWithEmailAndPassword(a,c).then(function(a){g(),console.log("logged")})["catch"](function(a){h(a),console.log("error: "+a)})},a.createAccount=function(c,e,f){a.err=null,e?e!==f?a.err="Passwords do not match":b.$createUserWithEmailAndPassword(c,e).then(function(a){return console.log("User "+a.uid+" created successfully"),a}).then(function(a){console.log("Logged user: ",a.uid),d(),g()})["catch"](function(a){console.error("Error: ",a)}):a.err="Please enter a password"}}]),angular.module("superstockApp").controller("AccountCtrl",["$scope","auth","currentAuth",function(a,b,c,d){function e(a){console.log("Error: ",a)}a.user={uid:c.uid,name:c.displayName,photo:c.photoURL,email:c.email},a.authInfo=c,a.changePassword=function(c,d,f){a.err=null,c&&d?d!==f?e("Passwords do not match"):b.$updatePassword(d).then(function(){console.log("Password changed")},e):e("Please enter all fields")},a.changeEmail=function(a){b.$updateEmail(a).then(function(){console.log("email changed successfully")})["catch"](function(a){console.log("Error: ",a)})},a.logout=function(){b.$signOut()},a.updateProfile=function(a,b){firebase.auth().currentUser.updateProfile({displayName:a,photoURL:b}).then(function(){console.log("updated")})["catch"](function(a){console.log("error ",a)})}}]),angular.module("superstockApp").controller("MainCtrl",["$rootScope","$scope","auth","$firebaseArray","$firebaseObject","Ref","draw","uiGridConstants","$sce","utils","currentAuth","$window","$compile","$filter","$timeout",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){a.link="main",l.ga("send","event","Page","Tổng hợp"),b.gridOptions={enableSorting:!0,enableFilter:!0,suppressColumnVirtualisation:!0,suppressContextMenu:!0,rowData:[],data:[],enableColResize:!0,headerHeight:50,onAfterFilterChanged:function(){},onCellClicked:function(a){}},b.headerTitle=j.getMarketSummary();var p=e(f.child("summary_titles")),q=e(f.child("summary_headers")),r=e(f.child("summary_format"));p.$loaded(function(){q.$loaded(function(){r.$loaded(function(){function c(){$(".ui-grid-header-cell").each(function(){var a=$(this),b=a.find("span");b.text().indexOf("\n")<0?(b.parent().css("line-height","40px"),a.css("text-align","center")):b.last().css("margin-top","-2px")})}var d=p.data.split("|"),e=q.data.split("|"),h=r.data.split("|"),k={};d.push("Báo bán"),e.push("sellSignal"),h.push("text");var l=[80,150,125,95,75,95,105,135,140,60,140,70],m=[],s={idLabel:"Mã",labelList:[]},t=0;for(var u in d){k[e[u]]=h[u],s.labelList.push({fieldName:e[u],format:h[u]});var v=null,w=null;h[u].indexOf("bigNum")>-1||h[u].indexOf("number")>-1?(v="number",w="ui-cell-align-right"):w=h[u].indexOf("percent")>-1?"ui-cell-align-right":"ui-cell-align-left";var x={field:e[u],width:l[t],headerName:d[u],cellClass:w,enableTooltip:!0,tooltipField:e[u],cellRenderer:function(a){if("symbol2"==a.colDef.field){if(""==a.data.signal1&&""==a.data.signal2)return""}else{if("newPoint"==a.colDef.field||"EPS"==a.colDef.field){var b="";return b=isNaN(parseFloat(a.value))?n("number")(0,2):n("number")(parseFloat(a.value),2),'<div title="'+b+'">'+b+"</div>"}var b="";if(k[a.colDef.field].indexOf("number")>-1||k[a.colDef.field].indexOf("bigNum")>-1||k[a.colDef.field].indexOf("percent")>-1)return b=n("number")(a.value),k[a.colDef.field].indexOf("percent")>-1&&(isNaN(parseFloat(a.value))?b="":(b=n("number")(a.value,2),b+="%")),'<div title="'+b+'">'+b+"</div>"}return a.value},headerCellTemplate:function(a){var b=a.column,c=b.colId,d="";("signal1"==c||"symbol2"==c||"signal2"==c)&&(d="ag-header-cell-green");var e='<td width="20px" style="vertical-align:top"><span id="agMenu" class="ag-header-icon ag-header-cell-menu-button" style="opacity: 0; transition: opacity 0.2s, border 0.2s;"><svg width="12" height="12"><rect y="0" width="12" height="2" class="ag-header-icon"></rect><rect y="5" width="12" height="2" class="ag-header-icon"></rect><rect y="10" width="12" height="2" class="ag-header-icon"></rect></svg></span></td>',f='<td width="20px"><div id="" class="ag-header-cell-label"><span id="agSortAsc" class="ag-header-icon ag-sort-ascending-icon ag-hidden"><svg width="10" height="10"><polygon points="0,10 5,0 10,10"></polygon></svg></span>    <span id="agSortDesc" class="ag-header-icon ag-sort-descending-icon ag-hidden"><svg width="10" height="10"><polygon points="0,0 5,10 10,0"></polygon></svg></span><span id="agNoSort" class="ag-header-icon ag-sort-none-icon ag-hidden"><svg width="10" height="10"><polygon points="0,4 5,0 10,4"></polygon><polygon points="0,6 5,10 10,6"></polygon></svg></span><span id="agFilter" class="ag-header-icon ag-filter-icon ag-hidden"><svg width="10" height="10"><polygon points="0,0 4,4 4,10 6,10 6,4 10,0" class="ag-header-icon"></polygon></svg></span></div></td>';return"sellSignal"==c&&(f="",e="",d="ag-header-cell-red"),'<div class="ag-header-cell '+d+' ag-header-cell-sortable ag-header-cell-sorted-none"><table style="width:100%;height:100%"><tr>'+e+'<td><div id="agHeaderCellLabel" class="ag-header-cell-label"><span id="agText" class="ag-header-cell-text"></span></div></td>'+f+"</tr></table></div>"}};t++,v&&(x.cellFilter=v),"symbol"==e[u]?(x.filter="text",x.pinned="left",x.cellRenderer=function(a){var b=a.value;return"<div><span>"+a.value+'</span><img class="chart-icon" data-symbol="'+b+'" data-industry = "'+a.node.data.industry+'" src="./images/icon-graph.png"><img class="information-icon" data-symbol="'+b+'" data-industry = "'+a.node.data.industry+'" src="./images/icon-information.png" /></div>'}):"sellSignal"==e[u]&&(x.suppressSorting=!0),"totalValue"==x.field&&(x.sort="desc"),"industry"==x.field&&(x.minWidth=200),x.cellClass=function(a){return j.getCellClassSummary(a,k)},m.push(x)}a.filters=m;var y,z=[];try{console.clear()}catch(A){}var B=[];g.drawGrid(f.child("summary_data"),s,function(a){},function(a){b.gridOptions.api.addEventListener("afterSortChanged",function(a){var c=[];b.gridOptions.api&&null!=b.gridOptions.api&&(b.gridOptions.api.forEachNode(function(a){var b="";B[a.childIndex]&&(b=B[a.childIndex]),a.data.sellSignal=b,c.push(a)}),b.gridOptions.api.refreshCells(c,["sellSignal"]))}),b.gridOptions.api.setColumnDefs(m),setTimeout(function(){c()},1e3)},{added:function(a,c,d){z.push(a),y||(y=o(function(){if(b.gridOptions.api&&null!=b.gridOptions.api){b.gridOptions.api.setRowData(z),B=j.getSellSignals();var a=[];b.gridOptions.api.forEachNode(function(b){var c="";B[b.childIndex]&&(c=B[b.childIndex]),b.data.sellSignal=c,a.push(b)}),b.gridOptions.api.refreshCells(a,["sellSignal"])}z=[],y=void 0},1e3))},changed:function(a,b,c){},removed:function(a){}}),$(document).on("click",".chart-icon",function(){$("#myModal").modal("show"),b.stockInfo=$(this).data("symbol")+" - "+$(this).data("industry"),b.iSrc="https://banggia.vndirect.com.vn/chart/?symbol="+$(this).data("symbol"),b.iSrcTrust=i.trustAsResourceUrl(b.iSrc)}),$(document).on("click",".information-icon",function(){$("#companyModal").modal("show");var a=$(this).data("symbol"),c=$(this).data("industry");b.companyInfo=a+" - "+c,b.companyDatas=j.getCompanyInformation(a)})})})})}]),angular.module("superstockApp").controller("FullStockCtrl",["$rootScope","$scope","auth","$firebaseArray","$firebaseObject","Ref","draw","uiGridConstants","$sce","utils","currentAuth","$window","$compile","$filter","$timeout",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){function p(c,d){if(u++,v&&!(u<=Object.keys(a.filterList).length)){for(var e in a.filterList){var f=a.filterList[e],g=b.gridOptions.api.getFilterApi(e);if(f.filter){var h=f.filter.term;if(h&&h.length>0){var i=[];for(var j in h)i.push(h[j].value);i.length>0?g.setModel(i):g.selectEverything()}else g.selectEverything()}else if(f.filters){var k=b.gridOptions.api.getFilterApi(e);k.setType(k.GREATER_THAN),k.setFilter(f.filters[0].term)}}b.gridOptions.api.onFilterChanged()}}function q(a,b){if(b){for(var c in a)a[c].filter&&w[c]&&(a[c].filter.term=w[c]),a[c].filters&&w[c]&&(a[c].filters[0].term=w[c]);return a}var b={};for(var c in a)a[c].filter&&a[c].filter.term&&(b[c]=a[c].filter.term),a[c].filters&&a[c].filters[0].term&&(b[c]=a[c].filters[0].term);return b}function r(){$(".ui-grid-header-cell").each(function(){var a=$(this),b=a.find("span");b.text().indexOf("\n")<0?(b.parent().css("line-height","40px"),a.css("text-align","center")):b.last().css("margin-top","-2px")})}a.link="full",l.ga("send","event","Page","Đầy đủ");var s=null,t=null,u=0,v=!1;if(a.filterList={},k){var w=e(f.child("users/"+k.uid+"/filter"));w.$loaded(function(a){t={};for(var b in a)"$"!=b.charAt(0)&&"forEach"!=b&&(t[b]=a[b])})}b.gridOptions={enableSorting:!0,enableFilter:!0,suppressColumnVirtualisation:!0,suppressContextMenu:!0,rowData:[],data:[],enableColResize:!0,headerHeight:50,onAfterFilterChanged:function(){s=f.child("users/"+k.uid);var b=q(a.filterList,null);s.child("filter").set(b,function(a){a?console.log(a):console.log("Saved filter")})},onCellClicked:function(a){}};var x=1e9,y=e(f.child("superstock_titles")),z=e(f.child("superstock_fields")),A=e(f.child("superstock_format"));z.$loaded(function(){y.$loaded(function(){A.$loaded(function(){var c=y.data.split("|"),d=z.data.split("|"),e=A.data.split("|"),h={},i=[65,250,130,100,110,120,120,130,80,150,160,150,90,140,100,120,140,120,120,120,100,90,90,140,140,140,170,80,140,110,140,100,120,120,140,120,120,120,120,100,100,140,80,140],k=[],l={idLabel:"Mã",labelList:[]};for(var m in c){h[d[m]]=e[m],l.labelList.push({fieldName:d[m],format:e[m]});var s=null,u=null,v=null;e[m].indexOf("bigNum")>-1||e[m].indexOf("number")>-1?(s="number",v="number"):e[m].indexOf("percent")>-1&&(v="number");var w={field:d[m],width:i[m],headerName:c[m],cellClass:u,enableTooltip:!0,tooltipField:d[m],cellRenderer:function(a){if("symbol2"==a.colDef.field){if(""==a.data.signal1&&""==a.data.signal2)return""}else{if("newPoint"==a.colDef.field||"EPS"==a.colDef.field||"fxEffect"==a.colDef.field||"cashFlow"==a.colDef.field){var b="";return b=isNaN(parseFloat(a.value))?n("number")(0,2):n("number")(parseFloat(a.value),2),'<div title="'+b+'">'+b+"</div>"}var b="";if(h[a.colDef.field].indexOf("number")>-1||h[a.colDef.field].indexOf("bigNum")>-1||h[a.colDef.field].indexOf("percent")>-1)return b=n("number")(a.value),h[a.colDef.field].indexOf("percent")>-1&&(isNaN(parseFloat(a.value))?b="":(b=n("number")(a.value,2),b+="%")),'<div title="'+b+'">'+b+"</div>"}return a.value},headerCellTemplate:function(){return'<div class="ag-header-cell ag-header-cell-sortable ag-header-cell-sorted-none"><table style="width:100%;height:100%"><tr><td width="20px" style="vertical-align:top"><span id="agMenu" class="ag-header-icon ag-header-cell-menu-button" style="opacity: 0; transition: opacity 0.2s, border 0.2s;"><svg width="12" height="12"><rect y="0" width="12" height="2" class="ag-header-icon"></rect><rect y="5" width="12" height="2" class="ag-header-icon"></rect><rect y="10" width="12" height="2" class="ag-header-icon"></rect></svg></span></td><td><div id="agHeaderCellLabel" class="ag-header-cell-label"><span id="agText" class="ag-header-cell-text"></span></div></td><td width="20px"><div id="" class="ag-header-cell-label"><span id="agSortAsc" class="ag-header-icon ag-sort-ascending-icon ag-hidden"><svg width="10" height="10"><polygon points="0,10 5,0 10,10"></polygon></svg></span>    <span id="agSortDesc" class="ag-header-icon ag-sort-descending-icon ag-hidden"><svg width="10" height="10"><polygon points="0,0 5,10 10,0"></polygon></svg></span><span id="agNoSort" class="ag-header-icon ag-sort-none-icon ag-hidden"><svg width="10" height="10"><polygon points="0,4 5,0 10,4"></polygon><polygon points="0,6 5,10 10,6"></polygon></svg></span><span id="agFilter" class="ag-header-icon ag-filter-icon ag-hidden"><svg width="10" height="10"><polygon points="0,0 4,4 4,10 6,10 6,4 10,0" class="ag-header-icon"></polygon></svg></span></div></td></tr></table></div>'}};if(s&&(w.cellFilter=s),v&&(w.filter=v),""!=e[m]){var B=e[m].split(":");if(4===B.length){var C=[{condition:"GREATER_THAN",term:"bigNum"==B[0]?parseFloat(B[2])*x:parseFloat(B[2]),min:"bigNum"==B[0]?parseFloat(B[1])*x:parseFloat(B[1]),bigNum:"bigNum"==B[0]?!0:!1},{condition:"LESS_THAN",term:1/0,max:"bigNum"==B[0]?parseFloat(B[3])*x:parseFloat(B[3])}];a.filterList[w.field]={headerName:w.headerName,filters:C}}}if("symbol"==d[m]&&(w.width=80,w.filter="text",w.pinned="left",w.cellRenderer=function(a){var b=a.value;return"<div><span>"+a.value+'</span><img class="chart-icon" data-symbol="'+b+'" data-industry = "'+a.node.data.industry+'" src="./images/icon-graph.png"><img class="information-icon" data-symbol="'+b+'" data-industry = "'+a.node.data.industry+'" src="./images/icon-information.png" /></div>'}),"shorttermSignal"==d[m]){var v={term:null,selectOptions:[{value:"xBán",label:"Bán"},{value:"xMua nếu cơ bản tốt",label:"Mua"}]};a.filterList[w.field]={headerName:w.headerName,filter:v}}else if("industry"==d[m]){var v={term:null,selectOptions:[{value:"Bao bì & đóng gói",label:"Bao bì & đóng gói"},{value:"Nông sản và thủy hải sản",label:"Nông sản và thủy hải sản"},{value:"Ngân hàng",label:"Ngân hàng"},{value:"Thực phẩm",label:"Thực phẩm"}],typeSearch:"multiple"};a.filterList[w.field]={headerName:w.headerName,filter:v},w.minWidth=200}w.cellClass=function(a){return j.getCellClass(a,h)},k.push(w)}a.filters=k;var D,E=[];try{console.clear()}catch(F){}g.drawGrid(f.child("superstock"),l,function(a){},function(c){b.gridOptions.api.setColumnDefs(k);for(var d in a.filterList)a.filterList[d].filters&&a.$watch('filterList["'+d+'"].filters[0].term',function(a,b){p(a,b)}),a.filterList[d].filter&&a.$watch('filterList["'+d+'"].filter.term',function(a,b){p(a,b)});a.filterList=q(a.filterList,t),setTimeout(function(){r()},1e3)},{added:function(a,c,d){E.push(a),D||(D=o(function(){b.gridOptions.api&&null!=b.gridOptions.api&&b.gridOptions.api.setRowData(E),E=[],D=void 0},1e3))},changed:function(a,b,c){},removed:function(a){}})})})}),a.parseBigNum=function(a){var b=parseFloat(a)/x;return b},$(document).on("click",".chart-icon",function(){$("#myModal").modal("show"),b.stockInfo=$(this).data("symbol")+" - "+$(this).data("industry"),b.iSrc="https://banggia.vndirect.com.vn/chart/?symbol="+$(this).data("symbol"),b.iSrcTrust=i.trustAsResourceUrl(b.iSrc)}),$(document).on("click",".information-icon",function(){$("#companyModal").modal("show");var a=$(this).data("symbol"),c=$(this).data("industry");b.companyInfo=a+" - "+c,b.companyDatas=j.getCompanyInformation(a)}),a.onOffFilter=function(a){v=a,a?p():(b.gridOptions.api.setFilterModel(null),b.gridOptions.api.onFilterChanged())},a.search=function(a){var c=b.gridOptions.api.getFilterApi("symbol");c.setType(c.CONTAINS),c.setFilter(a),b.gridOptions.api.onFilterChanged()},a.defaultFilter=function(c){if(!c){for(var d in a.filterList)a.filterList[d].filter&&(a.filterList[d].filter.term=null),a.filterList[d].filters&&(a.filterList[d].filters[0].term=a.filterList[d].filters[0].min);return void b.gridOptions.api.onFilterChanged()}c=c[0],l.ga("send","event","Filter",c.filterName);for(var d in a.filterList)a.filterList[d].filter&&(a.filterList[d].filter.term=null),a.filterList[d].filters&&(a.filterList[d].filters[0].term=a.filterList[d].filters[0].min);for(var d in c)a.filterList[d].filters&&(a.filterList[d].filters[0].term=c[d]);b.gridOptions.api.onFilterChanged()},$(document).ready(function(){$(document).on("change",".subTerm",function(){$(this).each(function(){var c=$(this);c.prop("value",c.val());var d=c.data("model");b.$apply(function(){a.filterList[d].filters[0].term=parseFloat(c.val())*x,c.prop("value",c.val())}),c.parent().next().children().slider({slide:function(a,b){c.prop("value",b.value/x)}})})}),$(document).click(function(b){var c=$("#sidebar-wrapper");if(!c.is(b.target)&&0===c.has(b.target).length){if(b.preventDefault(),b.stopPropagation(),"main"==a.link)return;if($("#wrapper").prop("class").indexOf("toggled")>-1)return;$("#wrapper").toggleClass("toggled")}})})}]).directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}}),angular.module("superstockApp").controller("MenuCtrl",["$rootScope","$scope","auth","$location","Ref","$firebaseObject",function(a,b,c,d,e,f){function g(){d.path("/")}a.user=null,a.link="",b.filterShow=function(b){b.preventDefault(),b.stopPropagation(),"main"!=a.link&&$("#wrapper").toggleClass("toggled")};b.oauthLogin=function(a){c.$signInWithPopup(a).then(function(a){g()})["catch"](function(a){console.log("login error"),console.log(a)})},b.logout=function(){c.$signOut(),d.path("/")},c.$onAuthStateChanged(function(a){})}]),angular.module("superstockApp").controller("FilterCtrl",["$rootScope","$scope","Ref","$firebaseArray","$compile",function(a,b,c,d,e){b.defaultFilter=[{EPS:1e3,maVol30:3e4,point:7,profitChange:20,roe:7,filterName:"Cơ bản tốt"}],a.$watch("searchTerm",function(){a.search&&a.search(a.searchTerm)}),b.$watch("filter",function(){if(b.filter&&0==b.filter.length)return void(b.filter=null);if(a.defaultFilter)try{a.defaultFilter(b.filter)}catch(c){}}),b.$watch("filterEnabled",function(){a.onOffFilter&&a.onOffFilter(b.filterEnabled)})}]),angular.module("superstockApp").directive("ngShowAuth",["auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuthStateChanged(e),e()}}}]),angular.module("superstockApp").directive("ngHideAuth",["auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuthStateChanged(e),e()}}}]),angular.module("superstockApp").directive("categoryHeader",function(){function a(a){console.log(a.gridOptions.columnDefs),a.headerRowHeight=30,a.catHeaderRowHeight=a.headerRowHeight+"px",a.categories=[];var b="",c=0,d=0;cols=a.gridOptions.columnDefs;for(var e=0;e<cols.length;e++){c+=Number(cols[e].width);var f="undefined"==typeof cols[e].categoryDisplayName?" ":cols[e].categoryDisplayName;f!==b&&(a.categories.push({displayName:b,width:c-Number(cols[e].width),widthPx:c-Number(cols[e].width)+"px",left:d,leftPx:d+"px"}),d+=c-Number(cols[e].width),c=Number(cols[e].width),b=f)}c>0&&a.categories.push({displayName:b,width:c,widthPx:c+"px",left:d,leftPx:d+"px"})}return{templateUrl:"scripts/directives/templates/category_header.html",link:a}}),angular.module("superstockApp").config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{currentAuth:["auth",function(a){return a.$waitForSignIn()}]}}).when("/full",{templateUrl:"views/full-stock.html",controller:"FullStockCtrl",resolve:{currentAuth:["auth",function(a){return a.$waitForSignIn()}]}}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/account",{templateUrl:"views/account.html",controller:"AccountCtrl",resolve:{currentAuth:["auth",function(a){return a.$requireSignIn()}]}}).when("/chat",{templateUrl:"views/chat.html",controller:"Chat",resolve:{currentAuth:["auth",function(a){return a.$waitForSignIn()}]}}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","loginRedirectPath","auth",function(a,b,c,d,e,f,g,h){d.$onAuthStateChanged(function(b){a.user=b}),a.$on("$routeChangeError",function(a,d,e,f){"AUTH_REQUIRED"===f&&b.path(c)})}]);