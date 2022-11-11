import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    vsprequests: [],
    isVSP: null,
    VSPs: [],
    interests: [],
    suggestedAccounts: [],
    following: [],
    followers: []
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setVSPStatus(state, status) {
      /**
       * Update VSP status to the specified status.
       * @param status the new status
       */
      state.isVSP = status;
    },
    async refreshVSPStatus(state) {
      /**
       * Update VSP status to the specified status.
       * @param status the new status
       */
       const url = 'api/users/session';
       const res = await fetch(url).then(async r => r.json());
       state.isVSP = res.user.VSP;
    },
    async refreshAccounts(state) {
      if (state.interests) {
        const url = 'api/users/recommended';
        const res = await fetch(url).then(async r => r.json());
        state.suggestedAccounts = res.users;
      }
    },
    async refreshInterests(state) {
      const url = 'api/users/session';
      const res = await fetch(url).then(async r => r.json());
      state.interests = res.user.interests;
    },
    async addInterest(state, interest) {
      const url = 'api/users/interests';
      const response = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(interest)
      });
      const url2 = 'api/users/session';
      const res = await fetch(url2).then(async r => r.json());
      state.interests = res.user.interests;
    },
    async refreshFollow(state) { // refresh both following and followers
      const url = 'api/users/session';
      const res = await fetch(url).then(async r => r.json());
      state.following = res.user.following;
      state.followers = res.user.followers;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets/homepage';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;

      if (state.username === "lola") {
        const vspurl = 'api/vsprequest/VSPs';
        const vspres = await fetch(vspurl).then(async r => r.json());
        const VSPs = vspres.vspusers;
        state.VSPs.length = 0;
        for (let user of VSPs) {
          state.VSPs.push(user.username);
        }
      }
    },
    updateVSPRequests(state, vsprequests) {
      /**
       * Update the stored requests to the provided requests
       * @param vsprequests vsprequests to store
       */
      state.vsprequests = vsprequests;
    },
    async refreshVSPRequests(state) {
      const url = 'api/vsprequest';
      const res = await fetch(url).then(async r => r.json());
      state.vsprequests = res.vsprequests;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
