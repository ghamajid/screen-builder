<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <v-jstree
      :data="data"
      @item-click="itemClick"
      whole-row
      :show-checkbox="(options_jstree) ? options_jstree.showCheckbox : false"
      :collapse="(options_jstree) ? options_jstree.collapse : false"
      :multiple="(options_jstree) ? options_jstree.multiple : false"
      :allow-batch="(options_jstree) ? options_jstree.allowBatch : false"
      :text-field-name="(options_jstree) ? options_jstree.textField : ''"
      :value-field-name="(options_jstree) ? options_jstree.valueField : ''"
      :children-field-name="(options_jstree && options_jstree.childrenField) ? options_jstree.childrenField : 'children' "
    />
  </div>
</template>
<script>
import VJstree from 'vue-jstree';
export default {
  inheritAttrs: false,
  components: {
    VJstree,
  },
  props: [
    'transientData',
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'placeholder',
    'dataFormat',
    'thcolor',
    'fields',
    'options_jstree',
  ],
  data() {
    return {
      clickTree:[],
      info: [],
      lastRequest: {},
      data: [],
      dataUrl:'',
    };
  },
  watch: {
    options_jstree: {
      handler(){
        if (!this.transientData[name]) {
          if (this.dataUrl !== this.options_jstree.dataUrl) {
            this.dataUrl = this.options_jstree.dataUrl;
            const updateData = (data) => {
              if (this.options_jstree.dataMode === 'tree') {
                this.data = this.insertNodeIntoTree(data);
              } else {
                this.data = this.list_to_tree(data);
              }
            };
            fetch(this.dataUrl)
              .then((resp) => resp.json())
              .then((data) => updateData(data));
          }
        }
      },
    },
    transientData: {
      deep: true,
      handler() {
        if (this.transientData && this.transientData[this.name]){
          this.data = this.transientData[this.name];
        }
      },
    },
  },
  methods: {
    itemClick() {
      this.$emit('input', this.data);
    },
    list_to_tree(list) {
      var map = {}, node, roots = [], i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
        if (list[i].children != null){
          list[i]['opened']=false;
          this.insertNodeIntoTree(list[i].children);
        }
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node[this.options_jstree.parentField] === '0' ) {
          roots.push(node);
        }
        else if (node[this.options_jstree.parentField] === '#'){
          roots.push(node);
        }
        else {
          list[map[node[this.options_jstree.parentField]]].children.push(node);
        }
      }
      return roots;
    },
    insertNodeIntoTree(node) {
      for (let j = 0; j < node.length; j++) {
        if (node[j].children != null){
          node[j]['opened']=false;
          this.insertNodeIntoTree(node[j].children);
        }
      }
      return node;
    },
  },
};
</script>
