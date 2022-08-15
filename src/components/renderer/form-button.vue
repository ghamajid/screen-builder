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
        if (this.$attrs.validate){
          var validation = [];
          console.log('this.$attrs.validate 222',this.$attrs.validate)
          console.log(456)
          var params = this.$attrs.validate.vdata.$params;
          if (Object.keys(params).length > 0){
            Object.keys(params).forEach(m=>{
              validation.push(!this.$attrs.validate.vdata[m].$invalid);
            })
          }

          console.log('validation allAreTrue',validation.every(element => element === true))
          return validation.every(element => element === true);

        }
        return true;

      }else{
        if (this.$attrs.validate) {
          // console.log('form button : valid !this.$attrs.validate:',this.event,this.$attrs.validate,this.$attrs.validate.schema.$model,this.$attrs.validate.vdata)
          //this.$attrs.validate.vdata.$params
          // console.log('form button : valid !this.$attrs.validate.$invalid:',!this.$attrs.validate.$invalid)

          return !this.$attrs.validate.$invalid;
        }
        // console.log('form button : valid:','true')

        return true;
      }

    },
    message() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.errors = 0;
      if (!this.valid) {
        this.countErrors(this.$attrs.validate.vdata);
        this.countErrors(this.$attrs.validate.schema);
        let message = 'There are {{items}} validation errors in your form.';
        if (this.errors === 1) {
          message = 'There is a validation error in your form.';
        }
        return this.$t(message, {items: this.errors});
      }
      return '';
    },
  },
  data() {
  
    return {
      errors: 0,
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
