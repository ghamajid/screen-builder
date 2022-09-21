<template>
  <div class="form-group">
    <i v-if="star" class="fas fa-star text-danger m-2 icon-star-size"></i>
    <label class="item-label-size">{{ label }}</label>
    <input
      type="text"
      :class="((validate_status && star)? 'form-control form-control-lg is-invalid': 'form-control form-control-lg')"
      v-model="value1"
      :id="num_element_id"
      placeholder=""
      @keyup="checkInput"
    >
    <date-picker
      @change="$emit('input', (dataFormat == 'datetime')?$event.format('jYYYY/jMM/jDD HH:mm'):$event.format('jYYYY/jMM/jDD'))"
      :placeholder="placeholder ? placeholder : ''"
      :type="(dataFormat == 'datetime')?'datetime':'date'"
      :color="thcolor?thcolor.split('-')[0]:'#007bff'"
      :disabled="readonly"
      :max="maxDateChange"
      :min="minDateChange"
      :element="num_element_id"
    />
    <display-errors v-if="validate_status" :name="name" :error="log_error" :validator="validator"
                    class="invalid-feedback d-block"/>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
import { createUniqIdsMixin } from 'vue-uniq-ids';
import ValidationMixin from './mixins/validation';
import DataFormatMixin from './mixins/DataFormat';
import DisplayErrors from './common/DisplayErrors';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    DisplayErrors,
    datePicker: VuePersianDatetimePicker,
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'placeholder',
    'dataFormat',
    'thcolor',
    'readonly',
    'minDate',
    'maxDate',
  ],
  watch: {
    minDate: {
      handler() {
        this.minDateChange = (this.minDate) ? this.minDate.replaceAll('-', '/') : '';
      },
      deep: true,
      immediate: true,

    },
    maxDate: {
      handler() {
        this.maxDateChange = (this.maxDate) ? this.maxDate.replaceAll('-', '/') : '';
      },
      deep: true,
      immediate: true,

    },
    value: {
      handler() {
        //console.log(this.validator, 'value')
        //console.log((this.dataFormat == 'datetime'), 'minDate')
        this.value1 = this.$props.value

      },
      deep: true,
      immediate: true,

    },
    error() {
      if (this.error == 'Field is required' || this.error == 'فیلد الزامی است') {
        this.star = true;
        this.log_error = this.error;
      }
    },
    value1(val) {
      if (val !== null) {
        this.input_date = true
      }
    },
  },
  methods: {
    checkInput(val){
      this.value1 = '';
    }
  },
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || (this.error && this.input_date),
        [this.controlClass]: !!this.controlClass,
      };
    },
    validate_status() {
      if (this.input_date && this.value1 == '') {
        return true;
      } else {
        return (this.validator && this.validator.errorCount) || (this.error && this.input_date);
      }

    },
  },
  data() {
    return {
      value1: '',
      date: '',
      minDateChange: '',
      maxDateChange: '',
      input_date: false,
      star: false,
      log_error: this.error,
      num_element_id: this.name + new Date().getUTCMilliseconds()
    };
  },
};
</script>

