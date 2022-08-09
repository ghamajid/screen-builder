<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <label for="render-as">{{ $t('Show Control As') }}</label>
        <b-form-select id="render-as" v-model="new_orientation" :options="renderAsOptions"
                       data-cy="inspector-render-as"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['orientation', 'selectedControl'],
  model: {
    prop: 'orientation',
    event: 'change',
  },
  data() {
    return {
      new_orientation: this.selectedControl.config.options.orientation,
      renderAsOptions: [
        {
          text: this.$t('Horizontal'),
          value: 'horizontal',
        },
        {
          text: this.$t('Vertical'),
          value: 'vertical',
        },
      ],
    };
  },
  watch: {
    new_orientation(val) {
      this.$emit('change', val);
    }
  },
};
</script>
