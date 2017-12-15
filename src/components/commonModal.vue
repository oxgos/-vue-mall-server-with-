<template>
   <div>
       <div class="md-modal modal-msg md-modal-transition" :class="{ 'md-show': modalFlag }">
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="changeModalFlag">Close</button>
            </div>
            <div class="md-content">
                <div class="confirm-tips">
                    <slot name="message"></slot>
                </div>
                <div class="btn-wrap">
                    <slot name="btnGroup"></slot>
                </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="modalFlag" @click="changeModalFlag"></div>
   </div>
</template>

<script type="text/ecmascript-6">
   export default {
       props: {
           modalFlag: {
               type: Boolean
           }
       },
       methods: {
           changeModalFlag () {
               this.$emit('changeFlag')
           }
       }
   }
</script>

<style scoped>
 @import './../assets/css/login.css';
</style>
