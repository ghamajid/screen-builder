<template>
  <div>
    <p>Change the orientation:</p>
    <DropDownList
        :style="{ width: '220px' }"
        :data-items="['horizontal', 'vertical']"
        :value="orientation"
        @change="handleOrientationChange"
    />
    <hr/>
    <Stepper
        :value="value"
        @change="handleChange"
        :items="items"
        :orientation="orientation"
    />
  </div>
</template>

<script lang="ts">
import {DropDownList} from '@progress/kendo-vue-dropdowns';
import {
  Stepper
} from '@progress/kendo-vue-layout';

export default {
  components: {
    Stepper,
    DropDownList
  },
  props: [
    'config',
    'transientData',
      'name'
  ],
  data() {
    var name_val = 0;
    if(this.transientData && this.transientData[this.name]) {
      name_val = this.transientData[this.name]

    }
    return {
      value: name_val,
      orientation: 'horizontal',
      items: [
        {
          icon: "k-i-lock",
          label: "Account Info",
        },
        {
          icon: "k-i-user",
          label: "Personal Info",
        },
        {
          icon: "k-i-myspace",
          label: "Membership",
        },
        {
          icon: "k-i-track-changes",
          label: "Verification",
        },
      ]
    }
  },
  methods: {
    handleChange(e) {
      // this.value = e.value;
    },
    handleOrientationChange(e) {
      this.orientation = e.target.value;
    }
  }
};
</script>