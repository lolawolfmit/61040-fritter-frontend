<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>What are you interested in, {{$store.state.username}}?</h2>
      </header>
      <h3 v-if="$store.state.interests.length">Your current interests include: {{$store.state.interests}}</h3>
      <h3 v-else>You have no interests.</h3>
    </section>
    <section>
      <AddInterestForm />
      <DeleteInterestForm />
    </section>
    <section
        v-if="$store.state.suggestedAccounts.length"
      >
        <h2>Accounts related to your interests:</h2>
        <AccountComponent
          v-for="user in $store.state.suggestedAccounts"
          :key="user.id"
          :user="user"
        />
    </section>
    <section v-else>
      No account suggestions at this time.
    </section>
  </main>
</template>

<script>
import AddInterestForm from '@/components/Interests/AddInterestForm.vue';
import DeleteInterestForm from '@/components/Interests/DeleteInterestForm.vue';
import AccountComponent from '@/components/Interests/AccountComponent.vue';

export default {
  name: 'InterestsPage',
  components: {
    AddInterestForm,
    DeleteInterestForm,
    AccountComponent
  }
};
</script>
