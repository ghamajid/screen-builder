<template>
  <div>
    <div :class="divClass" :key="getOptionValue(option)" v-for="option in options">
      <input
        :class="inputClass"
        type="checkbox"
        v-uni-id="getOptionId(option)"
        :name="`${name}`"
        :value="emitObjects ? option : getOptionValue(option)"
        v-model="selected"
        v-bind="$attrs"
      >
      <label :class="labelClass" v-uni-for="getOptionId(option)">
        {{ getOptionContent(option) }}
      </label>
    </div>
  </div>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids';
import ValidationMixin from '../mixins/validation';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin],
  props: [
    'value',
    'optionValue',
    'optionContent',
    'options',
    'error',
    'helper',
    'name',
    'controlClass',
    'emitObjects',
    'emitArray',
  ],
  data() {
    return {
      selected:[],
    };
  },
  mounted() {
    this.selected = this.value ? this.value : [];
  },
  watch: {
    value(val) {
      this.selected = val ? val : [];
    },
    selected() {
      this.$emit('input', this.selected);
    },
  },
  computed: {
    divClass() {
      return this.toggle ? 'custom-control custom-radio' : 'form-check';
    },
    labelClass() {
      return this.toggle ? 'custom-control-label' : 'form-check-label';
    },
    inputClass() {
      return [
        {[this.controlClass]: !!this.controlClass},
        {'is-invalid': (this.validator && this.validator.errorCount) || this.error},
        this.toggle ? 'custom-control-input' : 'form-check-input',
      ];
    },
  },
  methods: {
    getOptionValue(option) {
      return option[this.optionValue || 'value'];
    },
    getOptionContent(option) {
      return option[this.optionContent || 'content'];
    },
    getOptionId(option) {
      return `${this.name}-${this.getOptionValue(option)}`;
    },
  },
};
</script>
