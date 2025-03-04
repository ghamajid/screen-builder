import Vue from 'vue';
export default Vue.extend({
  template: `
<!--    <span v-if="isCurrentRowEditing === false">-->
<!--            <button
                class="action-button edit"
                data-action="edit"
                @click="clickingedit"
            >
                 edit 
              </button>-->
    <div>
       <button
         v-if="this.params.optionDelete == 1"
          type="button"
          class="action-button btn btn-sm btn-rounded btn-danger delete fas fa-trash-alt py-2"
          data-action="delete"
       >
       </button>
       <button
           v-if="this.params.optionEdit == 1"
           type="button"
           class="action-button btn btn-sm btn-rounded btn-warning edit fas fa-pencil-alt py-2 "
           data-action="edit"
       >
       </button>
    </div>
<!--        </span>-->
<!--    <span v-else>
            <button
                class="action-button update"
                data-action="update">
               update  
            </button>
            <button
                class="action-button cancel"
                data-action="cancel">
                   cancel
            </button>
        </span>-->
    `,
  data(){
    return {
      isCurrentRowEditing:null,
    };
  },
  props: [
    'optionDelete',
  ],
  methods: {
    /*clickingedit() {
      let editingCells = this.params.api.getEditingCells();
      this.isCurrentRowEditing = editingCells.some((cell) => {
        return cell.rowIndex === this.params.node.rowIndex;
      });
    },*/
  },
});
