<template>
  <div>
    <div id="children_field"    class="row mb-3">
      <div class="col-12">
        <b-form-select id="data-mode" v-model="dataMode" @change="dataChange" :options="dataModeOptions" class="mb-3" data-cy="inspector-data-sources" />
        {{ $t('Set data-mode.') }}
      </div>
      <div class="col-12" v-if="dataMode === 'tree'">
        <label >{{ $t('Children-Field') }}</label>
        <b-form-input @change="dataChange" v-model="childrenField" placeholder="children-field"/>
        {{ $t('Enter  children-field-name.') }}
      </div>
      <div class="col-12" v-if="dataMode === 'formal'">
        <label >{{ $t('Parent-Field') }}</label>
        <b-form-input @change="dataChange" v-model="parentField" placeholder="parent-field"/>
        {{ $t('Enter  parent-field-name.') }}
      </div>
    </div>
    <div id="url_field"         class="row mb-3">
      <div class="col-12">
        {{ $t('Url') }}
        <b-form-input v-model="dataUrl" @change="dataChange" placeholder="Url"/>
        {{ $t('Enter data address.') }}
      </div>
    </div>
    <div id="id_field"          class="row mb-3">
      <div class="col-12">
        <label >{{ $t('Id-Field') }}</label>
        <b-form-input @change="dataChange" v-model="valueField" placeholder="id-field"/>
        {{ $t('Enter id-field-name.') }}
      </div>
    </div>
    <div id="text_field"        class="row mb-3">
      <div class="col-12">
        {{ $t('Text-Field') }}
        <b-form-input @change="dataChange" v-model="textField" placeholder="text-field"/>
        {{ $t('Enter text-field-name.') }}
      </div>

    </div>
    <div id="checkbox_field"    class="row mb-3">
      <div class="col-12">
        <input type="checkbox" @change="dataChange" v-model="showCheckbox" data-cy="inspector-allow-show-checkbox">
        {{ $t('Allow_Show_Checkbox') }}
      </div>
    </div>
    <div id="collapse_field"    class="row mb-3">
      <div class="col-12">
        <input type="checkbox" @change="dataChange" v-model="collapse" data-cy="inspector-allow-collapse">
        {{ $t('Allow_Collapse_Item') }}
      </div>
    </div>
    <div id="multiple_field"    class="row mb-3">
      <div class="col-12">
        <input type="checkbox" @change="dataChange" v-model="multiple" data-cy="inspector-allow-multiple">
        {{ $t('Allow_Multiple_Selection') }}
      </div>
    </div>
    <div id="allowbatch_field"  class="row mb-3">
      <div class="col-12">
        <input type="checkbox" @change="dataChange" v-model="allowBatch" data-cy="inspector-allow-batch">
        {{ $t('Allow_Batch_Selection') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataUrl: '',
      showCheckbox: false,
      collapse: false,
      multiple: false,
      allowBatch: false,
      textField: '',
      valueField: '',
      childrenField: '',
      parentField: '',
      dataMode: 'tree',
      dataModeOptions: [
        { value: 'tree', text: 'Tree Data' },
        { value: 'formal', text: 'Formal Data' },
      ],
    };
  },
  props: ['options', 'selectedControl'],
  watch: {
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
  },
  methods:{
    dataChange(){
      this.$emit('input', this.dataObjectOptions);
    },
  },
  computed:{
    dataObjectOptions() {
      return {
        dataUrl: this.dataUrl,
        showCheckbox: this.showCheckbox,
        collapse: this.collapse,
        multiple: this.multiple,
        allowBatch: this.allowBatch,
        textField: this.textField,
        valueField: this.valueField,
        childrenField: this.childrenField,
        parentField: this.parentField,
        dataMode: this.dataMode,
      };
    },
  },
};
</script>
