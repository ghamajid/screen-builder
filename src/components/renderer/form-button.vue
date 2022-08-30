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
        if (this.$attrs && typeof this.$attrs.validate !== 'undefined' && typeof window.submitPageNavigayionDefinition !== 'undefined') {

          let pageNumber = this.eventData - 1;
          this.validation = [];

          if (this.$attrs.validate.vdata !== undefined) {
            let totallData = this.$attrs.validate.vdata;
            let totallPageData = {};

            Object.keys(totallData).forEach(function (key, index) {
              if (key.indexOf('$') == -1) {
                totallPageData[key] = totallData[key];
              }
            });
            this.pageData = totallPageData
            if (this.pageData && typeof this.pageData === 'object' && Object.keys(this.pageData).length > 0) {

              this.errors_submit_if_valid = 0;
              let pageNum = (window.submitPageNavigayionDefinition.config.length == 1) ? 0 : pageNumber;
              console.log(8888888, window.submitPageNavigayionDefinition, this.$attrs.validate.vdata, pageNum)
              if (window.submitPageNavigayionDefinition && window.submitPageNavigayionDefinition.config[pageNum]) {
                this.fetchItems(window.submitPageNavigayionDefinition.config[pageNum]['items']);
              }

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
      for (const item of items) {
        if (item['config']['name']) {
          if (this.pageData[item['config']['name']]) {
            this.fetchLoops(this.pageData[item['config']['name']], item);
          }
        }

        if (typeof item['items'] !== 'undefined') {
          for (const nested_items of item['items']) {
            if (nested_items.length > 0 && Array.isArray(items)) {
              this.fetchItems(nested_items);
            }
          }
        }
      }
    },
    fetchLoops(loops, item) {
      let self = this;
      if (loops && loops.$each && typeof loops.$each === 'object') {
        let form_validation = [];
        let form_error = 0;
        Object.keys(loops.$each.$iter).map(function (key1) {

          Object.keys(loops.$each.$iter[key1]).forEach(function (key2, index2) {
            if (key2.indexOf('$') == -1) {
              if (item.items) {
                for (const loopItem of item.items) {

                  if (key2 == loopItem['config']['name']) {
                    if (loops.$each.$iter[key1][key2].$each !== 'undefined') {
                      self.fetchLoops(loops.$each.$iter[key1][key2], loopItem);
                    } else {
                      form_validation.push(!loops.$each.$iter[key1][key2].$invalid);
                      if (!loops.$each.$iter[key1][key2].$invalid == false) {
                        form_error++;
                      }
                    }
                  } else if (typeof loopItem['config']['name'] == 'undefined') {
                    if (loopItem.component === "FormMultiColumn") {
                      self.multiColumn(loopItem.items, key2, loops.$each.$iter[key1])

                    }
                  }

                }
              }

            }
          });

        });
        this.validation = this.validation.concat(form_validation);
        this.errors_submit_if_valid += form_error;
       
      } else {
        console.log(22222,item,item['config'])
        // if (item['config']['conditionalHide'] == undefined) {
          
          this.validation.push(!loops.$invalid);
          if (!loops.$invalid == false) {
            this.errors_submit_if_valid++;
          }
        /*}else{
          console.log(1111111,item)
        }*/
      }
    },
    multiColumn(columnItems, key2, loops) {
      let thic = this;
      for (let tableItems of columnItems) {
        for (let tableItem of tableItems) {
          if (tableItem['config']['name'] == key2) {
            thic.fetchColumn(loops, tableItem);

          } else if (tableItem['component'] === "FormMultiColumn") {
            thic.multiColumn(tableItem.items, key2, loops);
          }
        }
      }
    },
    fetchColumn(table_items, item) {

      if (item['config']['name']) {

        if (table_items[item['config']['name']]) {
          this.fetchLoops(table_items[item['config']['name']], item);
        }
      }
    },
  },
}
;
</script>

<style lang="scss">
</style>
