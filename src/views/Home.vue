<template>
  <div class="home">
    <img alt="Tron logo" src="../assets/tron-trx-logo.png" class="logo">
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <NumbersList />
  </div>
</template>

<script>
// @ is an alias to /src
import NumbersList from '@/components/NumbersList.vue';

export default {
  name: 'Home',
  components: {
    NumbersList,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  padding: 36px;
}
.logo {
  max-width: 200px;
}
</style>
