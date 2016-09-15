'use strict';

/**
 * @ngdoc function
 * @name superstockApp.controller:FullStockCtrl
 * @description
 * # FullStockCtrl
 * Controller of the superstockApp
 */
angular.module('superstockApp')
    .controller('FullStockCtrl', function($rootScope, $scope, auth, $firebaseArray,
        $firebaseObject, Ref, draw, uiGridConstants, $sce, utils, currentAuth, $window) {
        $rootScope.link = 'full'; //set this page is full-page
        $window.ga('send', 'event', "Page", "Đầy đủ");
        var userFilters = null;
        var user = null;
        var userAuthData = null;
        var filterData = null;

        //check current auth and load user filter
        if (currentAuth) {
            var filter = $firebaseObject(Ref.child('users/' + currentAuth.uid + '/filter'));
            filter.$loaded(function(data) {
                filterData = {};
                for (var i in data) {
                    if (i.charAt(0) != '$' && i != 'forEach') {
                        filterData[i] = data[i];
                    }
                }
                if ($scope.gridOptions.columnDefs) {
                    $scope.gridOptions.columnDefs = filterConvert($scope.gridOptions.columnDefs, filterData);
                }
            });


            // defaultFilter.child('defaultFilter').set({
            //     "Cơ bản tốt": {
            //         point: 7,
            //         EPS: 1000,
            //         profitChange: 20,
            //         roe: 7,
            //         maVol30: 300000000
            //     }
            // }, function(err) {
            //     console.log(err);
            // })
        }

        $("#wrapper").addClass("toggled");
        //iframe source convert https
        $scope.iSrc = '';
        $scope.iSrcTrust = $sce.trustAsResourceUrl($scope.iSrc);

        $scope.uiGridConstants = uiGridConstants;
        //setting grid height
        var heightOut = parseFloat($('.header').css('height')) + parseFloat($('.footer').css('height'));
        var heightWin = $(window).height();
        $('#wrapper .view-containner').height(heightWin - heightOut);
        // var heightHead = $('.ui-grid-header').height() || 60;
        // console.log("heightOut", heightOut, "heightWin", heightWin, "heightHead", heightHead);
        // console.log(Math.floor((heightWin - heightOut - heightHead) / 30));
        $scope.gridOptions = {
            flatEntityAccess: true,
            fastWatch: true,
            enableFiltering: true,
            // useExternalFiltering: true,
            // excessRows: 50,
            // excessColumns: 32,
            // minRowsToShow: Math.floor((heightWin - heightOut - heightHead) / 30),
            data: [],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                //filter change event - save filter to user
                $scope.gridApi.core.on.filterChanged($scope, function() {
                    // rowIndex = 0;
                    user = Ref.child('users/' + currentAuth.uid);
                    var filter = filterConvert($scope.gridOptions.columnDefs, null);
                    user.child('filter').set(filter, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Saved filter');
                        }
                    });
                });
            }
        };

        /*
         * convert columnDefs to filters and opposite
         */
        function filterConvert(rowDefs, filters) {
            if (filters) {
                for (var i in filters) {
                    for (var j in rowDefs) {
                        if (rowDefs[j].field == i) {
                            if (rowDefs[j].filters)
                                rowDefs[j].filters[0].term = filters[i];
                            else if (rowDefs[j].filter)
                                rowDefs[j].filter.term = filters[i];
                            break;
                        }
                    }
                }
                return rowDefs;
            } else {
                filters = {};
                for (var i in rowDefs) {
                    if (rowDefs[i].filters) {
                        filters[rowDefs[i].field] = (rowDefs[i].filters[0] && rowDefs[i].filters[0].term) ? rowDefs[i].filters[0].term : null;
                    } else if (rowDefs[i].filter) {
                        filters[rowDefs[i].field] = (rowDefs[i].filter.term) ? rowDefs[i].filter.term : null;
                    }
                }
                return filters;
            }
        }
        var bigNum = 1000000000;
        var titles = $firebaseObject(Ref.child('superstock_titles'));
        var fields = $firebaseObject(Ref.child('superstock_fields'));
        var format = $firebaseObject(Ref.child('superstock_format'));
        fields.$loaded(function() {
            titles.$loaded(function() {
                format.$loaded(function() {
                    var titlesArr = titles.data.split('|');
                    var fieldsArr = fields.data.split('|');
                    var formatArr = format.data.split('|');
                    // console.log(formatArr);
                    // console.log(titlesArr);
                    // console.log(fieldsArr);
                    var sizeArr = [
                        70, 250, 130, 75, 80, 85, 85, 95,
                        70, 110, 120, 110, 55, 160, 65, 80,
                        100, 90, 80, 75, 50, 50, 70, 105,
          /*Nợ vốn chủ*/95, 115, 135, 50, 125, 80, 80, 40,
                        105, 105, 110, 95, 95, 85, 80, 75,
                        125, 95, 50, 120
                    ];
                    var columnDefs = [];
                    var config = {
                        idLabel: 'Mã',
                        labelList: []
                    }

                    // columnDefs.push({
                    //     field: 'rowIndex',
                    //     width: 40,
                    //     pinnedLeft: true,
                    //     enableColumnMenu: false,
                    //     displayName: '#',
                    //     cellTemplate: '<div title="{{COL_FIELD}}" ng-class="{\'ui-grid-cell-contents\': true, \'grid-cell-red\': COL_FIELD < 0, \'grid-cell-green\': COL_FIELD >= 0}">{{$parent.rowRenderIndex + 1}}</div>'
                    // });
                    for (var i in titlesArr) {
                        // titlesArr[i] = titlesArr[i].replace('\n', '');
                        config.labelList.push({
                            fieldName: fieldsArr[i],
                            format: formatArr[i]
                        });
                        var formatType = null;
                        var cellClass = null;
                        if (formatArr[i].indexOf('bigNum') > -1 || formatArr[i].indexOf('number') > -1) {
                            formatType = 'number';
                            cellClass = 'ui-cell-align-right'
                        } else if (formatArr[i].indexOf('percent') > -1) {
                            cellClass = 'ui-cell-align-right'
                        } else {
                            cellClass = 'ui-cell-align-left'
                        }
                        var def = {
                            field: fieldsArr[i],
                            width: sizeArr[i],
                            displayName: titlesArr[i],
                            cellClass: cellClass,
                            headerCellTemplate: "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text ' + col.uid + '-sortdir-text'\" aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\"><div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus\" col-index=\"renderIndex\" ng-class=\"{'single-line': col.displayName.indexOf('\n') < 0}\" title=\"TOOLTIP\"><span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\">{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\"><i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{isSortPriorityVisible() ? i18n.headerCell.priority + ' ' + ( col.sort.priority + 1 )  : null}}\" aria-hidden=\"true\"></i> <sub ui-grid-visible=\"isSortPriorityVisible()\" class=\"ui-grid-sort-priority-number\">{{col.sort.priority + 1}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>"
                        }
                        if (formatType) def.cellFilter = formatType;
                        if (formatArr[i].indexOf('percent') > -1) def.cellClass += ' percent';
                        if (formatArr[i] != '') {
                            var arr = formatArr[i].split(':');
                            if (arr.length === 4) {
                                var filters = [{
                                    condition: function(searchTerm, cellValue) {
                                        return !$scope.filterEnabled || cellValue >= searchTerm;
                                    },
                                    placeholder: 'greater than',
                                    term: (arr[0] == 'bigNum') ? parseFloat(arr[2]) * bigNum : parseFloat(arr[2]),
                                    min: (arr[0] == 'bigNum') ? parseFloat(arr[1]) * bigNum : parseFloat(arr[1]),
                                    bigNum: (arr[0] == 'bigNum') ? true : false
                                }, {
                                    condition: function(searchTerm, cellValue) {
                                        return !$scope.filterEnabled || cellValue <= searchTerm;
                                    },
                                    placeholder: 'less than',
                                    term: Infinity,
                                    max: (arr[0] == 'bigNum') ? parseFloat(arr[3]) * bigNum : parseFloat(arr[3])
                                }];
                                def.filters = filters;
                                def.cellTemplate = utils.getCellTemplate(fieldsArr[i], formatType);
                            }
                        } else {
                            def.cellTemplate = utils.getCellTemplate(fieldsArr[i]);
                        }
                        if (fieldsArr[i] == 'shorttermSignal') {
                            def.filter = {
                                term: null,
                                // type: uiGridConstants.filter.SELECT,
                                selectOptions: [{
                                    value: 'xBán',
                                    label: 'Bán'
                                }, {
                                    value: 'xMua nếu cơ bản tốt',
                                    label: 'Mua'
                                }],
                                condition: function(searchTerm, cellValue) {
                                    var tempSearchTerm = [];
                                    for (var i in searchTerm) {
                                        tempSearchTerm.push(searchTerm[i].value);
                                    }
                                    if (!tempSearchTerm || searchTerm.length == 0) return true;
                                    return !$scope.filterEnabled || (tempSearchTerm.indexOf(cellValue) > -1);
                                }
                            }
                        } else if (fieldsArr[i] == 'industry') {
                            def.filter = {
                                // term: null,
                                // type: uiGridConstants.filter.SELECT,
                                selectOptions: [{
                                    value: 'Bao bì & đóng gói',
                                    label: 'Bao bì & đóng gói'
                                }, {
                                    value: 'Nông sản và thủy hải sản',
                                    label: 'Nông sản và thủy hải sản'
                                }, {
                                    value: 'Ngân hàng',
                                    label: 'Ngân hàng'
                                }, {
                                    value: 'Thực phẩm',
                                    label: 'Thực phẩm'
                                }],
                                // selectOptions: ['Bao bì & đóng gói', 'Nông sản và thủy hải sản', 'Ngân hàng', 'Thực phẩm'],
                                typeSearch: 'multiple',
                                term: null,
                                condition: function(searchTerm, cellValue) {
                                    var tempSearchTerm = [];
                                    for (var i in searchTerm) {
                                        tempSearchTerm.push(searchTerm[i].value);
                                    }
                                    if (!tempSearchTerm || searchTerm.length == 0) return true;
                                    return !$scope.filterEnabled ||(tempSearchTerm.indexOf(cellValue) > -1);
                                }
                            }
                        }
                        columnDefs.push(def);
                    }
                    for (var i in columnDefs) {
                        if (columnDefs[i].field == 'symbol') {
                            columnDefs[i].pinnedLeft = true;
                            columnDefs[i].cellTemplate = '<div><div class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}\
                        <img class=\'chart-icon\' src=\'./images/icon-graph.png\' ng-click="grid.appScope.symbolClick(row,col)"/></div></div>';
                        }
                    }
                    $rootScope.filters = columnDefs;
                    $scope.gridOptions.columnDefs = columnDefs;
                    console.log(columnDefs);
                    if (filterData) {
                        $scope.gridOptions.columnDefs = filterConvert($scope.gridOptions.columnDefs, filterData);
                    }
                    draw.drawGrid(Ref.child('superstock'), config, function(data) {
                        $scope.gridOptions.data.push(data);
                    }, function(data) {
                        // setTimeout(function() {
                        //     align();
                        // }, 1000);
                        // columnDefs[0].pinnedLeft = true
                        // $scope.gridOptions.columnDefs = columnDefs;
                        // $scope.gridOptions.data = data;
                        // console.log($scope.gridOptions.data);
                    }, {
                        added: function(data, childSnapshot, id) {
                            var key = childSnapshot.key;
                            for (var i in $scope.gridOptions.data) {
                                if ($scope.gridOptions.data[i]['symbol'] == key) {
                                    $scope.gridOptions.data[i] = data;
                                    return;
                                }
                            }
                            $scope.gridOptions.data.push(data);
                        },
                        changed: function(data, childSnapshot, id) {
                            var key = childSnapshot.key;
                            for (var i in $scope.gridOptions.data) {
                                if ($scope.gridOptions.data[i]['symbol'] == key) {
                                    $scope.$apply(function() {
                                        for (var key in data) {
                                            $scope.gridOptions.data[i][key] = data[key];
                                        }
                                    })
                                    break;
                                }
                            }
                        },
                        removed: function(oldChildSnapshot) {
                            var key = oldChildSnapshot.key;
                            for (var i in $scope.gridOptions.data) {
                                if ($scope.gridOptions.data[i]['symbol'] == key) {
                                    $scope.gridOptions.data.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    })
                })
            })
        });

        $rootScope.parseBigNum = function(term) {
            var newTerm = parseFloat(term) / bigNum;
            return newTerm;
        }
        $scope.symbolClick = function(row, col) {
            $('#myModal').modal('show');
            $scope.stockInfo = row.entity.symbol + ' - ' + row.entity.industry;
            $scope.iSrc = 'https://banggia.vndirect.com.vn/chart/?symbol=' + row.entity.symbol;
            $scope.iSrcTrust = $sce.trustAsResourceUrl($scope.iSrc);
        }

        $rootScope.onOffFilter = function(value) {
            $scope.filterEnabled = value;
            setTimeout(function() {
                // $scope.gridOptions.enableFiltering = value;
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            }, 500)
        }

        $rootScope.search = function(searchTerm) {
            $scope.gridApi.grid.columns[0].filters[0] = {
                term: $rootScope.searchTerm
            };
        }
        $rootScope.defaultFilter = function(filter) {
            if (filter) filter = filter[0];
            else return;
            $window.ga('send', 'event', "Filter", filter.filterName);
            for (var i in $scope.gridOptions.columnDefs) {
                var fieldName = $scope.gridOptions.columnDefs[i].field;
                for (var j in filter) {
                    if (j != 'filterName') {
                        if (j == fieldName) {
                            if ($scope.gridOptions.columnDefs[i].filters) {
                                $scope.gridOptions.columnDefs[i].filters[0].term = filter[j];
                            }
                            break;
                        }
                    }
                }
            }
        }

        // var defaultFormat = Ref.children('')

        // $scope.industryClick = function(index, row, col) {
        //     var industry = row.entity.industry;
        // }
        function align() {
            $('.ui-grid-header-cell').each(function() {
                var thisTag = $(this);
                var span = thisTag.find('span');
                if (span.text().indexOf('\n') < 0) {
                    thisTag.addClass('single-line');
                    // span.parent().css('line-height', '40px');
                    // thisTag.css('text-align', 'center');
                } else {
                    // span.last().css('margin-top', '-2px');
                }
            })
        }
        $(document).ready(function() {
            $(document).on('change', '.subTerm', function() {
                var subTerm = $(this);
                subTerm.prop('value', subTerm.val());
                var field = subTerm.prop('id');
                for (var i in $scope.gridOptions.columnDefs) {
                    if ($scope.gridOptions.columnDefs[i].field == field) {
                        $scope.$apply(function() {
                            $scope.gridOptions.columnDefs[i].filters[0].term = parseFloat(subTerm.val()) * bigNum;
                            subTerm.prop('value', subTerm.val());
                        })
                        break;
                    }
                }
                subTerm.parent().next().children().slider({
                    slide: function(event, ui) {
                        subTerm.prop('value', ui.value / bigNum);
                    }
                });
            });
            $(document).click(function(e) {
                var container = $("#sidebar-wrapper");

                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($rootScope.link == 'main') return;
                    if ($("#wrapper").prop('class').indexOf('toggled') > -1) return;
                    $("#wrapper").toggleClass("toggled");
                }
            });
        });
    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });