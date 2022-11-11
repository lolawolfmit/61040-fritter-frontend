<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <div>
        <h3
          class="author"
          v-if="$store.state.VSPs.includes(freet.author)"
        >
          @{{ freet.author }} 💡
        </h3>
        <h3
          class="author"
          v-else
        >
          @{{ freet.author }}
        </h3>
        <div v-if="freet.author !== $store.state.username">
          <button
            v-if="$store.state.following.includes(freet.author)"
            @click="unfollowUser"
          >
            Unfollow
          </button>
          <button
            v-else
            @click="followUser"
          >
            Follow
          </button>
        </div>
      </div>
      <h4 v-if="freet.fact">Fact</h4>
      <h4 v-if="!freet.fact">Opinion</h4>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <div v-if="freet.fact">
      <p v-if="freet.endorsements.length > 2">{{freet.endorsements[0]}} and {{freet.endorsements.length - 1}} others endorsed</p>
      <p v-else>{{freet.endorsements.length}} endorsed</p>
      <p v-if="freet.denouncements.length > 2">{{freet.denouncements[0]}} and {{freet.denouncements.length - 1}} others denounced</p>
      <p v-else>{{freet.denouncements.length}} denounced</p>
    </div>
    <div v-if="freet.fact">
      <button @click="endorseFreet" v-if="!freet.endorsements.includes($store.state.username)">
          Endorse
      </button>
      <button @click="unendorseFreet" v-else="freet.endorsements.includes($store.state.username)">
          Unendorse
      </button>
      <button @click="denounceFreet" v-if="!freet.denouncements.includes($store.state.username)">
          Denounce
      </button>
      <button @click="undenounceFreet" v-else="freet.denouncements.includes($store.state.username)">
          Undenounce
      </button>
    </div>
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
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    endorseFreet() {
      /**
       * Endorses this freet.
       */
      const params = {
        method: 'PATCH',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully endorsed freet!', status: 'success'
          });
        }
      };
      this.requestEndorse(params, "endorsements");
    },
    denounceFreet() {
      /**
       * Denounces this freet.
       */
      const params = {
        method: 'PATCH',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully endorsed freet!', status: 'success'
          });
        }
      };
      this.requestEndorse(params, "denouncements");
    },
    unendorseFreet() {
      /**
       * Unendorses this freet.
       */
      const params = {
        method: 'PATCH',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully endorsed freet!', status: 'success'
          });
        }
      };
      this.requestEndorse(params, "unendorsements");
    },
    undenounceFreet() {
      /**
       * Undenounces this freet.
       */
      const params = {
        method: 'PATCH',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully endorsed freet!', status: 'success'
          });
        }
      };
      this.requestEndorse(params, "undenouncements");
    },
    followUser() {
      /**
       * Follows this user.
       */
      const params = {
        method: 'PATCH',
        body: JSON.stringify({following: this.freet.author}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully followed user!', status: 'success'
          });
        }
      };
      this.requestFollow(params);
    },
    unfollowUser() {
      /**
       * Unfollows this user.
       */
      const params = {
        method: 'DELETE',
        body: JSON.stringify({following: this.freet.author}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully unfollowed user!', status: 'success'
          });
        }
      };
      this.requestFollow(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async requestEndorse(params, route) {
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
        const r = await fetch('/api/freets/'+route, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async requestFollow(params) {
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

        this.editing = false;
        this.$store.commit('refreshFollow');

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
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
