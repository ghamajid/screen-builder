<template>
  <div v-if="!Array.isArray(value)" class="form-group">
    <label v-uni-for="name">{{value['lable']}}</label>
    <input
            v-bind="$attrs"
            v-uni-id="name"
            :value="value['value']"
            @input="searchChange($event.target.value)"
            :name="name"
            class="form-control"
            :class="classList"
            v-on:blur="formatFloatValue()"
    >
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
  <div v-else class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <input
        v-bind="$attrs"
        v-uni-id="name"
        :value="value"
        @input="$emit('input', $event.target.value)"
        :name="name"
        class="form-control"
        :class="classList"
        v-on:blur="formatFloatValue()"
    >
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>
    import { createUniqIdsMixin } from 'vue-uniq-ids'
    import ValidationMixin from './mixins/validation'
    import DataFormatMixin from './mixins/DataFormat';
    import DisplayErrors from './common/DisplayErrors';
    const uniqIdsMixin = createUniqIdsMixin();
    export default {
        inheritAttrs: false,
        components: {
            DisplayErrors,
        },
        mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
        props: [
            'value',
            'label',
            'error',
            'helper',
            'name',
            'controlClass',
        ],
        computed:{
            classList() {
                console.log("1");
                return {
                    'is-invalid': (this.validator && this.validator.errorCount) || this.error,
                    [this.controlClass]: !!this.controlClass
                }
            }
        },
        data() {
          console.log("input");
            return {
                validator: null
            }
        },
        methods: {
            searchChange(value) {
                this.emit('input', array(lable=>value['lable'],value=>value))
            }
        },
    }
</script>