<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
        <h2 v-if='$store.state.isVSP'>You are a VSP!</h2>
        <h2 v-if='!$store.state.isVSP'>You are not a VSP!</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
      <RequestVSPStatus />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import RequestVSPStatus from '@/components/Account/RequestVSPStatus.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    RequestVSPStatus,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>
