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

          console.log(this.eventData, 'this.eventData');
          let pageNumber = this.eventData - 1;
          console.log(pageNumber, 'pageNumber');
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

            // console.log(4, this.pageData, Object.keys(this.pageData).length)

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
      let config_name = [];
      console.log(123121312, items)
      for (const item of items) {
        // console.log(333, 'item', item['config']['name'])

        if (item['config']['name']) {
          config_name.push(item['config']['name']);

          if (this.pageData[item['config']['name']]) {
            // console.log(555, 'item[config][name]', item['config']['name'], this.pageData[item['config']['name']])
            console.log('iiii')

            this.fetchLoops(this.pageData[item['config']['name']], item);
          }
        }

        if (typeof item['items'] !== 'undefined') {

          for (const nested_items of item['items']) {
            if (nested_items.length > 0 && Array.isArray(items)) {
              // console.log(444)
              this.fetchItems(nested_items);

            }
          }

        }
      }
    },
    fetchLoops(loops, item) {
      let self = this;
      // console.log('loops,item',loops,item)
      if (loops && loops.$each && typeof loops.$each === 'object') {
        let form_validation = [];
        let form_error = 0;
        console.log('loops', loops, item)
        Object.keys(loops.$each.$iter).map(function (key1) {

          Object.keys(loops.$each.$iter[key1]).forEach(function (key2, index2) {
            if (key2.indexOf('$') == -1) {
              if (item.items) {

                for (const loopItem of item.items) {
                  console.log(4444, key2, loopItem['config']['name'], typeof loopItem['config']['name'], loopItem)

                  if (key2 == loopItem['config']['name']) {
                    // console.log(5555,key2,loops.$each.$iter[key1],loopItem)
                    if (loops.$each.$iter[key1][key2].$each !== 'undefined') {
                      // console.log(111)
                      self.fetchLoops(loops.$each.$iter[key1][key2], loopItem);
                    } else {
                      // console.log(222)

                      form_validation.push(!loops.$each.$iter[key1][key2].$invalid);
                      if (!loops.$each.$iter[key1][key2].$invalid == false) {
                        form_error++;
                      }
                    }
                  } else if (typeof loopItem['config']['name'] == 'undefined') {
                    if (loopItem.component === "FormMultiColumn") {
                      console.log(7777777, loopItem, loopItem.items, key2, loops.$each.$iter[key1])
                      self.multiColumn(loopItem.items,key2,loops.$each.$iter[key1])

                    }
                  }

                }
              }

            }
          });

        });
        this.validation = this.validation.concat(form_validation);
        this.errors_submit_if_valid += form_error;
        console.log(666, 'this.validation', this.validation)
        console.log(666, 'this.errors_submit_if_valid', this.errors_submit_if_valid)


      } else {

        this.validation.push(!loops.$invalid);
        if (!loops.$invalid == false) {
          this.errors_submit_if_valid++;
        }
        // console.log(777,'this.validation', this.validation,loops.$invalid,item['config']['name'])
        // console.log(777, 'this.errors_submit_if_valid', this.errors_submit_if_valid)

      }
    },
    multiColumn(columnItems,key2,loops){
      console.log('multiColumn',columnItems,key2,loops)
      let thic = this;
      for (let tableItems of columnItems) {
        for (let tableItem of tableItems) {
          // console.log(1212,tableItem['config']['name'] ,tableItem['component'],key2)
          if (tableItem['config']['name'] == key2) {
            // console.log('tableItem', tableItem, key2)
            thic.fetchColumn(loops, tableItem);
            // console.log(1313)

          }else if(tableItem['component'] === "FormMultiColumn" ){
            console.log(9999,'tableItem',tableItem,key2)
            thic.multiColumn(tableItem.items,key2,loops);
          }

          //   if (tableItem['config']['name'] == undefined && !form_items.includes(tableItem['config']['name'])){
          //   console.log(558585858,tableItem)
          // }
        }
      }
    },
    fetchColumn(table_items, item) {
      console.log(987987987, table_items, item)
      // let column_items = [];
      // console.log(333, 'item', item, item['config']['name'])

      if (item['config']['name']) {
        // column_items.push(item['config']['name']);

        if (table_items[item['config']['name']]) {
          // console.log(555, 'item[config][name]', item['config']['name'], table_items[item['config']['name']])
          console.log('cccc', table_items[item['config']['name']], item['config']['name'])
          this.fetchLoops(table_items[item['config']['name']], item);
          // this.validation.push(!table_items[item['config']['name']].$invalid);
          // if (!table_items[item['config']['name']].$invalid == false) {
          //   this.errors_submit_if_valid++;
          // }
        } else {
          console.log('00000', item['config']['name'])
        }
      }
      //
      // if (typeof item['items'] !== 'undefined'  && column_items.includes(item['config']['name']) === false) {
      //
      //   for (const nested_items of item['items']) {
      //     if (nested_items.length > 0 && Array.isArray(items)) {
      //       console.log(444)
      //       this.fetchItems(nested_items);
      //
      //     }
      //   }
      //
      // }
    },
  },
}
;
</script>

<style lang="scss">
</style>
