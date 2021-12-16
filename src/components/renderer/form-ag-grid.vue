<template>
    <div class="form-group">
        <label>{{ label }}</label>
        <div v-if="(url_grid && url_grid.pageSize == 1)" class="example-header">
            Page Size:
            <select @change="onPageSizeChanged($event)" id="page-size">
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
        </div>
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
            :pagination="(url_grid && url_grid.pagination == 1)?true:false"
            :paginationPageSize="paginationPageSize"
            :paginationNumberFormatter="paginationNumberFormatter"
            @cell-clicked="onCellClicked"
        />
        <!--<display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>-->
        <!--<display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>-->
        <small v-if="helper" class="form-text text-muted" v-html="helper"/>
    </div>
</template>

<script>
import BtnCellRenderer from './Action/btn-cell-renderer.js';
import {AgGridVue} from 'ag-grid-vue';

export default {
    inheritAttrs: false,
    components: {
        AgGridVue,
        // eslint-disable-next-line vue/no-unused-components
        rowNodeIdRenderer(params) {
            return params.node.id + 1;
        },
    },
    data() {
        return {
            trans_option: this.transientData[this.name],
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
        'value',
        'label',
        'error',
        'helper',
        'name',
        'controlClass',
        'dataFormat',
        'fields',
        'url_grid',
        'height_ag_grid',
    ],
    beforeMount() {
        this.columnDefs = [];
        if (this.label === null) {
            this.rowData = [];
        }
        var data = [];
        if (this.fields && this.fields.optionsList) {
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
        }
        
        this.columnDefs = data;
        
        this.paginationPageSize = 10;
        this.paginationNumberFormatter = (params) => {
            return '[' + params.value.toLocaleString() + ']';
        };
    },
    mounted() {
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
    watch: {
        fields: {
            handler() {
                this.columnDefs = [];
                if (this.url_grid === undefined) {
                    this.rowData = [];
                }
                var data = [];
                if (this.fields && this.fields.optionsList) {
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
                }
                this.columnDefs = data;
            },
            deep: true,
            immediate: true,
        },
        transientData: {
            deep: true,
            handler() {
                if (this.url_grid == undefined) {
                    this.trans_option = this.transientData[this.name];
                    //console.log(this.trans_option,'111111111111');
                    this.updateDataGrid(this.transientData[this.name]);
                }
            },
        },
        trans_option: {
            deep: true,
            handler() {
                var self = this;
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
                recurse(this.transientData);
                //console.log(this.transientData[this.name],'9999999999');
            },
        },
    },
    methods: {
        onCellClicked(params) {
            if (
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
                    /*let recurse = function (data) {
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
                    }*/
                }
            }
        },
        // eslint-disable-next-line no-unused-vars
        onGridReady(params) {
            var self = this;
            const updateData = (data) => {
                self.rowData = data;
                
                this.$emit('input', self.rowData);
            };
            if (this.url_grid && this.url_grid.url) {
                fetch(this.url_grid.url)
                    .then((resp) => resp.json())
                    .then((data) => updateData(data));
            } else {
                if (self.transientData) {
                    updateData(self.transientData[self.name]);
                }
            }
            
        },
        updateDataGrid(data) {
            this.rowData = data;
            this.columnDefs.map(param => {
                if (param.date == true) {
                    this.rowData.forEach(row => {
                        if (row[param.field]) {
                            row[param.field] = (row[param.field]).replaceAll("&#x2F;", "/");
                        }
                    })
                }
            });
            
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
