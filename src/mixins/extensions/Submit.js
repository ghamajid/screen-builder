export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, properties }) {
        //console.log(element,'element');
        if (element.component === 'FormButton' && element.config.event === 'submit') {
          properties[':validate'] = '$v.vdata';
        }
          if (element.component === 'FormButton' && element.config.event === 'script_grid') {
              properties[':validate'] = '$v.vdata';
          }
      },
    });
  },
};
