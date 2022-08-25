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
import {log} from "@panter/vue-i18next/src/utils";

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
        console.log(1)
        if (this.$attrs && typeof this.$attrs.validate !== 'undefined' && typeof window.submitPageNavigayionDefinition !== 'undefined') {
          console.log(2)

          let pageNumber = this.eventData - 1;
          this.validation = [];

          if (this.$attrs.validate.vdata !== undefined) {
            let totallData = this.$attrs.validate.vdata;
            let totallPageData = {};
            console.log(3)

            Object.keys(totallData).forEach(function (key, index) {
              if (key.indexOf('$') == -1) {
                totallPageData[key] = totallData[key];
              }
            });
            this.pageData = totallPageData

            console.log(4,this.pageData)

            if (Object.keys(this.pageData).length > 0 && Object.keys(this.pageData).length > 0){
              this.errors_submit_if_valid = 0;
              let pageNum = (window.submitPageNavigayionDefinition.config.length == 1) ? 0 : pageNumber;
              console.log(5)

              this.fetchItems(window.submitPageNavigayionDefinition.config[pageNum]['items']);
              console.log('validation 111', this.validation);

              return this.validation.every(element => element === true);
            }
          }


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
      let config_name = [];
      console.log(123456789)
      for (const item of items) {

        // if (Array.isArray(item)) {
        if (item['config']['name']) {
          config_name.push(item['config']['name']);

          if (this.pageData[item['config']['name']]) {
            console.log(5555,'pageData config name',item['config']['name'],this.pageData[item['config']['name']])

            if (this.pageData[item['config']['name']].$each) {
              console.log(9999999999999,item['config']['name'])
              let form_validation = [];
              let form_error = 0;
              let page_data = this.pageData;

              Object.keys(this.pageData[item['config']['name']].$each.$iter).map(function(key1) {
                console.log(11,'key1',key1)

                  console.log(22,'config_name',item['config']['name'],page_data[item['config']['name']].$each.$iter[key1])
                Object.keys(page_data[item['config']['name']].$each.$iter[key1]).forEach(function (key2, index2) {
                  if (key2.indexOf('$') == -1) {
                    console.log(34,key2,page_data[item['config']['name']].$each.$iter[key1][key2])
                    form_validation.push(!page_data[item['config']['name']].$each.$iter[key1][key2].$invalid);
                      if (!page_data[item['config']['name']].$each.$iter[key1][key2].$invalid == false) {
                        form_error++;
                      }
                  }
                });
                  // if (page_data[item['config']['name']].$each.$iter[key1][item['config']['name']] ){
                  //   console.log(33,'config_name',item['config']['name'])
                  //
                  //   form_validation.push(!page_data[item['config']['name']].$each.$iter[key1][item['config']['name']].$invalid);
                  //   if (!page_data[item['config']['name']].$each.$iter[key1][item['config']['name']].$invalid == false) {
                  //     form_error++;
                  //   }
                  // }
              });

              this.validation = this.validation.concat(form_validation);
              this.errors_submit_if_valid += form_error;

            } else {
              console.log(88888888888888)

              this.validation.push(!this.pageData[item['config']['name']].$invalid);
              if (!this.pageData[item['config']['name']].$invalid == false) {
                this.errors_submit_if_valid++;
              }

            }
          }
        }

        console.log('item[items]', item['items'])
        if (typeof item['items'] !== 'undefined') {
          console.log(77777777777)

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

      // console.log(999999999999,'config_name',config_name)
      // console.log(999999999999,'this.pageData',this.pageData)
      //
      // let page_data = this.pageData;
      // let form_validation = [];
      // let form_error = 0;
      // console.log('this.pageData',this.pageData)
      // Object.keys(page_data).map(function(objectKey, index) {
      //   var value = page_data[objectKey];
      //   if (value.$each){
      //     console.log(3333,'$each',value.$each.$iter)
      //     Object.keys(value.$each.$iter).map(function(key1) {
      //       console.log(3333,'key1',key1)
      //
      //       for (const name of config_name) {
      //         console.log(3333,'config_name',name)
      //
      //         if (value.$each.$iter[key1][name] ){
      //           console.log(3333,'value.$each.$iter[key1][name]',value.$each.$iter[key1][name])
      //
      //           form_validation.push(!value.$each.$iter[key1][name].$invalid);
      //           if (!value.$each.$iter[key1][name].$invalid == false) {
      //             form_error++;
      //           }
      //         }
      //       }
      //     });
      //   }
      // });
      // console.log(4444,form_validation,form_error)
      // this.validation = this.validation.concat(form_validation);
      // this.errors_submit_if_valid += form_error;

      console.log(1111,this.validation)
      console.log(2222,this.errors_submit_if_valid)

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
