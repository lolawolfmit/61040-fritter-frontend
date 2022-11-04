<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteVSPRequestForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/vsprequest',
      method: 'DELETE',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''}
      ],
      title: 'Delete VSP Request',
      callback: () => {
        const message = 'Request successfully deleted!';
        this.$store.commit('refreshVSPRequests');
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
