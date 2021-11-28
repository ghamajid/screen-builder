<template>
  <div class="form-group"  style="overflow-x: hidden">
    <div class="alert alert-danger" v-if="!valid">
      <i class="fas fa-exclamation-circle"/>
      {{ message }}
    </div>
    <button v-b-tooltip="options" @click="showModal = true" :class="classList" :name="name" :aria-label="$attrs['aria-label']" :tabindex="$attrs['tabindex']">
      {{ label }}
    </button>
    <script type="text/x-template" id="modal-template">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper row">
            <div class="modal-container container mt-4 col-5" style="background-color: #fff">

              <div class="modal-header">
                <slot name="header"></slot>
              </div>

              <div class="modal-body col-12">
                <slot name="body"></slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <button class="modal-default-button btn btn-success" @click="$emit('close')">
                    {{ $t('I Understood') }}
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </script>
    <div id="app">
      <modal v-if="showModal" @close="showModal = false">
        <div slot="header">
          <h3>
            {{ $t('Help') }}
          </h3>
        </div>
        <div slot="body" style="overflow-y: auto" >
          <div style="height: 400px" class="col-12" v-if="showModal === true" v-html="help_editor.editorContents"></div>
        </div>
      </modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Mustache from 'mustache';
Vue.component("modal", {
  template: "#modal-template"
});
new Vue({
  el: "#app",
});
export default {
  inheritAttrs: false,
  props: ['variant', 'label', 'event', 'eventData', 'name', 'fieldValue', 'value', 'tooltip', 'transientData', 'help_editor'],
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

      let content = '';
      try {
        content = Mustache.render(this.tooltip.content || '', this.transientData);
      } catch (error) { error; }

      return {
        title: content,
        html: true,
        placement: this.tooltip.position || '',
        trigger: 'hover',
        boundary: 'window',
      };
    },
    valid() {
      if (this.$attrs.validate) {
        return !this.$attrs.validate.$invalid;
      }
      return true;
    },
    message() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.errors = 0;
      if (this.$attrs.validate && this.$attrs.validate.$invalid) {
        this.countErrors(this.$attrs.validate);
        let message = 'There are {{items}} validation errors in your form.';
        if (this.errors === 1) {
          message = 'There is a validation error in your form.';
        }
        return this.$t(message, {items: this.errors});
      }
      return '';
    },
  },
  data() {
    return {
      errors: 0,
      showModal: false,
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

  },
}
</script>

<style scoped>

.modal-mask {
  overflow-y: initial !important;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  padding: 50px 30px;
  background-color: #fff !important;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
