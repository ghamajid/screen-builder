<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <label for="render-as">{{ $t('Show Control As') }}</label>
        <b-form-select id="render-as" v-model="new_orientation" :options="renderAsOptions"
                       data-cy="inspector-render-as"/>
      </div>

    </div>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>

export default {
  props: ['orientation','helper'],
  model: {
    prop: 'orientation',
    event: 'change',
  },
  data() {
    return {
      new_orientation: this.orientation,
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
