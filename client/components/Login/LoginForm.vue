<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      setVSPStatus: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Sign in',
      callback: () => {
        this.$store.commit('refreshInterests');
        this.$store.commit('refreshAccounts');
        this.$store.commit('refreshFollow');
        this.$store.commit('refreshFreets');
        this.$store.commit('refreshVSPStatus');
        this.$store.commit('updateFilter', null);
        if (this.$store.state.username === "lola") {
          this.$store.commit('refreshVSPRequests');
        }
        this.$router.push({name: 'Home'});
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      }
    };
  }
};
</script>
