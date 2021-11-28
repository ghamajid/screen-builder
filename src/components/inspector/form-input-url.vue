<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="dataOption.url"
      @change="handlerChangeInput($event.target.value)"
      :name="name"
      class="form-control"
      :class="classList"
    >
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error"
      :validator="validator"
    />
    <!--    <small v-if="helper" class="form-text text-muted" v-html="helper"/>-->
    <pre id="json" class="url-sample"><small>sample: {{ JSON.stringify(helper, undefined, 2) }}</small></pre>
    <hr>

    <label>Show Pagination</label>
    <b-form-checkbox
      id="option-pagination"
      v-model="optionPagination"
      value="1"
      unchecked-value="0"
      @change="handlerChangeSelect('pagination',optionPagination)"
    />

    <label>Page Size Selection</label>
    <b-form-checkbox
      id="option-pageSize"
      v-model="optionPageSize"
      value="1"
      unchecked-value="0"
      @change="handlerChangeSelect('pageSize',optionPageSize)"
    />
    <!-- <label>column row</label>
        <b-form-checkbox
                id="option-pageSize"
                v-model="optionPageColumnRow"
                value="1"
                unchecked-value="0"
                @change="handlerChangeSelect('pageColumnRow',optionPageColumnRow)"
        />-->
  </div>
</template>

<script>

export default {
  inheritAttrs: false,
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
  ],
  computed: {
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass,
      };
    },
  },
  methods: {
    handlerChangeInput(input) {
      this.dataOption['url'] = input;
      this.$emit('input', this.dataOption);
    },
    handlerChangeSelect(string_v, chack) {
      this.dataOption[string_v] = chack;
      this.$emit('input', this.dataOption);
    },
  },
  data() {
    return {
      validator: null,
      optionsList: [],
      optionFilter: 0,
      optionPageSize: 0,
      optionPageColumnRow: 0,
      dataOption: {pageSize: 0, pagination: 0, url: ''},
      optionPagination: 0,
    };
  },
};
</script>

<style>
    .url-sample {
        margin-left: 20px;
        opacity: 0.7;
    }

    .custom-control {
        display: inline !important;
        margin-left: 20px;
    }
</style>