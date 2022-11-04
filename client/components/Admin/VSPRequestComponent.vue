<!-- Reusable component representing a single VSP request -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="vsprequest"
  >
    <header>
      <h3 class="username">
        @{{ vsprequest.username }}
      </h3>
      <div
        class="actions"
      >
        <button
          @click="acceptRequest"
        >
          ✅ Accept
        </button>
        <button @click="deleteRequest">
          🗑️ Delete
        </button>
      </div>
    </header>
    <p>{{ vsprequest.content }}</p>
    <p class="info">
      Requested {{ vsprequest.dateRequested }}
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'VSPRequestComponent',
  props: {
    // Data from the stored freet
    vsprequest: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered
    };
  },
  methods: {
    deleteRequest() {
      /**
       * Deletes this request.
       */
      const params = {
        method: 'DELETE',
        body: JSON.stringify({username: this.vsprequest.username}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted request!', status: 'success'
          });
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    acceptRequest() {
      /**
       * Updates freet to have the submitted draft content.
       */
      const params = {
        method: 'PUT',
        message: 'Successfully accepted request!',
        body: JSON.stringify({username: this.vsprequest.username}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/vsprequest`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshVSPRequests');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.vsprequest {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
