<!-- Form for requesting VSP status (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RequestVSPStatus',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/vsprequest',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Why do you want to be a VSP?', value: ''}
      ],
      title: 'Request Verified Scientific Professional Status',
      callback: () => {
        const message = 'Successfully submitted VSP request!';
        this.$set(this.alerts, message, 'success');
        this.$store.commit('refreshVSPRequests');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
