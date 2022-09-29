<template>
  <div class="uploader-files-new">
    <slot :files="files">
      <ul>
        <li v-for="file in files" :key="file.id">
          <uploader-file-new :file="file"></uploader-file-new>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
  import { uploaderMixin } from './common/mixins'
  import UploaderFileNew from './file-up.vue'

  const COMPONENT_NAME = 'uploader-files-new'

  export default {
    name: COMPONENT_NAME,
    mixins: [uploaderMixin],
    computed: {
      files () {
        return this.uploader.files
      }
    },
    components: {
      UploaderFileNew
    },
    created() {
      console.log('fiiilesss')
    }
  }
</script>

<style>
  .uploader-files-new {
    position: relative;
  }
  .uploader-files-new > ul {
    list-style: none;
    margin: 0;
    padding: 0
  }
</style>
