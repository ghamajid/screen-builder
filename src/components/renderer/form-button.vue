<template>
  <div class="form-group" style="overflow-x: hidden">
    <div class="alert alert-danger" v-if="!valid">
      <i class="fas fa-exclamation-circle"/>
      {{ message }}
    </div>
    <button v-b-tooltip="options" @click="click" :class="classList" :name="name" :aria-label="$attrs['aria-label']"
            :tabindex="$attrs['tabindex']">
      {{ label }}
    </button>
  </div>
</template>

<script>
import Mustache from 'mustache';
import {getValidPath} from '@/mixins';

export default {
  mixins: [getValidPath],
  props: ['variant', 'label', 'event', 'eventData', 'name', 'fieldValue', 'value', 'tooltip', 'transientData'],
  watch: {
    '$attrs.validate': {
      deep: true,
      handler(validate) {
        console.log('$attrs.validate 123 ', validate);
      },
    },
  },
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
      } catch (error) {
        error;
      }

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
      if (this.event == 'submit_if_valid') {
        console.log('window 555555', window);

        if (this.$attrs.validate && window.submitPageNavigayionDefinition && Object.keys(window.submitPageNavigayionDefinition).length > 0 && window.submitPageNavigayionDefinition.config.length > 0) {
          let pageNumber = this.eventData - 1;
          this.validation = [];
          this.pageData = this.$attrs.validate.vdata;
          var object = this.$attrs.validate;
          var result = JSON.parse(JSON.stringify(object))
          console.log('result',result,result.vdata);

          console.log('this.pageData 456', this.pageData)
          console.log('this.$attrs.validate 456', this.$attrs.validate,this.$attrs.validate.vdata,this.$attrs.validate['vdata'])
          this.errors_submit_if_valid = 0;
          console.log('window.config', window.submitPageNavigayionDefinition.config, pageNumber);

          let pageNum = (window.submitPageNavigayionDefinition.config.length == 1) ? 0 : pageNumber;
          this.fetchItems(window.submitPageNavigayionDefinition.config[pageNum]['items']);
          console.log('validation 111', this.validation);

          return this.validation.every(element => element === true);
        }
        return true;

      } else {
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
        if (this.event == 'submit_if_valid') {
          this.errors = this.errors_submit_if_valid;
          let message = 'There are {{items}} validation errors in your form.';
          if (this.errors === 1) {
            message = 'There is a validation error in your form.';
          }
          return this.$t(message, {items: this.errors});
        } else {
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
      errors_submit_if_valid: 0,
      pageData: {},
      validation: [],
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
        this.$nextTick(() => {
          this.$emit('submit', this.eventData);
        });
        return;
      }
      if (this.event === 'script_grid') {
        const trueValue = this.fieldValue || '1';
        const value = (this.value == trueValue) ? null : trueValue;
        if (this.valid) {
          this.$emit('input', value);
        }
      }
      if (this.event === 'submit_grid') {
        this.$emit('input', this.fieldValue);
        this.$nextTick(() => {
          this.$emit('submit', this.eventData);
        });
        return;
      }
      if (this.event === 'submit_if_valid') {

        if (this.valid) {
          this.$emit('page-navigate', this.eventData);

        }
      }
      this.$emit(this.event, this.eventData);
      if (this.event === 'pageNavigate') {
        this.$emit('page-navigate', this.eventData);
      }
    },
    fetchItems(items) {
      console.log('Array.isArray(items)', Array.isArray(items))

      for (const item of items) {
        console.log('item', item)
        console.log('item component', item['component'])
        if (item['component'] == "FormLoop"){
          console.log('item settings times', item['config']['settings']['times'])
          console.log('item items', item['items'])

        }
        // if (Array.isArray(item)) {
        if (item['config']['name']) {
          console.log('item[config][name]', item['config']['name'])
          console.log('this.pageData', this.pageData)

          console.log('!this.$attrs.validate 7890', this.$attrs.validate)
          console.log('!this.$attrs.validate 258963', this.$attrs.validate.vdata[item['config']['name']])
          console.log('!this.$attrs.validate 96321478', this.$attrs.validate['vdata'][item['config']['name']])
          if (this.pageData[item['config']['name']]) {
            console.log('this.pageData[item[config][name]] 147', this.pageData[item['config']['name']])

            if (this.$attrs.validate.vdata[item['config']['name']].$each) {
              console.log('9999999999999')
              console.log('this.pageData[item[config][name]]', this.$attrs.validate.vdata[item['config']['name']])
              console.log('this.pageData[item[config][name]].$each', this.$attrs.validate.vdata[item['config']['name']].$each)
              console.log('this.pageData[item[config][name]].$each.$iter', this.$attrs.validate.vdata[item['config']['name']].$each.$iter)
              this.fetchLoopItems(this.pageData[item['config']['name']].$each.$iter);

            } else {
              console.log('88888888888888')

              this.validation.push(!this.$attrs.validate.vdata[item['config']['name']].$invalid);
              if (!this.$attrs.validate.vdata[item['config']['name']].$invalid == false) {
                this.errors_submit_if_valid++;
              }

            }
          }
        }

        console.log('item[items]', item['items'])
        if (typeof item['items'] !== 'undefined') {
          console.log('77777777777')

          for (const nested_items of item['items']) {
            console.log('nested_items', nested_items)
            if (nested_items.length > 0 && Array.isArray(items)) {
              console.log('nested_items.length', nested_items.length)

              this.fetchItems(nested_items);

            }
          }
          // }

        }
      }
    },
    fetchLoopItems(loopItems) {
      console.log('loopItems', loopItems)
    }
  }
  ,
}
;
</script>

<style lang="scss">
</style>
