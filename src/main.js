/* istanbul ignore file */
import Vue from 'vue';
import App from './App.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import './assets/css/kendo.cdn.telerik.css'
import './assets/css/stackpath.bootstrapcdn.min.css'
import Vuex from 'vuex';
import ScreenBuilder from '@/components';
import axios from 'axios';
import TestComponents from '../tests/components';
import BootstrapVue from 'bootstrap-vue';
import Multiselect from '@processmaker/vue-multiselect/src/Multiselect';

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
i18next.init({ lng: 'en' });
Vue.mixin({ i18n: new VueI18Next(i18next) });
Vue.use(Vuex);
Vue.use(ScreenBuilder);
Vue.component('Multiselect', Multiselect);

// Stub for standalone. Real one is in core.
Vue.component('required', { template: '<div class="text-right"><small>* = Required</small></div>' });

const store = new Vuex.Store({ modules: {} });

window.axios = axios.create({
    baseURL: '/api/1.0/',
});
console.log('document.cookie',document.cookie)
window.cookie = document.cookie;

window.exampleScreens = [{
    id: 1,
    screen_category_id: 1,
    title: 'Sub screen example',
    description: 'A sub screen example',
    type: 'FORM',
    config: [{
        name: 'Sub screen example',
        items: [
            {
                "config": {
                    "icon": "far fa-square",
                    "label": "New Input",
                    "name": "form_input_1",
                    "placeholder": "",
                    "validation": [],
                    "helper": null,
                    "type": "text",
                    "dataFormat": "string",
                    "readonly": false
                },
                "inspector": [
                    {
                        "type": "FormInput",
                        "field": "name",
                        "config": {
                            "label": "Variable Name",
                            "name": "Variable Name",
                            "validation": "regex:/^(?:[A-Za-z])(?:[0-9A-Z_.a-z])*[^.]$/|required|not_in:null,break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,class,const,enum,export,extends,import,super,true,false",
                            "helper": "A variable name is a symbolic name to reference information."
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "label",
                        "config": {
                            "label": "Label",
                            "helper": "The label describes the field's name"
                        }
                    },
                    {
                        "type": "FormMultiselect",
                        "field": "dataFormat",
                        "config": {
                            "label": "Data Type",
                            "name": "Data Type",
                            "helper": "The data type specifies what kind of data is stored in the variable.",
                            "validation": "required",
                            "options": [
                                {
                                    "value": "string",
                                    "content": "Text"
                                },
                                {
                                    "value": "int",
                                    "content": "Integer"
                                },
                                {
                                    "value": "currency",
                                    "content": "Currency"
                                },
                                {
                                    "value": "percentage",
                                    "content": "Percentage"
                                },
                                {
                                    "value": "float",
                                    "content": "Decimal"
                                },
                                {
                                    "value": "datetime",
                                    "content": "Datetime"
                                },
                                {
                                    "value": "date",
                                    "content": "Date"
                                },
                                {
                                    "value": "password",
                                    "content": "Password"
                                },
                                {
                                    "value": "object",
                                    "content": "Object"
                                }
                            ]
                        }
                    },
                    {
                        "type": {
                            "extends": {
                                "inheritAttrs": false,
                                "mixins": [
                                    {
                                        "props": {
                                            "validationMessages": {
                                                "type": null
                                            },
                                            "validationField": {
                                                "type": null
                                            },
                                            "validationData": {
                                                "type": null
                                            },
                                            "validation": {
                                                "type": null
                                            }
                                        },
                                        "computed": {},
                                        "watch": {
                                            "validationData": {
                                                "deep": true,
                                                "user": true
                                            }
                                        },
                                        "methods": {}
                                    }
                                ],
                                "props": {
                                    "selectedControl": {
                                        "type": null
                                    },
                                    "value": {
                                        "type": null
                                    },
                                    "name": {
                                        "type": null
                                    },
                                    "helper": {
                                        "type": null
                                    },
                                    "options": {
                                        "type": null
                                    },
                                    "error": {
                                        "type": null
                                    },
                                    "label": {
                                        "type": null
                                    }
                                },
                                "computed": {},
                                "methods": {},
                                "staticRenderFns": [],
                                "_compiled": true,
                                "beforeCreate": [
                                    null
                                ],
                                "beforeDestroy": [
                                    null
                                ],
                                "__file": "src/components/inspector/form-multiselect.vue",
                                "_Ctor": {}
                            },
                            "computed": {},
                            "staticRenderFns": [],
                            "_compiled": true,
                            "beforeCreate": [
                                null
                            ],
                            "beforeDestroy": [
                                null
                            ],
                            "__file": "src/components/inspector/select-data-type-mask.vue",
                            "_Ctor": {}
                        },
                        "field": "dataMask",
                        "config": {
                            "label": "Data Format",
                            "name": "Data Format",
                            "helper": "The data format for the selected type."
                        }
                    },
                    {
                        "type": "ValidationSelect",
                        "field": "validation",
                        "config": {
                            "label": "Validation Rules",
                            "helper": "The validation rules needed for this field"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "placeholder",
                        "config": {
                            "label": "Placeholder Text",
                            "helper": "The placeholder is what is shown in the field when no value is provided yet"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "helper",
                        "config": {
                            "label": "Helper Text",
                            "helper": "Help text is meant to provide additional guidance on the field's value"
                        }
                    },
                    {
                        "type": "FormCheckbox",
                        "field": "readonly",
                        "config": {
                            "label": "Read Only",
                            "helper": ""
                        }
                    },
                    {
                        "type": "ColorSelect",
                        "field": "color",
                        "config": {
                            "label": "Text Color",
                            "helper": "Set the element's text color",
                            "options": [
                                {
                                    "value": "text-primary",
                                    "content": "primary"
                                },
                                {
                                    "value": "text-secondary",
                                    "content": "secondary"
                                },
                                {
                                    "value": "text-success",
                                    "content": "success"
                                },
                                {
                                    "value": "text-danger",
                                    "content": "danger"
                                },
                                {
                                    "value": "text-warning",
                                    "content": "warning"
                                },
                                {
                                    "value": "text-info",
                                    "content": "info"
                                },
                                {
                                    "value": "text-light",
                                    "content": "light"
                                },
                                {
                                    "value": "text-dark",
                                    "content": "dark"
                                }
                            ]
                        }
                    },
                    {
                        "type": "ColorSelect",
                        "field": "bgcolor",
                        "config": {
                            "label": "Background Color",
                            "helper": "Set the element's background color",
                            "options": [
                                {
                                    "value": "alert alert-primary",
                                    "content": "primary"
                                },
                                {
                                    "value": "alert alert-secondary",
                                    "content": "secondary"
                                },
                                {
                                    "value": "alert alert-success",
                                    "content": "success"
                                },
                                {
                                    "value": "alert alert-danger",
                                    "content": "danger"
                                },
                                {
                                    "value": "alert alert-warning",
                                    "content": "warning"
                                },
                                {
                                    "value": "alert alert-info",
                                    "content": "info"
                                },
                                {
                                    "value": "alert alert-light",
                                    "content": "light"
                                },
                                {
                                    "value": "alert alert-dark",
                                    "content": "dark"
                                }
                            ]
                        }
                    },
                    {
                        "type": {
                            "props": {
                                "helper": {
                                    "type": null
                                },
                                "value": {
                                    "type": null
                                }
                            },
                            "components": {
                                "MonacoEditor": {
                                    "name": "MonacoEditor",
                                    "props": {
                                        "value": {},
                                        "theme": {
                                            "default": "vs"
                                        },
                                        "language": {},
                                        "options": {},
                                        "amdRequire": {}
                                    },
                                    "model": {
                                        "event": "change"
                                    },
                                    "watch": {
                                        "options": {
                                            "deep": true,
                                            "user": true
                                        }
                                    },
                                    "methods": {},
                                    "_Ctor": {}
                                }
                            },
                            "watch": {
                                "value": {
                                    "immediate": true,
                                    "user": true
                                }
                            },
                            "computed": {
                                "effectiveValue": {}
                            },
                            "methods": {},
                            "staticRenderFns": [],
                            "_compiled": true,
                            "_scopeId": "data-v-4f1374fd",
                            "beforeCreate": [
                                null
                            ],
                            "beforeDestroy": [
                                null
                            ],
                            "__file": "src/components/inspector/default-value-editor.vue",
                            "_Ctor": {}
                        },
                        "field": "defaultValue",
                        "config": {
                            "label": "Default Value",
                            "helper": "The default value is pre populated using the existing request data. This feature will allow you to modify the value displayed on screen load if needed."
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "conditionalHide",
                        "config": {
                            "label": "Visibility Rule",
                            "helper": "This control is hidden until this expression is true"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "customFormatter",
                        "config": {
                            "label": "Custom Format String",
                            "helper": "Use the Mask Pattern format <br> Date ##/##/#### <br> SSN ###-##-#### <br> Phone (###) ###-####",
                            "validation": ""
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "customCssSelector",
                        "config": {
                            "label": "CSS Selector Name",
                            "helper": "Use this in your custom css rules",
                            "validation": "regex: [-?[_a-zA-Z]+[_-a-zA-Z0-9]*]"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "ariaLabel",
                        "config": {
                            "label": "Aria Label",
                            "helper": "Attribute designed to help assistive technology (e.g. screen readers) attach a label"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "tabindex",
                        "config": {
                            "label": "Tab Order",
                            "helper": "Order in which a user will move focus from one control to another by pressing the Tab key",
                            "validation": "regex: [0-9]*"
                        }
                    }
                ],
                "component": "FormInput",
                "editor-component": "FormInput",
                "editor-control": "FormInput",
                "label": "Line Input"
            },
            {
                "config": {
                    "icon": "far fa-square",
                    "label": "New Input",
                    "name": "form_input_2",
                    "placeholder": "",
                    "validation": "",
                    "helper": null,
                    "type": "text",
                    "dataFormat": "string"
                },
                "inspector": [
                    {
                        "type": "FormInput",
                        "field": "name",
                        "config": {
                            "label": "Variable Name",
                            "name": "Variable Name",
                            "validation": "regex:/^(?:[A-Za-z])(?:[0-9A-Z_.a-z])*[^.]$/|required|not_in:null,break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,class,const,enum,export,extends,import,super,true,false",
                            "helper": "A variable name is a symbolic name to reference information."
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "label",
                        "config": {
                            "label": "Label",
                            "helper": "The label describes the field's name"
                        }
                    },
                    {
                        "type": "FormMultiselect",
                        "field": "dataFormat",
                        "config": {
                            "label": "Data Type",
                            "name": "Data Type",
                            "helper": "The data type specifies what kind of data is stored in the variable.",
                            "validation": "required",
                            "options": [
                                {
                                    "value": "string",
                                    "content": "Text"
                                },
                                {
                                    "value": "int",
                                    "content": "Integer"
                                },
                                {
                                    "value": "currency",
                                    "content": "Currency"
                                },
                                {
                                    "value": "percentage",
                                    "content": "Percentage"
                                },
                                {
                                    "value": "float",
                                    "content": "Decimal"
                                },
                                {
                                    "value": "datetime",
                                    "content": "Datetime"
                                },
                                {
                                    "value": "date",
                                    "content": "Date"
                                },
                                {
                                    "value": "password",
                                    "content": "Password"
                                },
                                {
                                    "value": "object",
                                    "content": "Object"
                                }
                            ]
                        }
                    },
                    {
                        "type": {
                            "extends": {
                                "inheritAttrs": false,
                                "mixins": [
                                    {
                                        "props": {
                                            "validationMessages": {
                                                "type": null
                                            },
                                            "validationField": {
                                                "type": null
                                            },
                                            "validationData": {
                                                "type": null
                                            },
                                            "validation": {
                                                "type": null
                                            }
                                        },
                                        "computed": {},
                                        "watch": {
                                            "validationData": {
                                                "deep": true,
                                                "user": true
                                            }
                                        },
                                        "methods": {}
                                    }
                                ],
                                "props": {
                                    "selectedControl": {
                                        "type": null
                                    },
                                    "value": {
                                        "type": null
                                    },
                                    "name": {
                                        "type": null
                                    },
                                    "helper": {
                                        "type": null
                                    },
                                    "options": {
                                        "type": null
                                    },
                                    "error": {
                                        "type": null
                                    },
                                    "label": {
                                        "type": null
                                    }
                                },
                                "computed": {},
                                "methods": {},
                                "staticRenderFns": [],
                                "_compiled": true,
                                "beforeCreate": [
                                    null
                                ],
                                "beforeDestroy": [
                                    null
                                ],
                                "__file": "src/components/inspector/form-multiselect.vue",
                                "_Ctor": {}
                            },
                            "computed": {},
                            "staticRenderFns": [],
                            "_compiled": true,
                            "beforeCreate": [
                                null
                            ],
                            "beforeDestroy": [
                                null
                            ],
                            "__file": "src/components/inspector/select-data-type-mask.vue",
                            "_Ctor": {}
                        },
                        "field": "dataMask",
                        "config": {
                            "label": "Data Format",
                            "name": "Data Format",
                            "helper": "The data format for the selected type."
                        }
                    },
                    {
                        "type": "ValidationSelect",
                        "field": "validation",
                        "config": {
                            "label": "Validation Rules",
                            "helper": "The validation rules needed for this field"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "placeholder",
                        "config": {
                            "label": "Placeholder Text",
                            "helper": "The placeholder is what is shown in the field when no value is provided yet"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "helper",
                        "config": {
                            "label": "Helper Text",
                            "helper": "Help text is meant to provide additional guidance on the field's value"
                        }
                    },
                    {
                        "type": "FormCheckbox",
                        "field": "readonly",
                        "config": {
                            "label": "Read Only"
                        }
                    },
                    {
                        "type": "ColorSelect",
                        "field": "color",
                        "config": {
                            "label": "Text Color",
                            "helper": "Set the element's text color",
                            "options": [
                                {
                                    "value": "text-primary",
                                    "content": "primary"
                                },
                                {
                                    "value": "text-secondary",
                                    "content": "secondary"
                                },
                                {
                                    "value": "text-success",
                                    "content": "success"
                                },
                                {
                                    "value": "text-danger",
                                    "content": "danger"
                                },
                                {
                                    "value": "text-warning",
                                    "content": "warning"
                                },
                                {
                                    "value": "text-info",
                                    "content": "info"
                                },
                                {
                                    "value": "text-light",
                                    "content": "light"
                                },
                                {
                                    "value": "text-dark",
                                    "content": "dark"
                                }
                            ]
                        }
                    },
                    {
                        "type": "ColorSelect",
                        "field": "bgcolor",
                        "config": {
                            "label": "Background Color",
                            "helper": "Set the element's background color",
                            "options": [
                                {
                                    "value": "alert alert-primary",
                                    "content": "primary"
                                },
                                {
                                    "value": "alert alert-secondary",
                                    "content": "secondary"
                                },
                                {
                                    "value": "alert alert-success",
                                    "content": "success"
                                },
                                {
                                    "value": "alert alert-danger",
                                    "content": "danger"
                                },
                                {
                                    "value": "alert alert-warning",
                                    "content": "warning"
                                },
                                {
                                    "value": "alert alert-info",
                                    "content": "info"
                                },
                                {
                                    "value": "alert alert-light",
                                    "content": "light"
                                },
                                {
                                    "value": "alert alert-dark",
                                    "content": "dark"
                                }
                            ]
                        }
                    },
                    {
                        "type": {
                            "props": {
                                "helper": {
                                    "type": null
                                },
                                "value": {
                                    "type": null
                                }
                            },
                            "components": {
                                "MonacoEditor": {
                                    "name": "MonacoEditor",
                                    "props": {
                                        "value": {},
                                        "theme": {
                                            "default": "vs"
                                        },
                                        "language": {},
                                        "options": {},
                                        "amdRequire": {}
                                    },
                                    "model": {
                                        "event": "change"
                                    },
                                    "watch": {
                                        "options": {
                                            "deep": true,
                                            "user": true
                                        }
                                    },
                                    "methods": {},
                                    "_Ctor": {}
                                }
                            },
                            "watch": {
                                "value": {
                                    "immediate": true,
                                    "user": true
                                }
                            },
                            "computed": {
                                "effectiveValue": {}
                            },
                            "methods": {},
                            "staticRenderFns": [],
                            "_compiled": true,
                            "_scopeId": "data-v-4f1374fd",
                            "beforeCreate": [
                                null
                            ],
                            "beforeDestroy": [
                                null
                            ],
                            "__file": "src/components/inspector/default-value-editor.vue",
                            "_Ctor": {}
                        },
                        "field": "defaultValue",
                        "config": {
                            "label": "Default Value",
                            "helper": "The default value is pre populated using the existing request data. This feature will allow you to modify the value displayed on screen load if needed."
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "conditionalHide",
                        "config": {
                            "label": "Visibility Rule",
                            "helper": "This control is hidden until this expression is true"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "customFormatter",
                        "config": {
                            "label": "Custom Format String",
                            "helper": "Use the Mask Pattern format <br> Date ##/##/#### <br> SSN ###-##-#### <br> Phone (###) ###-####",
                            "validation": ""
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "customCssSelector",
                        "config": {
                            "label": "CSS Selector Name",
                            "helper": "Use this in your custom css rules",
                            "validation": "regex: [-?[_a-zA-Z]+[_-a-zA-Z0-9]*]"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "ariaLabel",
                        "config": {
                            "label": "Aria Label",
                            "helper": "Attribute designed to help assistive technology (e.g. screen readers) attach a label"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "tabindex",
                        "config": {
                            "label": "Tab Order",
                            "helper": "Order in which a user will move focus from one control to another by pressing the Tab key",
                            "validation": "regex: [0-9]*"
                        }
                    }
                ],
                "component": "FormInput",
                "editor-component": "FormInput",
                "editor-control": "FormInput",
                "label": "Line Input"
            },
            {
                "config": {
                    "icon": "far fa-compass",
                    "label": "Page Navigation",
                    "variant": "primary",
                    "event": "pageNavigate",
                    "eventData": "1"
                },
                "inspector": [
                    {
                        "type": "PageSelect",
                        "field": "eventData",
                        "config": {
                            "label": "Destination Screen",
                            "helper": "The destination page to navigate to"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "label",
                        "config": {
                            "label": "Button Label",
                            "helper": "The label describes the button's text"
                        }
                    },
                    {
                        "type": "FormMultiselect",
                        "field": "variant",
                        "config": {
                            "label": "Button Variant Style",
                            "helper": "The variant determines the appearance of the button",
                            "options": [
                                {
                                    "value": "primary",
                                    "content": "Primary"
                                },
                                {
                                    "value": "secondary",
                                    "content": "Secondary"
                                },
                                {
                                    "value": "success",
                                    "content": "Success"
                                },
                                {
                                    "value": "danger",
                                    "content": "Danger"
                                },
                                {
                                    "value": "warning",
                                    "content": "Warning"
                                },
                                {
                                    "value": "info",
                                    "content": "Info"
                                },
                                {
                                    "value": "light",
                                    "content": "Light"
                                },
                                {
                                    "value": "dark",
                                    "content": "Dark"
                                },
                                {
                                    "value": "link",
                                    "content": "Link"
                                }
                            ]
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "conditionalHide",
                        "config": {
                            "label": "Visibility Rule",
                            "helper": "This control is hidden until this expression is true"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "customFormatter",
                        "config": {
                            "label": "Custom Format String",
                            "helper": "Use the Mask Pattern format <br> Date ##/##/#### <br> SSN ###-##-#### <br> Phone (###) ###-####",
                            "validation": ""
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "customCssSelector",
                        "config": {
                            "label": "CSS Selector Name",
                            "helper": "Use this in your custom css rules",
                            "validation": "regex: [-?[_a-zA-Z]+[_-a-zA-Z0-9]*]"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "ariaLabel",
                        "config": {
                            "label": "Aria Label",
                            "helper": "Attribute designed to help assistive technology (e.g. screen readers) attach a label"
                        }
                    },
                    {
                        "type": "FormInput",
                        "field": "tabindex",
                        "config": {
                            "label": "Tab Order",
                            "helper": "Order in which a user will move focus from one control to another by pressing the Tab key",
                            "validation": "regex: [0-9]*"
                        }
                    }
                ],
                "component": "FormButton",
                "editor-component": "FormButton",
                "editor-control": "PageNavigation",
                "label": "Page Navigation"
            }
        ],
    }, ],
    computed: [],
    watchers: [],
    custom_css: '[selector=\'first-name\'] label { font-style: italic; }',
    status: 'ACTIVE',
}, ];
window.ProcessMaker = {
    isStub: true,
    user: {
        id: 1,
        lang: 'en',
    },
    apiClient: {
        create() { return this; },
        defaults: {
            headers: {
                common: {
                    'X-CSRF-TOKEN': 'token',
                },
            },
        },
        get(url) {
            return new Promise((resolve, reject) => {
                let screen;
                if (url.substr(0, 8) === 'screens/') {
                    screen = window.exampleScreens.find(s => s.id == url.substr(8));
                }
                if (url.substr(0, 8) === 'screens/' && screen) {
                    resolve({ data: screen });
                } else if (url === 'screens') {
                    resolve({
                        data: {
                            data: window.exampleScreens,
                        }
                    });
                } else if (url === '/data_sources/1') {
                    resolve({
                        data: {
                            endpoints: {
                                'list': {},
                            },
                        },
                    });
                } else if (url === '/data_sources') {
                    resolve({
                        data: {
                            data: [{
                                id: 1,
                                name: 'Persons',
                                endpoints: {
                                    'list': {},
                                }
                            }, ],
                        }
                    });
                } else {
                    window.axios.get(url)
                        .then(response => resolve(response))
                        .catch(error => reject(error));
                }
            });
        },
        post(url, body) {
            return new Promise((resolve, reject) => {
                switch (url) {
                    case '/requests/data_sources/1':
                        resolve({
                            data: {
                                response: [
                                    { value: 1, content: 'James' },
                                    { value: 2, content: 'John' },
                                    { value: 3, content: 'Mary' },
                                    { value: 4, content: 'Patricia' },
                                ],
                            }
                        });
                        break;
                    default:
                        window.axios.post(url, body)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            });
        },
        put() {
            return new Promise((resolve) => {
                resolve({
                    data: {
                        response: [],
                    }
                });
            });
        },
        delete() {
            return new Promise((resolve) => {
                resolve({
                    data: {
                        response: [],
                    }
                });
            });
        },
    },
    EventBus: new Vue(),
    confirmModal(title, message, variant, callback) {
        if (window.confirm(`${title}: ${message}`)) {
            callback();
        }
    },
    alert(message, variant) {
        variant;
        message;
    },
};
window.Echo = {
    listeners: [],
    watcherMocks(body, response) {
        this.listeners.forEach((listener) => {
            setTimeout(() => {
                listener.callback({
                    type: '.ProcessMaker\\Events\\ScriptResponseEvent',
                    watcher: body.watcher,
                    response,
                });
            }, 1000);
        });
    },
    private() {
        return {
            notification(callback) {
                window.Echo.listeners.push({ callback });
            },
            stopListening() {
                window.Echo.listeners.splice(0);
            },
            listen(event, callback) {
                window.Echo.listeners.push({ event, callback });
            },
        };
    },
};

const scenario = (window.location.search.substr(1).match(/\w+=(\w+)/) || [])[1];
if (scenario) {
    if (!TestComponents[scenario]) {
        // eslint-disable-next-line no-console
        console.error(`Not found tests/components/${scenario}.vue`);
    } else {
        new Vue({
            store,
            render: h => h(TestComponents[scenario]),
        }).$mount('#app');
    }
} else {
    new Vue({
        store,
        render: h => h(App),
    }).$mount('#app');
}