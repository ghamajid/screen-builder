import Vue from 'vue';
export default Vue.extend({
    template: `
      <div>
      <div v-if="params.column.colDef.field == params.columnApi.columnModel.columnDefs[0].field">
          <span style=" position: absolute;top: -1px;right: 63px;">{{ data_array[0] }}</span>
          <span style=" position: absolute;top: 28px;right: 1px;">{{ data_array[1] }}</span>
            <div class="customHeaderLabel" v-bind:style="{ width: width_param + 'px'}" style="height: 20px;border-bottom: 1px solid #dbdbdb;-webkit-transform: translateY(-9px) translateX(22px) rotate(-15deg); " ></div>
        </div>
         <div v-else>
            <div class="customHeaderLabel" >{{ params.displayName }}</div>
        </div>
      </div>
    `,
    data: function () {
        return {
            ascSort: null,
            descSort: null,
            noSort: null,
            nam: 0,
            data_array:[],
            width_param:100
        };
    },
    beforeMount() {
    },
    mounted() {
        //console.log(this.params,'this.params');
        if(this.params.column.colDef.field == this.params.columnApi.columnModel.columnDefs[0].field){
                this.data_array = this.params.displayName.split("|");
                this.width_param = this.params.column.colDef.maxWidth;
               //onsole.log(this.data_array,'this.data_array');
        }
        //console.log(this.params.column.colDef.field, 'params2');
        //console.log(this.params.columnApi.columnModel.columnDefs[0].field, 'params');
        this.params.column.addEventListener('sortChanged', this.onSortChanged);
        this.onSortChanged();
    },
    methods: {
        onMenuClicked() {
            this.params.showColumnMenu(this.$refs.menuButton);
        },

        onSortChanged() {
            this.ascSort = this.descSort = this.noSort = 'inactive';
            if (this.params.column.isSortAscending()) {
                this.ascSort = 'active';
            } else if (this.params.column.isSortDescending()) {
                this.descSort = 'active';
            } else {
                this.noSort = 'active';
            }
        },

        onSortRequested(order, event) {
            this.params.setSort(order, event.shiftKey);
        },
    },
});
