<template>
  <router-view />
</template>

<script>

export default {
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    }
  },
  watch: {
    isAuthenticated(newValue) {
      this.redirectUser(newValue);
    }
  },
  mounted() {
    this.redirectUser(this.isAuthenticated);
  },
  methods: {
    redirectUser(isAuthenticated) {
      if (isAuthenticated) {
        this.$router.push('/tasks');
      } else {
        this.$router.push('/');
      }
    }
  }
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  margin: 0;
  padding: 0;
}
</style>
