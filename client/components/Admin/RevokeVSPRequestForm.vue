<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RevokeVSPRequestForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/vsprequest/vspstatus',
      method: 'DELETE',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''}
      ],
      title: 'Revoke VSP Status',
      callback: () => {
        const message = 'VSP status successfully revoked!';
        this.$store.commit('refreshVSPRequests');
        this.$store.commit('refreshVSPStatus');
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
