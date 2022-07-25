<template>
    <div>
        <!--    <p>Change the orientation:</p>-->
        <!--    <DropDownList-->
        <!--        :style="{ width: '220px' }"-->
        <!--        :data-items="['horizontal', 'vertical']"-->
        <!--        :value="orientation"-->
        <!--        @change="handleOrientationChange"-->
        <!--    />-->
        <!--        <hr/>-->
        <Stepper
            :value="value"
            :items="items"
            :orientation="orientation"
            class="k-rtl"
        />
    </div>
</template>

<script lang="ts">
import {
    Stepper
} from '@progress/kendo-vue-layout';

export default {
    components: {
        Stepper
    },
    props: [
        'config',
        'transientData',
        'name',
        'options'
    ],
    
    data() {
        var orientation = 'horizontal';
        if (this.options && this.options.renderAs) {
            orientation = this.options.renderAs
        }
        return {
            value: 0,
            orientation: orientation,
            items: [
                {
                    icon: "k-i-lock",
                    label: "تایید قوانین",
                },
                {
                    icon: "k-i-user",
                    label: "اطلاعات هویتی",
                },
                {
                    icon: "k-i-note",
                    label: "اطلاعات درخواست",
                },
                {
                    icon: "k-i-track-changes",
                    label: "تایید نهایی",
                },
            ]
        }
    },
    watch: {
        transientData: {
            immediate: true,
            deep: true,
            handler(val, oldVal) {
                var lastItemIndex = this.items.length - 1
                this.value = 0
                if (this.transientData && this.transientData[this.name]) {
                    this.value = this.transientData[this.name]
                    if (this.transientData[this.name] < 0){
                        this.value = 0
                    }
                    else if(this.transientData[this.name] > lastItemIndex){
                        this.value = lastItemIndex
                    }
                }
                console.log(this.value, 'das')
                this.$emit('input', this.value);
            },
        },
    },
};
</script>
