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
            @change="handleChange"
            :items="items"
            :orientation="orientation"
            class="k-rtl"
        />
    </div>
</template>

<script lang="ts">
import {DropDownList} from '@progress/kendo-vue-dropdowns';
import {
    Stepper
} from '@progress/kendo-vue-layout';

export default {
    components: {
        Stepper,
        DropDownList
    },
    props: [
        'config',
        'transientData',
        'name',
        'options'
    ],
    
    data() {
        var name_val = 0;
        console.log(this.transientData)
        if (this.transientData && this.transientData[this.name]) {
            name_val = this.transientData[this.name]
        }
    
        var orientation = 'horizontal';
        if (this.options && this.options.renderAs) {
            orientation = this.options.renderAs
        }
        return {
            value: name_val,
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
    methods: {
        handleChange(e) {
            // this.value = e.value;
        },
        handleOrientationChange(e) {
            this.orientation = e.target.value;
        }
    },
};
</script>
