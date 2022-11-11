<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Manage VSP Requests</h2>
      </header>
      <AcceptVSPRequestForm />
      <RevokeVSPRequestForm />
      <DeleteVSPRequestForm />
    </section>
    <section
        v-if="$store.state.vsprequests"
      >
        <h2>All Ungranted VSP Requests:</h2>
        <VSPRequestComponent
          v-for="vsprequest in $store.state.vsprequests"
          :key="vsprequest.id"
          :vsprequest="vsprequest"
        />
      </section>
  </main>
</template>

<script>
import AcceptVSPRequestForm from '@/components/Admin/AcceptVSPRequestForm.vue';
import RevokeVSPRequestForm from '@/components/Admin/RevokeVSPRequestForm.vue';
import DeleteVSPRequestForm from '@/components/Admin/DeleteVSPRequestForm.vue';
import VSPRequestComponent from '@/components/Admin/VSPRequestComponent.vue';

export default {
  name: 'AdminPage',
  components: {
    AcceptVSPRequestForm,
    RevokeVSPRequestForm,
    DeleteVSPRequestForm,
    VSPRequestComponent
  }
};
</script>
