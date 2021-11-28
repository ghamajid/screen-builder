<template>
  <div class="col-12">
    <label>{{ label }}</label>
    <vue-recaptcha v-if="this.sitekey" style="width: 100%;" :sitekey="(this.sitekey) ? this.sitekey : ''" :loadRecaptchaScript="true"/>

  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
  inheritAttrs: false,
  components: {
    VueRecaptcha,
  },
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'placeholder',
    'dataFormat',
    // eslint-disable-next-line vue/no-dupe-keys
    'sitekey',
  ],
  methods: {
    onSubmit() {
      this.$refs.invisibleRecaptcha.execute();
    },
    onVerify(response) {
      console.log('Verify: ' + response);
    },
    onExpired() {
      console.log('Expired');
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
    },
  },
  watch: {
    /*sitekey: {
      handler(){
        // console.log(this.sitekey, 'key');
        // this.sitekey;
      },
    },*/
  },

};
</script>

<style>
/*.rc-anchor-normal {*/
/*  !*height: 74px !important;*!*/
/*  width: 100% !important;*/
/*}*/
/*body{*/
/*  background-color: red;*/
/*}*/
.col-12 div{
  width: 100%!important;
}
iframe{
  width: 100%!important;
}
</style>
