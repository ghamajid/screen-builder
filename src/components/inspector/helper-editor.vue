<template>
<div>
  <p>{{label}}</p>
  <vue-editor v-model="editorContents" :editor-toolbar="customToolbar" @input="dataChange"></vue-editor>
</div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  inheritAttrs: false,
  components: {
    VueEditor,
  },
  data() {
    return {
      editorContents: "",
      customToolbar: [
        [{header: [false, 1, 2, 3, 4, 5, 6]}],
        ["bold", "italic", "underline", "strike"],
        [{align: ""}, {align: "center"}, {align: "right"}, {align: "justify"}],
        [{color: []}, {background: []}],
        [{list: "ordered"}, {list: "bullet"}, {list: "check"}],
        [{indent: "-1"}, {indent: "+1"}],
        ["image"],
      ]
    }
  },
  watch: {
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
  },
  methods:{
    dataChange(){
      this.$emit('input', this.dataObjectOptions);
    },
  },
  props:[
      'label',
  ],
  computed:{
    dataObjectOptions() {
      return {
        editorContents: this.editorContents,
      };
    },
  },
};
</script>

<style>
.modal-body img{
  width: 100% !important;
}
</style>
