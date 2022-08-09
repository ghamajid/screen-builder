<template>
  <div>
    <Stepper
        :value="value"
        :items="items_val"
        :orientation="orientation_val"
        @change="handleChange"
        class="k-rtl"
    />
  </div>
</template>

<script lang="ts">
import {
  Stepper
} from '@progress/kendo-vue-layout';

export default {
  components: {
    Stepper
  },
  props: [
    'config',
    'transientData',
    'name',
    'options',
    'event'
  ],

  data() {
    return {
      value: 0,
      items: [
        {
          icon: "k-i-lock",
          label: "تایید قوانین",
        },
        {
          icon: "k-i-user",
          label: "اطلاعات هویتی",
        },
        {
          icon: "k-i-note",
          label: "اطلاعات درخواست",
        },
        {
          icon: "k-i-track-changes",
          label: "تایید نهایی",
        },
      ]
    }
  },
  methods: {
    handleChange(e) {
      // this.orientation = e.target.value;

      this.$emit('page-navigate', e.value);
    }
  },
  watch: {
    transientData: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (this.transientData && this.transientData[this.name] && this.value != this.transientData[this.name]) {
          var lastItemIndex = this.items.length - 1
          this.value = this.transientData[this.name]
          if (this.transientData[this.name] < 0) {
            this.value = 0
          } else if (this.transientData[this.name] > lastItemIndex) {
            this.value = lastItemIndex
          }
          this.$emit('input', this.value);
        }
      },
    },
    options: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (this.config && this.config.orientation){
          this.options.orientation = this.config.orientation.orientation;
        }
      },
    }
  },
  computed:{
    orientation_val(){
      var orientation = this.options.orientation;
      if(this.config){
        orientation = (this.config.orientation && this.options.orientation !== null) ? this.config.orientation: this.options.orientation;
      }
      return orientation;
    },
    items_val(){
      var _items = this.items;
      if (this.config ){
        _items = this.config.steps.optionsList;
      }
      return _items;
    }
  }
};
</script>
