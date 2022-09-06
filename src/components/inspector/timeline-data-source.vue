<template>
  <div>
    <div v-if="!showJsonEditor && dataSource === dataSourceValues.provideData">
      <div class="row">
        <div class="col-10">
          <label for="data-sources"><b>{{ $t('Steps') }}</b></label>
        </div>
        <div class="col-2">
          <a @click="showAddOption" class="fas fa-plus-square" data-cy="inspector-add-option" />
        </div>
      </div>

      <div class="card mb-2" v-if="showOptionCard">
        <div class="card-header" v-if="optionCardType == 'insert'">
          {{ $t('Add Step') }}
        </div>
        <div v-else class="card-header">
          {{ $t('Edit Step') }}
        </div>
        <div class="card-body p-2">
<!--          <label for="option-value">{{ $t('Value') }}</label>-->
<!--          <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" data-cy="inspector-option-value" />-->
          <div v-if="optionError" class="invalid-feedback d-block text-right">
            <div>{{ optionError }}</div>
          </div>
          <label class="mt-3" for="option-title">{{ $t('Title') }}</label>
          <b-form-input id="option-title" v-model="optionTitle" data-cy="inspector-option-title" />
          <small v-if="helper_title" class="form-text text-muted" v-html="helper_title"/>

          <label class="mt-3" for="option-icon">{{ $t('Icon') }}</label>
          <b-form-input id="option-icon" v-model="optionIcon" data-cy="inspector-option-icon" placeholder="k-i-user"/>
          <small v-if="helper_icon" class="form-text text-muted" v-html="helper_icon"/>

        </div>

        <div class="card-footer text-right p-2">
          <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="showOptionCard=false" data-cy="inspector-option-cancel">
            {{ $t('Cancel') }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOption()" data-cy="inspector-option-save">
            {{ $t('Save') }}
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <draggable @update="updateSort" :element="'div'" v-model="optionsList" group="options" @start="drag=true" @end="drag=false" >
            <div v-for="(option, index) in optionsList" :key="option.value">
              <div v-if="removeIndex === index">
                <div class="card mb-3 bg-danger text-white text-left mt-2">
                  <div class="card-body p-2" v-html="currentItemToDelete"/>
                  <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-light mr-2" @click="removeIndex=null" data-cy="inspector-options-remove-cancel">
                      {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteOption()" data-cy="inspector-options-remove-confirm">
                      {{ $t('Delete') }}
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="editIndex === index">
                <div class="card my-2">
                  <div class="card-header" v-if="optionCardType == 'insert'">
                    {{ $t('Add Step') }}
                  </div>
                  <div v-else class="card-header">
                    {{ $t('Edit Step') }}
                  </div>
                  <div class="card-body p-2">
<!--                    <label for="option-value">{{ $t('Value') }}</label>-->
<!--                    <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" data-cy="inspector-option-value" />-->
                    <div v-if="optionError" class="invalid-feedback d-block text-right">
                      <div>{{ optionError }}</div>
                    </div>
                    <label class="mt-3" for="option-title">{{ $t('Title') }}</label>
                    <b-form-input id="option-title" v-model="optionTitle" data-cy="inspector-option-title" />
                    <small v-if="helper_title" class="form-text text-muted" v-html="helper_title"/>

                    <label class="mt-3" for="option-icon">{{ $t('Icon') }}</label>
                    <b-form-input id="option-icon" v-model="optionIcon" data-cy="inspector-option-icon" placeholder="k-i-user"/>
                    <small v-if="helper_icon" class="form-text text-muted" v-html="helper_icon"/>

                  </div>

                  <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="editIndex=null">
                      {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" @click="addOption()" data-cy="inspector-option-save">
                      {{ $t('Update') }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="row border-top" :class="rowCss(index)">
                <div class="col-1" style="cursor:grab">
                  <span class="fas fa-arrows-alt-v"/>
                </div>
                <div class="col-2 d-flex align-items-center" style="cursor:grab">
                  {{ option[valueIcon] }}
                </div>
                <div class="col-5" style="cursor:grab">
                  {{ option[valueField] }}
                </div>
                <div class="col-1">
                  <a @click="showEditOption(index)" class="fas fa-cog" style="cursor:pointer" data-cy="inspector-options-edit"/>
                </div>
                <div class="col-1">
                  <a @click="removeOption(index)" class="fas fa-trash-alt" style="cursor:pointer" data-cy="inspector-options-remove" />
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <button type="button" @click="showJsonEditor = true" class="edit-json text-muted mt-1 mb-3" data-cy="inspector-edit-json">
            <i class="fas fa-code" aria-hidden="true"/>
            {{ $t('Edit as JSON') }}
          </button>
        </div>
      </div>
      <small v-if="helper" class="form-text text-muted" v-html="helper"/>

    </div>
    <div v-if="showJsonEditor && dataSource === dataSourceValues.provideData">
      <div class="mb-2">
        <label for="json-data">{{ $t('JSON Data') }}</label>
        <button type="button" @click="expandEditor" class="btn-sm float-right" data-cy="inspector-monaco-json-expand"><i class="fas fa-expand"/></button>
      </div>
      <div class="small-editor-container">
        <monaco-editor
          :options="monacoOptions"
          class="editor"
          v-model="jsonData"
          language="json"
          @change="jsonDataChange"
          data-cy="inspector-monaco-json"
          @editorDidMount="monacoMounted"
        />
      </div>

      <b-modal v-model="showPopup" size="lg" centered :title="$t('Script Config Editor')" v-cloak>
        <div class="editor-container">
          <monaco-editor :options="monacoLargeOptions" v-model="jsonData" language="json" class="editor"
            @change="jsonDataChange"
            data-cy="inspector-monaco-json-expanded"
          />
        </div>
        <div slot="modal-footer">
          <b-button @click="closePopup" class="btn btn-secondary text-uppercase" data-cy="inspector-monaco-json-expanded-close">
            {{ $t('Close') }}
          </b-button>
        </div>
      </b-modal>

      <button type="button" @click="showJsonEditor = false" class="edit-json text-muted mt-1 mb-3">
        <i class="fas fa-code" aria-hidden="true"/>
        {{ $t('Edit as Option List') }}
      </button>
    </div>

  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { dataSources, dataSourceValues } from './data-source-types';
import MonacoEditor from 'vue-monaco';
import MustacheHelper from './mustache-helper';
import _ from 'lodash';

export default {
  components: {
    draggable,
    MonacoEditor,
    MustacheHelper,
  },
  props: ['options', 'selectedControl','helper','helper_title','helper_icon'],
  model: {
    prop: 'options',
    event: 'change',
  },
  data() {
    return {
      optionError:'',
      dragging: false,
      dataSourceValues,
      dataSources,
      dataSource: dataSourceValues.provideData,
      jsonData: '',
      selectedDataSource: '',
      dataSourcesList: [],
      endpoints: {},
      optionsList: [],
      showOptionCard: false,
      showRemoveWarning: false,
      showJsonEditor: false,
      optionCardType: '',
      editIndex: null,
      removeIndex: null,
      // optionValue: '',
      optionTitle: '',
      optionIcon: '',
        monacoOptions: {
        automaticLayout: true,
        fontSize: 8,
        language: 'json',
        formatOnPaste: true,
        formatOnType: true,
      },
      monacoLargeOptions: {
        automaticLayout: true,
      },
      showPopup: false,
     };
  },
  watch: {
     options(newOptions) {
      Object.keys(newOptions).forEach(key => {
        if (typeof newOptions[key] !== 'undefined') {
          this.$set(this, key, newOptions[key]);
        }
      });
    },
    dataSource(val) {
          this.selectedDataSource = '';
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },

  },
  computed: {

    optionKeyClass() {
      return this.optionError ? 'is-invalid' : '';
    },
    keyField() {
      return 'value';
    },
    valueField() {
      return 'label';
    },valueIcon() {
      return 'icon';
    },
    currentItemToDelete() {
      if (this.removeIndex !== null
          && this.optionsList.length > 0
          && this.optionsList[this.removeIndex] !==
          undefined) {
        let itemName =  this.optionsList[this.removeIndex][this.valueField];
        return this.$t('Are you sure you want to delete "{{item}}" option?', {item:itemName});
      }
      return '';
    },
    dataObjectOptions() {
      return {
        dataSource: this.dataSource,
        jsonData: this.jsonData,
        selectedDataSource: this.selectedDataSource,
        optionsList: this.optionsList,
        showOptionCard: this.showOptionCard,
        showRemoveWarning: this.showRemoveWarning,
        showJsonEditor: this.showJsonEditor,
        editIndex: this.editIndex,
        removeIndex: this.removeIndex,
      };
    },
  },
  mounted() {
    this.dataSource = this.options.dataSource;
    this.jsonData = this.options.jsonData;
    this.selectedDataSource = this.options.selectedDataSource;
    console.log('TimelineDataSource',this.options,this.options.optionsList,this.options.optionsList !== 'undefined');
    this.optionsList = (this.options && this.options.optionsList !== 'undefined') ? this.options.optionsList : [];
    this.jsonData = JSON.stringify(this.optionsList);
  },
  methods: {
    monacoMounted(editor) {
      editor.getAction('editor.action.formatDocument').run();
    },

    convertToSelectOptions(option) {
      return {
        value: option['id'],
        text: option['name'],
      };
    },

    jsonDataChange() {
      let jsonList = [];
      try {
        jsonList = JSON.parse(this.jsonData);
        if (jsonList.constructor !== Array && jsonList.constructor !== Object) {
          throw Error('String does not represent a valid JSON');
        }
      }
      catch (err) {
        this.jsonError = err.message;
        return;
      }
      this.optionsList = [];
      const that = this;
      jsonList.forEach (item => {
        that.optionsList.push({
          [that.keyField] : item[that.keyField],
          [that.valueField] : item[that.valueField],
        });
      });
      this.jsonError = '';
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
    updateSort() {
      this.jsonData = JSON.stringify(this.optionsList);
      this.$emit('change', this.dataObjectOptions);

    },
    showEditOption(index) {
      this.optionCardType = 'edit';
      this.editIndex = index;
      this.optionTitle = this.optionsList[index][this.valueField];
      this.optionIcon = this.optionsList[index][this.valueIcon];
      // this.optionValue = this.optionsList[index][this.keyField];
      this.optionError = '';
    },
    showAddOption() {
      this.optionCardType = 'insert';
      this.optionTitle = '';
      this.optionIcon = '';
      // this.optionValue = '';
      this.showOptionCard = true;
      this.optionError = '';
      this.editIndex = null;
    },
    addOption() {
      const that = this;

      if (this.optionCardType === 'insert') {
        if (this.optionsList.find(item => { return item[that.keyField] === this.optionTitle; })) {
        // if (this.optionsList.find(item => { return item[that.keyField] === this.optionValue; })) {
          this.optionError = 'An item with the same key already exists';
          return;
        }
        this.optionsList.push(
          {
            [this.valueField]: this.optionTitle,
            [this.valueIcon]: this.optionIcon,
            // [this.keyField]: this.optionValue,
          }
        );
      }
      else {
        if (this.optionsList.find((item, index) => { return item[that.keyField] === this.optionTitle && index !== this.editIndex ; })) {
        // if (this.optionsList.find((item, index) => { return item[that.keyField] === this.optionValue && index !== this.editIndex ; })) {
          this.optionError = 'An item with the same key already exists';
          return;
        }
        // this.optionsList[this.editIndex][this.keyField] = this.optionValue;
        this.optionsList[this.editIndex][this.valueField] = this.optionTitle;
        this.optionsList[this.editIndex][this.valueIcon] = this.optionIcon;
      }

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

<style scoped lang="scss">
  .edit-json {
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    width: 100%;
    text-align: right;

    &:hover {
      text-decoration: underline;
    }
  }

  .striped {
    background-color: rgba(0,0,0,.05);
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
</style>
