// Import our components
import VueFormBuilder from './vue-form-builder';
import VueFormRenderer from './vue-form-renderer';
import VueFormRendererPrint from './vue-form-renderer-print';
import * as renderer from './renderer';
import FormMultiColumn from './renderer/form-multi-column';
import * as inspector from './inspector';
import FormBuilderControls from '../form-builder-controls';
import Task from './task';
import Loop from './editor/loop';
import MultiColumn from './editor/multi-column';
import FormLoop from './renderer/form-loop';
import NewFormMultiColumn from './renderer/new-form-multi-column';
import FormNestedScreen from './renderer/form-nested-screen';
import ScreenRenderer from './screen-renderer';
import ScreenRendererPrint from './screen-renderer-print';
import AddLoopRow from './renderer/add-loop-row';
import FormRecordList from './renderer/form-record-list';
import FormImage from './renderer/form-image';
import FormInput from './renderer/form-input';
import VueFormElements from '@processmaker/vue-form-elements';
import FormButton from './renderer/form-button';
import FileUpload from './renderer/file-upload.vue';
import FileDownload from './renderer/file-download.vue';
import FormMaskedInput from './renderer/form-masked-input';
import DefaultLoadingSpinner from './utils/default-loading-spinner';
import DataProvider from '../DataProvider';
import FormPersianDatePicker from './renderer/form-persian-date-picker';
import FormPersianDatePickerBuilder from './renderer/form-persian-date-picker-builder';
import FormMultiSelectOption from './renderer/form_multi_select_option';
import Pelak from './renderer/pelak';
import FormTextArea from './renderer/form-textarea';
import FormTimeline from './renderer/form-timeline';
import FormAgGrid from './renderer/form-ag-grid.vue';
import FormCheckbox from './renderer/form-checkbox';


const rendererComponents = {
  ...renderer,
  FormMultiColumn,
};

// Export our named exports
export {
  VueFormBuilder,
  VueFormRenderer,
  VueFormRendererPrint,
  inspector,
  rendererComponents as renderer,
  FormBuilderControls,
  Task,
};

// Export our Vue plugin as our default
export default {
  install(Vue) {
    // First check to see if we're already installed
    /* istanbul ignore next */
    if (Vue._processMakerVueFormBuilderInstalled) {
      return;
    }

    // Boolean flag to see if we're already installed
    Vue._processMakerVueFormBuilderInstalled = true;

    // Register the builder and renderer
    Vue.component('AddLoopRow', AddLoopRow);
    Vue.component('FormImage', FormImage);
    Vue.component('FormLoop', FormLoop);
    Vue.component('FormMultiColumn', FormMultiColumn);
    Vue.component('FormNestedScreen', FormNestedScreen);
    Vue.component('FormRecordList', FormRecordList);
    Vue.component('Loop', Loop);
    Vue.component('MultiColumn', MultiColumn);
    Vue.component('NewFormMultiColumn', NewFormMultiColumn);
    Vue.component('ScreenRenderer', ScreenRenderer);
    Vue.component('ScreenRendererPrint', ScreenRendererPrint);
    Vue.component('task', Task);
    Vue.component('vue-form-builder', VueFormBuilder);
    Vue.component('vue-form-renderer', VueFormRenderer);
    Vue.component('vue-form-renderer-print', VueFormRendererPrint);
    Vue.component('default-loading-spinner', DefaultLoadingSpinner);
    Vue.use(VueFormElements);
    Vue.component('FormButton', FormButton);
    Vue.component('FileUpload', FileUpload);
    Vue.component('FileDownload', FileDownload);
    Vue.component('FormPersianDatePicker', FormPersianDatePicker);
    Vue.component('FormPersianDatePickerBuilder', FormPersianDatePickerBuilder);
    Vue.component('FormMultiSelectOption', FormMultiSelectOption);
    Vue.component('FormMaskedInput', FormMaskedInput);
    Vue.component('Pelak', Pelak);
    Vue.component('FormInput', FormInput);
    Vue.component('FormTextArea', FormTextArea);
    Vue.component('FormTimeline', FormTimeline);
    Vue.component('FormAgGrid', FormAgGrid);
    Vue.component('FormCheckbox', FormCheckbox);

    Vue.use(DataProvider);
  },
};
