<template>
  <div>
    <Stepper
        :value="value"
        :items="items"
        :orientation="orientation"
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
    'options'
  ],

  data() {
    var orientation = 'horizontal';
    if (this.options && this.options.renderAs) {
      orientation = this.options.renderAs
    }
    return {
      value: 0,
      orientation: orientation,
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
      this.value = e.value;
      console.log('form-timeline',this.value,this.event,this.options)
      this.$emit(this.event, this.options);
      if (this.event === 'pageNavigate') {
        this.$emit('page-navigate', this.options);
      }

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
          //console.log(this.value, 'das')
          this.$emit('input', this.value);
        }
      },
    },
  },
};
</script>
