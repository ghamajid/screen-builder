<template>
  <div>
    <Stepper
        :value="value"
        :items="items_val"
        :orientation="orientation"
        class="k-rtl"
    />
    <!--        @change="handleChange"-->

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
    'event',
    'orientation',
    'steps',
    'selectedControl'
  ],

  data() {
    console.log('timeline',this.config,this.transientData,this.name,this.event,this.orientation,this.selectedControl)
    return {
      value: 0,
      items: [
        // {
        //   icon: "k-i-lock",
        //   label: "تایید قوانین",
        // },
        // {
        //   icon: "k-i-user",
        //   label: "اطلاعات هویتی",
        // },
        // {
        //   icon: "k-i-note",
        //   label: "اطلاعات درخواست",
        // },
        // {
        //   icon: "k-i-track-changes",
        //   label: "تایید نهایی",
        // },
      ]
    }
  },
  methods: {
    // handleChange(e) {
    //   // this.$emit('input', e.value);
    //   // this.$emit('page-navigate', e.value);
    // }
  },
  watch: {
    transientData: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (this.transientData && this.transientData[this.name] >= 0) {
          console.log('this.steps 1111',this.steps)
          if (this.steps && this.steps.optionsList && this.steps.optionsList.length > 0) {
            var lastItemIndex = this.steps.optionsList.length - 1
            this.value = this.transientData[this.name]
            if (this.transientData[this.name] < 0) {
              this.value = 0
            } else if (this.transientData[this.name] >= lastItemIndex) {
              this.value = lastItemIndex
            }
            this.$emit('input', this.value);
          }
        }
      },
    },
  },
  computed: {
    items_val() {
      var _items = this.items;
      console.log('this.steps 2222',this.steps)

      if (this.steps && this.steps.optionsList && this.steps.optionsList.length > 0) {
        _items = this.steps.optionsList;
      }
      return _items;
    }
  }
};
</script>
