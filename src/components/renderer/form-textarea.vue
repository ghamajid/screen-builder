<template>
  <div class="form-group">
    <i v-if="star" class="fas fa-star text-danger m-2 icon-star-size"></i>
    <label v-uni-for="label" class="item-label-size">{{ label }}</label>

    <div v-if="richtext" :class="classList" v-uni-id="label">
      <div v-if="readonly" v-html="value"></div>
      <div v-else>
        <editor
            class="editor"
            v-if="!readonly && editorActive"
            v-bind="$attrs"
            :value="value"
            :init="editorSettings"
            :name="name"
            @input="$emit('input', $event)"
        />
      </div>
    </div>
    <textarea
        v-else
        v-bind="$attrs"
        :rows="rows"
        :readonly="readonly"
        v-uni-id="label"
        class="form-control"
        :class="classList"
        :name="name"
        :value="value"
        @input="$emit('input', $event.target.value)"
    />
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error"
                    :validator="validator"/>
    <small v-if='helper' class='form-text text-muted'>{{ helper }}</small>
  </div>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'
import DataFormatMixin from './mixins/DataFormat';
import DisplayErrors from './common/DisplayErrors';
import Editor from './Editor'
import _ from 'lodash'

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    DisplayErrors,
    Editor
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],

  props: [
    'label',
    'error',
    'name',
    'value',
    'helper',
    'controlClass',
    'richtext',
    'readonly',
    'rows'
  ],
  computed: {
    classList() {

      this.starStatus();
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || (this.error && this.input_text),
        [this.controlClass]: !!this.controlClass,
        'richtext': this.richtext && !this.readonly,
      };
    },
    height() {
      if (!this.rows) {
        return false;
      }
      return String(parseInt(this.rows) * 55) + 'px';
    }
  },
  watch: {
    rows: {
      handler() {
        this.setHeight();
      },
      immediate: true,
    },
    name() {
      this.rebootEditor();
    },
    value(val) {
      this.input_text = true
    }
  },
  created() {
    this.rebootEditor = _.throttle(() => {
      this.editorActive = false;
      this.$nextTick(() => {
        this.editorActive = true
      });
    }, 500);

  },
  methods: {
    setHeight() {
      if (!this.editorInstance) {
        return;
      }
      if (!this.rows) {
        return;
      }
      if (this.editorInstance.getContainer() && this.editorInstance.getContainer().style) {
        this.editorInstance.getContainer().style.height = this.height;
      }
    },
    starStatus() {
      if (this.error == 'Field is required' || this.error == 'فیلد الزامی است') {
        this.star = true;
      }
    },
  },
  data() {
    return {
      editorSettings: {
        inline: false,
        statusbar: false,
        content_style: 'body { font-family: Arial; } .pagebreak { border: 1px solid #ccc; }',
        menubar: false,
        plugins: ['link', 'lists', 'image'],
        toolbar: 'undo redo | link image pagebreak | styleselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        skin: false,
        content_css: false,
        relative_urls: false,
        remove_script_host: false,
        init_instance_callback: (editor) => {
          this.editorInstance = editor;
          this.setHeight();
        },
        setup: (editor) => {
          editor.ui.registry.addButton('pagebreak', {
            tooltip: this.$t('Insert Page Break For PDF'),
            icon: 'page-break',
            onAction: function (_) {
              editor.insertContent("<hr class='pagebreak' style='page-break-after: always;' />");
            }
          });
        },
      },
      editorInstance: null,
      editorActive: true,
      input_text: false,
      star: false,
    }
  }
}
</script>

<style lang="scss">
.form-group .richtext {
  height: auto;

  :focus {
    outline: 0 !important;
  }

  .editor {
    border: 1px solid #ccc;
    border-top: 0;
  }
}

.icon-star-size {
  font-size: 8px !important;
  font-weight: 160 !important;
  color: #dc3545 !important;
}
i.icon-star-size + label {
  margin-left: 0px;
  margin-right: 0px;
}
</style>

