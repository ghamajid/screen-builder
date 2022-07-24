<template>
  <div class="form-group">
    <ag-grid-vue
            :style="{height: height_ag_grid +'px'}"
            class="ag-theme-alpine"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :frameworkComponents="frameworkComponents"
            :rowData="rowData"
            rowSelection="single"
            :pagination="false"
            :paginationPageSize="paginationPageSize"
            :paginationNumberFormatter="paginationNumberFormatter"
            @cell-clicked="onCellClicked"
    />
  </div>
</template>

<script>
    import BtnCellRenderer from './btn-cell-renderer.js';
    import {AgGridVue} from 'ag-grid-vue';
    import CustomHeader from './custom-header';

    export default {
        inheritAttrs: false,
        components: {
            AgGridVue,
            agColumnHeader: CustomHeader,
            // eslint-disable-next-line vue/no-unused-components
            rowNodeIdRenderer(params) {
                return params.node.id + 1;
            },
        },
        data() {
            return {
                trans_option: '',
                self: this,
                gridApi: null,
                columnApi: null,
                columnDefs: null,
                rowData: null,
                frameworkComponents: {
                    btnCellRenderer: BtnCellRenderer,
                },
                defaultColDef: {
                    flex: 1,
                    minWidth: 100,
                    editable: true,
                },
                skipHeaderOnAutoSize: true,
                paginationPageSize: null,
                paginationNumberFormatter: null,
                gridOptions: {
                    rowData: null,
                    enableRtl: true,
                    suppressClickEdit: true,
                    editType: 'fullRow',
                    pagination: true,
                    rowSelection: 'single',
                },
            };
        },
        props: [
            'transientData',
            'height_ag_grid',
            'column_defs',
            'row_data',
        ],
        beforeMount() {
            //console.log(,'123456');
            this.columnDefs = [];
            if (this.label === null) {
                this.rowData = [];
            }
            var data = [];
            /*if (this.fields && this.fields.optionsList) {
                this.fields.optionsList.map(param => {
                    if (param.value == 'row') {
                        data.push({
                            headerName: param.content,
                            cellRenderer(params) {
                                return parseInt(params.node.id) + 1;
                            },
                        });
                    } else if (param.value == 'action') {
                        data.push({
                            editable: false,
                            headerName: param.content,
                            colId: 'action',
                            cellRenderer: 'btnCellRenderer',
                            cellRendererParams: {
                                optionDelete: (param.delete == '0') ? false : true,
                                optionEdit: (param.edit == '0') ? false : true,
                            },
                        });
                    } else {
                        data.push({
                            headerName: param.content,
                            field: param.value,
                            sortable: (param.sort == '0') ? false : true,
                            filter: (param.filter == '0') ? false : 'agTextColumnFilter',
                            date: (param.date == '0') ? false : true,
                            currency: (param.currency == '0') ? false : true,
                        });
                    }
                });
            }*/
            //console.log(data,'datadatadatadatadatadata');
            if(this.column_defs){
                this.columnDefs = this.column_defs;
            }

            //console.log(this.rowData,'this.rowData')
            this.paginationPageSize = 10;
            this.paginationNumberFormatter = (params) => {
                return '[' + params.value.toLocaleString() + ']';
            };
        },
        mounted() {
            //console.log(this.transientData[this.name][0]['data']);
            /*if(this.transientData && this.transientData[this.name]){
                this.rowData = this.transientData[this.name][0]['data'];

            }*/


            this.gridApi = this.gridOptions.api;
        },

      /*computed: {
       data_x: {
       get: function () {
       console.log(this.trans_option,'aaaaaaaaaaa');
       return new Data();
       }
       }
       },*/
        created() {
            this.rowData=[];
            //console.log(this.transientData , this.transientData[this.name],'456');
            if(this.row_data){

                this.rowData = this.row_data;

            }
        },
        watch: {

            transientData: {
                deep: true,
                handler() {
                    this.rowData=[];
                    //console.log(this.transientData , this.transientData[this.name],'456');
                    if(this.row_data){

                        this.rowData = this.row_data;

                    }
                },
            },
            trans_option: {
                deep: true,
                handler() {
                   /* var self = this;
                    let recurse = function (obj) {
                        for (var property in obj) {
                            if (obj.hasOwnProperty(property)) {
                                if (obj[property] != null && typeof obj[property] === "object"){
                                    if(property != self.name){
                                        recurse(obj[property]);
                                    }
                                }
                                else{
                                    //console.log(property , self.transientData[self.name],'456');
                                    obj[property] = property in self.transientData[self.name][0] ? null : obj[property];
                                    //obj[property] = property in self.transientData[self.name][0] ? "" : obj[property];
                                }
                            }
                        }
                    }
                    recurse(this.transientData);*/
                    //console.log(this.transientData[this.name],'9999999999');
                },
            },
        },
        methods: {
            onCellClicked(params) {
                /*if (
                    params.column.colId === 'action' &&
                    params.event.target.dataset.action) {
                    let action = params.event.target.dataset.action;

                    if (action === 'delete') {
                        params.api.applyTransaction({
                            remove: [params.node.data],
                        });
                        var rowData = [];
                        if (this.gridApi) {
                            this.gridApi.forEachNode(function (node) {
                                rowData.push(node.data);
                            });
                        }
                        this.$emit('input', rowData);
                    }
                    if (action === 'edit') {
                        if (this.transientData && this.transientData['rowIndex']) {
                            this.transientData['rowIndex'] = params.rowIndex
                        }
                        let recurse = function (obj) {
                            for (var property in obj) {
                                if (obj.hasOwnProperty(property)) {
                                    if (obj[property] != null && typeof obj[property] === "object")
                                        recurse(obj[property]);
                                    else
                                        obj[property] = property in params.node.data ? params.node.data[property] : obj[property];
                                }
                            }
                        }

                        recurse(this.transientData);


                        //old function
                      /!*let recurse = function (data) {
                       let tempObject = {};
                       if (Array.isArray(data)){
                       tempObject = [];
                       }
                       for (const [key, value] of Object.entries(data)) {
                       if (value !== null && typeof value === 'object') {
                       tempObject[key] = recurse(value);
                       } else {
                       tempObject[key] = Object.keys(params.node.data).includes(key) ? params.node.data[key] : tempObject[key] = value;
                       }
                       }
                       return tempObject;
                       };
                       if (this.transientData['loop_1']) {
                       this.transientData['loop_1'] = recurse(this.transientData['loop_1'])
                       console.log(recurse(this.transientData['loop_1']), 'this is old')
                       }*!/
                    }
                }*/
            },
            // eslint-disable-next-line no-unused-vars
            onGridReady(params) {
                //console.log(12345);
                var self = this;
                const updateData = (data) => {
                    //console.log(data)
                    self.rowData = data[0]['data'];

                    this.$emit('input', self.rowData);
                };
                /*if (this.url_grid && this.url_grid.url) {
                    fetch(this.url_grid.url)
                        .then((resp) => resp.json())
                        .then((data) => updateData(data));
                } else {
                    if (self.transientData) {
                        updateData(self.transientData[self.name]);
                    }
                }*/

            },
            updateDataGrid(data) {
                this.rowData = data;
                //console.log(this.rowData,'asdasdasdad');
                this.columnDefs.map(param => {
                    if (param.date == true) {
                        this.rowData.forEach(row => {
                            if (row[param.field]) {
                                row[param.field] = (row[param.field]).replaceAll("&#x2F;", "/");
                            }
                        })
                    }
                });
               // console.log(this.rowData,'11111111111111111');

                // this.transientData['edit'] = null
            },
            onPageSizeChanged(event) {
                this.gridApi.paginationSetPageSize(Number(event.target.value));
            },
        },
    };
</script>

<style src="ag-grid-community/dist/styles/ag-grid.css"></style>
<style src="ag-grid-community/dist/styles/ag-theme-alpine.css"></style>
<style lang="scss" scoped>

  .ag-cell-label-container {
    /*Necessary to allow for text to grow vertically*/
    height: 100%;
  }

  .ag-theme-alpine .ag-rtl .ag-cell {
      border-left: 1px solid gainsboro !important;
  }

  .ag-header-cell-label {
    /*Necessary to allow for text to grow vertically*/
    height: 100%;
    padding: 0 !important;
  }

  .ag-header-cell-label .ag-header-cell-text {
    /*Force the width corresponding at how much width
      we need once the text is laid out vertically*/
    width: 55px;
    writing-mode: vertical-lr;
    -ms-writing-mode: tb-lr;
    line-height: 2em;
    margin-top: 60px;
  }

  .ag-pivot-off .ag-header-group-cell {
    font-size: 50px;
  }

  .ag-pivot-on .ag-header-group-cell {
    font-size: 10px;
    color: green;
  }

  .ag-pivot-off .ag-header-cell-label {
    color: #8a6d3b;
  }

  .ag-pivot-on .ag-header-cell-label {
    font-size: 10px;
    height: 90px;
    padding-top: 36px;
    margin-left: 0px;
    color: #1b6d85;
    font-weight: bold;
  }

  .ag-pivot-on .ag-header-cell-label .ag-header-cell-text {
    /*There is empty space left at the top from the menu and sort
      icons not used*/
    margin-top: 25px;
  }

  /*Floating filters*/
  .ag-floating-filter-body {
    height: 50px;
  }

  .ag-floating-filter-body input {
    height: 49px;
  }

  .ag-floating-filter-button {
    margin-top: -49px;
  }

  .ag-floating-filter-button button {
    height: 49px;
  }

  .ag-floating-filter-body input {
    font-size: 15px;
    font-weight: bold;
  }
</style>
<style lang="scss" scoped>

  .customHeaderLabel {
    width: 112px;
    height: 47px;
    border-bottom: 1px solid green;
    -webkit-transform:
            translateY(20px)
            translateX(5px)
            rotate(-26deg);
    position: absolute;
    top: -33px;
    left: -13px;
  }
</style>
