<template>
  <div class="form-group">
 
    <i v-if="star" class="fas fa-star text-danger m-2 icon-star-size"></i>
    <label v-uni-for="name" class="item-label-size">{{ labele }}</label>
   <component
        v-if="componentType!=='input'"
        :is="componentType"
        v-model="localValue"
        v-bind="componentConfig"
        v-uni-id="name"
        :name="name"
        class="form-control"
        :class="classList"
        type="text"
    />
    <input v-else
           v-model="localValue"
           v-bind="componentConfig"
           v-uni-id="name"
           :name="name"
           class="form-control"
           :class="(input_data  && classList)?classList:''"
           :type="dataType"
           :maxlength="maxlength"
    >
    <template v-if="validator && validator.errorCount">
      <div class="invalid-feedback" v-for="(errors, index) in validator.errors.all()" :key="index">
        <div v-for="(error, subIndex) in errors" :key="subIndex">
          {{ error }}
        </div>
      </div>
    </template>
    <div class="invalid-feedback" v-if="error">{{ error }}</div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids';
import Inputmasked from './form-input-masked';
import {TheMask} from 'vue-the-mask';
import {getUserDateFormat, getUserDateTimeFormat} from '@processmaker/vue-form-elements/src/dateUtils';
import ValidationMixin from '@processmaker/vue-form-elements/src/components/mixins/validation';
import moment from 'moment';

const uniqIdsMixin = createUniqIdsMixin();
const componentTypes = {
  currency: 'inputmasked',
  date: 'the-mask',
  datetime: 'the-mask',
  percentage: 'inputmasked',
  custom: 'the-mask',
};
const componentTypesConfigs = {
  currency: 'getCurrencyFormat',
  date: 'getDateFormat',
  datetime: 'getDatetimeFormat',
  percentage: 'getPercentageFormat',
  custom: 'getCustomFormatter',
};

export default {
  inheritAttrs: false,
  components: {TheMask, Inputmasked},
  mixins: [uniqIdsMixin, ValidationMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'dataMask',
    'config',
  ],
  methods: {
    getUserConfig() {
      return (window.ProcessMaker && window.ProcessMaker.user) || {};
    },
    getUserDateFormat,
    getUserDateTimeFormat,
    convertToData(newValue) {
      if (this.customFormatter) {
        newValue = newValue.replace(/[^\w]/g, '');
      } else {
        switch (this.dataFormat) {
          case 'string':
            newValue = newValue.toString();
            break;
          case 'boolean':
            newValue = Boolean(newValue);
            break;
          case 'currency':
          case 'percentage':
          case 'float':
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) {
              newValue = null;
            }
            break;
          case 'int':
            newValue = parseInt(newValue);
            if (isNaN(newValue)) {
              newValue = null;
            }
            break;
          case 'date':
            if (this.componentName === 'FormDatePicker') {
              newValue = moment.utc(newValue, [getUserDateFormat(), moment.ISO_8601], true).toISOString().split(RegExp('T[0-9]'))[0];
            }
            break;
          case 'datetime':
            if (this.componentName === 'FormDatePicker') {
              newValue = moment(newValue, [getUserDateTimeFormat(), moment.ISO_8601], true).toISOString();
            }
            break;
          case 'array':
            break;
          default:
            newValue = newValue.toString();
            break;
        }
      }
      return newValue;
    },
    convertFromData(value) {
      return value;
    },
    getMask() {
      // Mask changed to ISO format for all the users
      return {
        date: ['####-##-##'],
        dateTime: ['####-##-## ##:##'],
      };
    },
    starStatus() {
      var validationObject = this.config.validation;
      if (validationObject && typeof validationObject === 'object' && Object.keys(validationObject).length > 0){
        Object.entries(validationObject).forEach(([key, value]) => {
          if (value.value == 'required') {
            this.star = true;
          }
        })
      }


    },
  },
  computed: {
    dataFormat() {
      return this.config.dataFormat;
    },
    customFormatter() {
      return this.config.customFormatter;
    },
    maxlength() {
      if (this.dataFormat === 'int' || this.dataFormat === 'float') {
        return 15;
      }
      return null;
    },
    componentConfig() {
      let config;
      if (this.customFormatter) {
        config = componentTypesConfigs['custom'];
      } else {
        config = componentTypesConfigs[this.dataFormat];
      }
      return Object.assign({}, (config ? this[config] : {}), this.$attrs);
    },
    getCurrencyFormat() {
      const format = this.dataMask && this.dataMask ? this.dataMask && this.dataMask.format : null;
      const separators = format ? format.match(/[.,]/g) : ['.', ','];
      if (separators.length === 0) separators.push('', '.');
      else if (separators.length === 1) separators.push(separators[0] === '.' ? ',' : '.');
      const presicion = format ? (format.split(separators[1])[1] || '').length : 2;
      return {
        decimal: separators[1],
        thousands: separators[0],
        prefix: this.dataMask && this.dataMask.symbol ? this.dataMask.symbol + ' ' : '',
        suffix: this.dataMask && this.dataMask.code ? ' ' + this.dataMask.code : '',
        precision: presicion,
        masked: false,
      };
    },
    getPercentageFormat() {
      return {
        decimal: '.',
        thousands: '',
        prefix: '',
        suffix: ' %',
        precision: 2,
        masked: false,
      };
    },
    getDateFormat() {
      return {
        masked: true,
        mask: this.getUserConfig().date_mask || this.getMask().date,
      };
    },
    getDatetimeFormat() {
      return {
        masked: true,
        mask: this.getUserConfig().datetime_mask || this.getMask().dateTime,
      };
    },
    componentType() {
      if (this.customFormatter) {
        return componentTypes['custom'];
      } else {
        return componentTypes[this.dataFormat] || 'input';
      }
    },
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass,
      };
    },
    dataType() {
      switch (this.dataFormat) {
        case 'int':
          return 'number';
        case 'float':
          return 'number';
        case 'email':
          return 'email';
        case 'password':
          return 'password';
        case 'object':
          return 'object';
        default:
          return 'text';
      }
    },
    getCustomFormatter() {
      return {
        masked: true,
        mask: this.customFormatter,
      };
    },
  },
  watch: {
    value(value) {
      if (this.dataType == 'object') {
        if (this.localValue !== value.value) {
          this.labele = (this.dataType == 'object') ? this.value.lable : this.label;
          this.localValue = value.value;
        }
      } else {
        if (this.localValue !== value) {
          this.localValue = value;
        }
      }
      // console.log(value,'value');

    },
    localValue(value) {
      if (this.dataType == 'object') {
        if (this.value == null) {
          this.$emit('input', {lable: "New Input", value: this.convertToData(value)});
          this.input_data = true
        } else {
          if (value != this.value.value) {
            //console.log(this.convertToData(value),'this.convertToData(value)')
            this.labele = (this.dataType == 'object') ? this.value.lable : this.label;
            this.$emit('input', {lable: this.value.lable, value: this.convertToData(value)});
            this.input_data = true
          }
        }
        /* console.log(this.value,'789')
         //console.log(this.value == null || value != this.value['value'],'this.value')
         if(value != this.value.value) {
             //console.log(this.convertToData(value),'this.convertToData(value)')
             this.$emit('input', {lable:this.value.lable,value:this.convertToData(value)});
         }*/
      } else {
        if (value != this.value) {
          this.$emit('input', this.convertToData(value));
          this.input_data = true
        }
      }
    },
  },
  data() {
    return {
      validator: null,
      labele: null,
      localValue: null,
      input_data: false,
      star: false,
      validationRules: {
        'percentage': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
      },
    };
  },
  mounted() {
    if (this.value !== undefined) {
      if (this.dataType == 'object' && this.value) {
        this.localValue = this.value.value;
      } else {
        this.localValue = this.value;
      }
    }
  },
  created() {
    this.labele = (this.dataType == 'object' && this.value) ? this.value.lable : this.label;
    this.starStatus();
  }
};
</script>
<style>
.icon-star-size {
  font-size: 8px !important;
  font-weight: 160 !important;
  color: #dc3545 !important;
}
</style>