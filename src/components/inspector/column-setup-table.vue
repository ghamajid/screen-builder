<template>
    <div>
        <div v-if="!showJsonEditor &&  dataSource === dataSourceValues.provideData">
            <div class="row">
                <div class="col-10">
                    <label><b>{{ $t('Column') }}</b></label>
                </div>
                <div class="col-2">
                    <a @click="showAddOption" class="fas fa-plus-square"/>
                </div>
            </div>
            
            <div class="card mb-2" v-if="showOptionCard">
                <div class="card-header" v-if="optionCardType == 'insert'">
                    {{ $t('Add Column') }}
                </div>
                <div v-else class="card-header">
                    {{ $t('Edit Column') }}
                </div>
                <div class="card-body p-2">
                    <label class="mt-3">{{ $t('Column Header') }}</label>
                    <b-form-input id="option-content" v-model="optionContent"/>
                    <label>{{ $t('Value') }}</label>
                    <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass"/>
                    <ul class="column-checkbox-list" style="list-style-type: none; padding: 0">
                        <li>
                            <label>{{ $t('Sort') }}</label>
                            <b-form-checkbox
                                id="option-sort"
                                v-model="optionSort"
                                value="1"
                                unchecked-value="0"
                            />
                        </li>
                        <li>
                            <label>{{ $t('Filter') }}</label>
                            <b-form-checkbox
                                id="option-filter"
                                v-model="optionFilter"
                                value="1"
                                unchecked-value="0"
                            />
                        </li>
                        <li v-if="optionValue === 'action'">
                            <label>{{ $t('Action Delete') }}</label>
                            <b-form-checkbox
                                id="action-delete"
                                v-model="optionDelete"
                                value="1"
                                unchecked-value="0"
                            />
                        </li>
                        <li v-if="optionValue === 'action'">
                            <label>{{ $t('Action Edit') }}</label>
                            <b-form-checkbox
                                id="action-edit"
                                v-model="optionEdit"
                                value="1"
                                unchecked-value="0"
                            />
                        </li>
                    </ul>
                    
                    
                    <div v-if="optionError" class="invalid-feedback d-block text-right">
                        <div>{{ optionError }}</div>
                    </div>
                </div>
                <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="showOptionCard=false">
                        {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
                        {{ $t('Save') }}
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col">
                    <draggable @update="updateSort" :element="'div'" v-model="optionsList" group="options" @start="drag=true" @end="drag=false">
                        <div v-for="(option, index) in optionsList" :key="option.value">
                            <div v-if="removeIndex === index">
                                <div class="card mb-3 bg-danger text-white text-right">
                                    <div class="card-body p-2">
                                        {{ currentItemToDelete }}
                                    </div>
                                    <div class="card-footer text-right p-2">
                                        <button type="button" class="btn btn-sm btn-light mr-2" @click="removeIndex=null">
                                            {{ $t('Cancel') }}
                                        </button>
                                        <button type="button" class="btn btn-sm btn-danger" @click="deleteOption()">
                                            {{ $t('Delete') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-if="editIndex === index">
                                <div class="card my-2">
                                    <div class="card-header" v-if="optionCardType == 'insert'">
                                        {{ $t('Add Option') }}
                                    </div>
                                    <div v-else class="card-header">
                                        {{ $t('Edit Option') }}
                                    </div>
                                    <div class="card-body p-2">
                                        <label class="mt-3">{{ $t('Column Header') }}</label>
                                        <b-form-input id="option-content" v-model="optionContent"/>
                                        <label>{{ $t('Value') }}</label>
                                        <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass"/>
                                        <ul class="column-checkbox-list" style="list-style-type: none; padding: 0">
                                            <li>
                                                <label>{{ $t('Sort') }}</label>
                                                <b-form-checkbox
                                                    id="option-sort"
                                                    v-model="optionSort"
                                                    value="1"
                                                    unchecked-value="0"
                                                />
                                            </li>
                                            <li>
                                                <label>{{ $t('Filter') }}</label>
                                                <b-form-checkbox
                                                    id="option-filter"
                                                    v-model="optionFilter"
                                                    value="1"
                                                    unchecked-value="0"
                                                />
                                            </li>
                                            <li v-if="optionValue === 'action'">
                                                <label>{{ $t('Action Delete') }}</label>
                                                <b-form-checkbox
                                                    v-if="optionValue === 'action'"
                                                    id="action-delete"
                                                    v-model="optionDelete"
                                                    value="1"
                                                    unchecked-value="0"
                                                />
                                            </li>
                                            <li v-if="optionValue === 'action'">
                                                <label>{{ $t('Action Edit') }}</label>
                                                <b-form-checkbox
                                                    id="action-edit"
                                                    v-model="optionEdit"
                                                    value="1"
                                                    unchecked-value="0"
                                                />
                                            </li>
                                        </ul>
                                        <div v-if="optionError" class="invalid-feedback d-block text-right">
                                            <div>{{ optionError }}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="card-footer text-right p-2">
                                        <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="editIndex=null">
                                            {{ $t('Cancel') }}
                                        </button>
                                        <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
                                            {{ $t('Update') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row border-top" :class="rowCss(index)">
                                <div class="col-1" style="cursor:grab">
                                    <span class="fas fa-arrows-alt-v"/>
                                </div>
                                <!--<div class="col-1 d-flex align-items-center">
                                  <input type="radio" class="form-check" @click="defaultOptionClick" name="defaultOptionGroup" v-model="defaultOptionKey" :value="option[keyField]">
                                </div>-->
                                <div class="col-5" style="cursor:grab">
                                    {{ option[valueField] }}
                                </div>
                                <div class="col-1">
                                    <a @click="showEditOption(index)" class="fas fa-cog" style="cursor:pointer"/>
                                </div>
                                <div class="col-1">
                                    <a @click="removeOption(index)" class="fas fa-trash-alt" style="cursor:pointer"/>
                                </div>
                            </div>
                        </div>
                    </draggable>
                </div>
            </div>
            <div class="row">
                <div class="col text-right">
                    <a @click="editAsJson()" href="#">
                        <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{ $t('Edit as JSON') }}</small>
                    </a>
                </div>
            </div>
            <div class="row mb-3" v-if="showRenderAs">
                <div class="col-12">
                    <input type="checkbox" v-model="allowMultiSelect">
                    Allow multiple selections
                </div>
            </div>
            <div class="row mb-3" v-if="showRenderAs">
                <div class="col">
                    <label>{{ $t('Render Options As') }}</label>
                    <b-form-select id="render-as" v-model="renderAs" :options="renderAsOptions"/>
                </div>
            </div>
        </div>
        <div v-if="showJsonEditor && dataSource === dataSourceValues.provideData">
            <div v-if="dataSource === dataSourceValues.provideData">
                <div class="mb-2">
                    <label>{{ $t('JSON Data') }}</label>
                    <button type="button" @click="expandEditor" class="btn-sm float-right"><i class="fas fa-expand"/></button>
                </div>
                <div class="small-editor-container">
                    <MonacoEditor :options="monacoOptions" class="editor" v-model="jsonData" language="json" @change="jsonDataChange"/>
                </div>
                
                <b-modal v-model="showPopup" size="lg" centered :title="$t('Script Config Editor')" v-cloak header-close-content="&times;">
                    <div class="editor-container">
                        <MonacoEditor :options="monacoLargeOptions" v-model="jsonData" language="json" class="editor" @change="jsonDataChange"/>
                    </div>
                    <div slot="modal-footer">
                        <b-button @click="closePopup" class="btn btn-secondary text-uppercase">
                            {{ $t('Close') }}
                        </b-button>
                    </div>
                </b-modal>
            </div>
            
            <div v-if="jsonError" class="invalid-feedback d-block text-right">
                <div>{{ jsonError }}</div>
            </div>
            
            <a @click="editAsOptionList()" href="#" class="text-right">
                <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{ $t('Edit as Option List') }}</small>
            </a>
        </div>
        
        <div v-if="dataSource === dataSourceValues.dataObject">
            <label>{{ $t('Data Name') }}</label>
            <b-form-input id="data-name" v-model="dataName"/>
            <small class="form-text text-muted mb-3">{{ $t('Data source to populate select') }}</small>
        </div>
        
        <div v-if="dataSource === dataSourceValues.dataObject || showJsonEditor">
            <label>{{ $t('Value') }}</label>
            <b-form-input id="key" v-model="key" @change="keyChanged"/>
            <small class="form-text text-muted mb-3">{{ $t('Field to save to the data object') }}</small>
            
            <label>{{ $t('Content') }}</label>
            <b-form-input id="value" v-model="value" @change="valueChanged"/>
            <small class="form-text text-muted mb-3">{{ $t('Field to show in the select box') }}</small>
        </div>
        
        <div v-if="dataSource === dataSourceValues.dataObject">
            <label>{{ $t('PMQL') }}</label>
            <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>
            <small class="form-text text-muted">Advanced data search</small>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import {dataSources, dataSourceValues} from './data-source-types';
import MonacoEditor from 'vue-monaco';

export default {
    components: {
        draggable,
        MonacoEditor,
    },
    props: ['options'],
    model: {
        prop: 'options',
        event: 'change',
    },
    data() {
        return {
            jsonError: '',
            optionError: '',
            dragging: false,
            dataSourceValues,
            dataSources,
            dataSource: dataSourceValues.provideData,
            jsonData: '',
            key: null,
            value: null,
            dataName: '',
            pmqlQuery: '',
            optionsList: [],
            showOptionCard: false,
            showRemoveWarning: false,
            showJsonEditor: false,
            optionCardType: '',
            editIndex: null,
            removeIndex: null,
            optionValue: '',
            optionDelete: 0,
            optionEdit: 0,
            optionSort: 0,
            optionFilter: 0,
            optionContent: '',
            showRenderAs: false,
            renderAs: 'dropdown',
            allowMultiSelect: false,
            defaultOptionKey: false,
            selectedOptions: [],
            renderAsOptions: [
                {
                    text: 'Dropdown/Multiselect',
                    value: 'dropdown',
                },
                {
                    text: 'Radio/Checkbox Group',
                    value: 'checkbox',
                },
            ],
            monacoOptions: {
                automaticLayout: true,
                fontSize: 8,
            },
            monacoLargeOptions: {
                automaticLayout: true,
            },
            showPopup: false,
        };
    },
    watch: {
        options: {
            handler() {
                this.dataSource = this.options.dataSource;
                this.jsonData = this.options.jsonData;
                this.dataName = this.options.dataName;
                this.key = this.options.key;
                this.value = this.options.value;
                this.pmqlQuery = this.options.pmqlQuery;
                this.defaultOptionKey = this.options.defaultOptionKey;
                this.selectedOptions = this.options.selectedOptions;
                this.optionsList = this.options.optionsList;
                this.showRenderAs = this.options.showRenderAs;
                this.renderAs = this.options.renderAs;
                this.allowMultiSelect = this.options.allowMultiSelect;
                this.showOptionCard = this.options.showOptionCard;
                this.showRemoveWarning = this.options.showRemoveWarning;
                this.showJsonEditor = this.options.showJsonEditor;
                this.editIndex = this.options.editIndex;
                this.removeIndex = this.options.removeIndex;
            },
        },
        dataSource() {
            this.jsonData = '';
            this.dataName = '';
        },
        dataObjectOptions(dataObjectOptions) {
            this.$emit('change', dataObjectOptions);
        },
    },
    computed: {
        jsonDataClass() {
            return this.jsonError ? 'is-invalid' : '';
        },
        optionKeyClass() {
            return this.optionError ? 'is-invalid' : '';
        },
        keyField() {
            return this.key || 'value';
        },
        valueField() {
            return this.value || 'content';
        },
        currentItemToDelete() {
            if (this.removeIndex !== null
                && this.optionsList.length > 0
                && this.optionsList[this.removeIndex] !==
                undefined) {
                let itemName = this.optionsList[this.removeIndex][this.valueField];
                return this.$t('Are you sure you want to delete "{{item}}"?', {item: itemName});
            }
            return '';
        },
        dataObjectOptions() {
            return {
                dataSource: this.dataSource,
                jsonData: this.jsonData,
                dataName: this.dataName,
                key: this.key,
                value: this.value,
                pmqlQuery: this.pmqlQuery,
                defaultOptionKey: this.defaultOptionKey,
                selectedOptions: this.selectedOptions,
                optionsList: this.optionsList,
                showRenderAs: this.showRenderAs,
                renderAs: this.renderAs,
                allowMultiSelect: this.allowMultiSelect,
                showOptionCard: this.showOptionCard,
                showRemoveWarning: this.showRemoveWarning,
                showJsonEditor: this.showJsonEditor,
                editIndex: this.editIndex,
                removeIndex: this.removeIndex,
            };
        },
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            if (this.options) {
                this.dataSource = this.options.dataSource;
                this.jsonData = this.options.jsonData;
                this.dataName = this.options.dataName;
                this.key = this.options.key;
                this.value = this.options.value;
                this.pmqlQuery = this.options.pmqlQuery;
                this.defaultOptionKey = this.options.defaultOptionKey;
                this.selectedOptions = this.options.selectedOptions;
                this.optionsList = this.options.optionsList ? this.options.optionsList : [];
                this.jsonData = JSON.stringify(this.optionsList);
                this.showRenderAs = this.options.showRenderAs;
                this.renderAs = this.options.renderAs;
                this.allowMultiSelect = this.options.allowMultiSelect;
            }
        },
        defaultOptionClick() {
            if (this.defaultOptionKey === event.target.value) {
                this.defaultOptionKey = false;
            }
        },
        rowCss(index) {
            return index % 2 === 0 ? 'striped' : 'bg-default';
        },
        keyChanged() {
            this.jsonDataChange();
        },
        valueChanged() {
            this.jsonDataChange();
        },
        jsonDataChange() {
            let jsonList = [];
            try {
                jsonList = JSON.parse(this.jsonData);
                if (jsonList.constructor !== Array && jsonList.constructor !== Object) {
                    throw Error('String does not represent a valid JSON');
                }
            } catch (err) {
                this.jsonError = err.message;
                return;
            }
            
            this.optionsList = [];
            const that = this;
            jsonList.forEach(item => {
                that.optionsList.push({
                    [that.keyField]: item[that.keyField],
                    [that.valueField]: item[that.valueField],
                });
            });
            this.jsonError = '';
        },
        updateSort() {
            this.jsonData = JSON.stringify(this.optionsList);
            this.$emit('change', this.dataObjectOptions);
        },
        editAsJson() {
            this.showJsonEditor = true;
        },
        editAsOptionList() {
            this.showJsonEditor = false;
        },
        showEditOption(index) {
            this.optionCardType = 'edit';
            this.editIndex = index;
            this.optionContent = this.optionsList[index][this.valueField];
            this.optionValue = this.optionsList[index][this.keyField];
            this.optionDelete = this.optionsList[index]['delete'];
            this.optionEdit = this.optionsList[index]['edit'];
            this.optionSort = this.optionsList[index]['sort'];
            this.optionFilter = this.optionsList[index]['filter'];
            this.optionError = '';
        },
        showAddOption() {
            this.optionCardType = 'insert';
            this.optionContent = '';
            this.optionValue = '';
            this.optionDelete = 0;
            this.optionEdit = 0;
            this.optionSort = 0;
            this.optionFilter = 0;
            this.showOptionCard = true;
            this.optionError = '';
            this.editIndex = null;
        },
        addOption() {
            const that = this;
            if (this.optionsList === undefined) {
                this.initData();
            }
            
            if (this.optionCardType === 'insert') {
                if (this.optionsList.find(item => {
                    return item[that.keyField] === this.optionValue;
                })) {
                    this.optionError = 'An item with the same key already exists';
                    return;
                }
                this.optionsList.push(
                    {
                        [this.valueField]: this.optionContent,
                        [this.keyField]: this.optionValue,
                        ['delete']: this.optionDelete,
                        ['edit']: this.optionEdit,
                        ['sort']: this.optionSort,
                        ['filter']: this.optionFilter,
                    },
                );
            } else {
                if (this.optionsList.find((item, index) => {
                    return item[that.keyField] === this.optionValue && index !== this.editIndex;
                })) {
                    this.optionError = 'An item with the same key already exists';
                    return;
                }
                this.optionsList[this.editIndex][this.keyField] = this.optionValue;
                this.optionsList[this.editIndex][this.valueField] = this.optionContent;
                this.optionsList[this.editIndex]['delete'] = this.optionDelete;
                this.optionsList[this.editIndex]['edit'] = this.optionEdit;
                this.optionsList[this.editIndex]['sort'] = this.optionSort;
                this.optionsList[this.editIndex]['filter'] = this.optionFilter;
            }
            
            this.jsonError = '';
            this.jsonData = JSON.stringify(this.optionsList);
            this.showOptionCard = false;
            this.optionError = '';
            this.editIndex = null;
        },
        
        deleteOption() {
            this.optionsList.splice(this.removeIndex, 1);
            this.jsonData = JSON.stringify(this.optionsList);
            this.showRemoveWarning = false;
            this.removeIndex = null;
        },
        
        removeOption(index) {
            this.removeIndex = index;
            this.showRemoveWarning = true;
        },
        
        expandEditor() {
            this.showPopup = true;
        },
        closePopup() {
            this.showPopup = false;
        },
    },
};
</script>
<style scoped>
.striped {
    background-color: rgba(0, 0, 0, .05);
}

.small-editor-container .editor {
    width: inherit;
    height: 150px;
}

.editor-container {
    height: 70vh;
}

.editor-container .editor {
    height: inherit;
}

.custom-control {
    display: inline;
    padding-left: 30px;
    padding-top: 50px;
}
</style>
