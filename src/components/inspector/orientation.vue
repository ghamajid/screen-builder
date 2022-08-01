<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <label for="render-as">{{ $t('Show Control As') }}</label>
        <b-form-select id="render-as" v-model="orientation" :options="renderAsOptions" data-cy="inspector-render-as"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['options'],
  model: {
    prop: 'options',
    event: 'change',
  },
  data() {
    return {
      orientation: 'horizontal',
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

  updated() {
    this.orientation = this.options.orientation;
  },

};
</script>
