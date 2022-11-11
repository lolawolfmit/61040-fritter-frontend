<!-- Form for adding an interest (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddInterestForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/interests',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'interests', label: 'Interest', value: ''}
      ],
      title: 'Add interest',
      callback: () => {
        const message = 'Successfully added interest!';
        this.$set(this.alerts, message, 'success');
        this.$store.commit('refreshInterests');
        this.$store.commit('refreshAccounts');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
