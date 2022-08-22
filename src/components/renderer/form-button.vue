<template>
  <div class="form-group"  style="overflow-x: hidden">
    <div class="alert alert-danger" v-if="!valid">
      <i class="fas fa-exclamation-circle"/>
      {{ message }}
    </div>
    <button v-b-tooltip="options" @click="click" :class="classList" :name="name" :aria-label="$attrs['aria-label']" :tabindex="$attrs['tabindex']">
      {{ label }}
    </button>
  </div>
</template>

<script>
import Mustache from 'mustache';
import { getValidPath } from '@/mixins';

export default {
  mixins: [getValidPath],
  props: ['variant', 'label', 'event', 'eventData', 'name', 'fieldValue', 'value', 'tooltip', 'transientData'],
  computed: {
    classList() {
      let variant = this.variant || 'primary';
      return {
        btn: true,
        ['btn-' + variant]: true,
        disabled: !this.valid,
      };
    },
    options() {
      if (!this.tooltip || this.event === 'submit') {
        return {};
      }
      if (!this.tooltip || this.event === 'submit_grid') {
          return {};
      }
      // if (!this.tooltip || this.event === 'submit_if_valid') {
      //     return {};
      // }
      let content = '';
      try {
        content = Mustache.render(this.tooltip.content || '', this.transientData);
      } catch (error) { error; }

      return {
        title: content,
        html: true,
        placement: this.tooltip.position || '',
        trigger: 'hover',
        variant: this.tooltip.variant || '',
        boundary: 'window',
      };
    },
    valid() {
      if (this.event == 'submit_if_valid'){
        console.log('window 1111',window);

        if (this.$attrs.validate && window.submitPageNavigayionDefinition && Object.keys(window.submitPageNavigayionDefinition).length > 0 && window.submitPageNavigayionDefinition.config.length > 0) {
          let pageNumber = this.eventData - 1;
          let validation = [];
          let pageData = this.$attrs.validate.vdata;
          this.errors_submit_if_valid = 0;
          console.log('window.config',window.submitPageNavigayionDefinition.config,pageNumber);

          for (const item of window.submitPageNavigayionDefinition.config[pageNumber]['items']){
            if (item['config']['name']){
              if (pageData[item['config']['name']]){
                validation.push(!this.$attrs.validate.vdata[item['config']['name']].$invalid);
                if (!this.$attrs.validate.vdata[item['config']['name']].$invalid == false){
                  this.errors_submit_if_valid++;

                }
              }
            }
          }
          return validation.every(element => element === true);
        }
        return true;

      }else{
        if (this.$attrs.validate) {
          return !this.$attrs.validate.$invalid;
        }
        return true;
      }

    },
    message() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.errors = 0;
      if (!this.valid) {
        if (this.event == 'submit_if_valid'){
          this.errors = this.errors_submit_if_valid;
          let message = 'There are {{items}} validation errors in your form.';
          if (this.errors === 1) {
            message = 'There is a validation error in your form.';
          }
          return this.$t(message, {items: this.errors});
        }else{
          this.countErrors(this.$attrs.validate.vdata);
          this.countErrors(this.$attrs.validate.schema);
          let message = 'There are {{items}} validation errors in your form.';
          if (this.errors === 1) {
            message = 'There is a validation error in your form.';
          }
          return this.$t(message, {items: this.errors});
        }

      }
      return '';
    },
  },
  data() {
  
    return {
      errors: 0,
      errors_submit_if_valid: 0
    };
  },
  methods: {
    countErrors(obj) {
      if (typeof obj !== 'object') {
        return;
      }
      Object.entries(obj).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object' && '$each' in value) {
            this.countErrors(value.$each);
            return;
          }
          if (typeof value === 'object' && '$invalid' in value && value.$invalid && isNaN(key)) {
            this.errors++;
          }
          if (key !== '$iter' && value) {
            this.countErrors(value);
          }
        }
      });
    },
    setValue(parent, name, value) {
      if (parent) {
        if (parent.items) {
          this.setValue(parent.$parent, name, value);
        } else {
          this.setValue(parent.data, this.getValidPath(name), value);
        }
      }
    },
    click() {
      if (this.event === 'script') {
        const trueValue = this.fieldValue || '1';
        const value = (this.value == trueValue) ? null : trueValue;
        this.$emit('input', value);
      }
      if (this.event !== 'pageNavigate' && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      if (this.event === 'submit') {
        this.$emit('input', this.fieldValue);
        this.$nextTick(()=>{
          this.$emit('submit', this.eventData);
        });
        return;
      }
      if (this.event === 'script_grid') {
          const trueValue = this.fieldValue || '1';
          const value = (this.value == trueValue) ? null : trueValue;
          if(this.valid){
              this.$emit('input', value);
          }
      }
      if (this.event === 'submit_grid') {
          this.$emit('input', this.fieldValue);
          this.$nextTick(()=>{
              this.$emit('submit', this.eventData);
          });
          return;
      }
      if (this.event === 'submit_if_valid') {

        if(this.valid){
          this.$emit('page-navigate', this.eventData);

        }
      }
      this.$emit(this.event, this.eventData);
      if (this.event === 'pageNavigate') {
        this.$emit('page-navigate', this.eventData);
      }
    },
  },
};
</script>

<style lang="scss">
</style>
