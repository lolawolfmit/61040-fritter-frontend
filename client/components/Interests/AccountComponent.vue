<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="account"
  >
    <header>
      <h3
        class="user"
        v-if="$store.state.VSPs.includes(user.username)"
      >
        @{{ user.username }} 💡
      </h3>
      <h3
        class="user"
        v-else
      >
        @{{ user.username }}
      </h3>
      <div
        class="actions"
      >
        <button
          @click="followUser"
        >
          Follow
        </button>
      </div>
    </header>
    <p class="info">
      Joined on {{ user.dateJoined }}
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
  name: 'AccountComponent',
  props: {
    // Data from the stored freet
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    followUser() {
      /**
       * Follows this user.
       */
      const params = {
        method: 'PATCH',
        body: JSON.stringify({following: this.user.username}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully followed user!', status: 'success'
          });
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
        const r = await fetch('/api/users/followers', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshAccounts');

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
.account {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
