<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AcceptVSPRequestForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/vsprequest',
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''}
      ],
      title: 'Accept VSP Request',
      callback: () => {
        const message = 'Request successfully accepted!';
        this.$store.commit('refreshVSPRequests');
        this.$store.commit('refreshVSPStatus');
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
