<template>
  <b-container fluid>
    <component ref="component" :is="component" :vdata="value" />
  </b-container>
</template>

<script>
import Json2Vue from '../mixins/Json2VuePrint';
import CurrentPageProperty from '../mixins/CurrentPageProperty';
import ScreenRendererError from '../components/renderer/screen-renderer-error';
import { cloneDeep, isEqual } from 'lodash';

export default {
  name: 'screen-renderer-print',
  components: { ScreenRendererError },
  mixins: [ Json2Vue, CurrentPageProperty ],
  data() {
    return {
      currentDefinition: null,
      codigo: '',
      self: this,
      displayAsyncLoading: false,
    };
  },
  mounted() {
    this.currentDefinition = cloneDeep(this.definition);
    console.log(this.currentDefinition,'definition123');
    this.component = this.buildComponent(this.currentDefinition);
    console.log(this.component,'this.component_1');
  },
  watch: {
    definition: {
      deep: true,
      handler(definition) {
        if (!isEqual(definition, this.currentDefinition)) {
            this.currentDefinition = cloneDeep(definition);
            this.component = this.buildComponent(this.currentDefinition);
            console.log(this.component,'this.component_2');
        }
      },
    },
  },
  methods: {
    onAsyncWatcherOn() {
      this.displayAsyncLoading = typeof this._parent === 'undefined';
    },
    onAsyncWatcherOff() {
      this.displayAsyncLoading = false;
    },
    getCurrentPage() {
      return this.$refs.component.getCurrentPage();
    },
    setCurrentPage(page) {
        if(this.$refs.component){
            this.$refs.component.setCurrentPage(page);
        }
    },
  },
};
</script>

<style>
.form-group--error {
  animation: none;
}
@keyframes shakeError {
  0% {
    transform: translateX(0); }
  15% {
    transform: translateX(0.375rem); }
  30% {
    transform: translateX(-0.375rem); }
  45% {
    transform: translateX(0.375rem); }
  60% {
    transform: translateX(-0.375rem); }
  75% {
    transform: translateX(0.375rem); }
  90% {
    transform: translateX(-0.375rem); }
  100% {
    transform: none;
  }
}
</style>
