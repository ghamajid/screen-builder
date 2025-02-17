export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, properties }) {
        if (element.component === 'FormButton' && element.config.event === 'submit') {
          properties[':validate'] = '$v';
        }
        if (element.component === 'FormButton' && element.config.event === 'script_grid') {
            properties[':validate'] = '$v';
        }
        if (element.component === 'FormButton' && element.config.event === 'submit_if_valid') {
            properties[':validate'] = '$v';
        }
      },
    });
  },
};
