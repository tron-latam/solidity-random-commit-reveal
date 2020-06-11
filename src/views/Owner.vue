<template>
  <div>
    <div v-if="!isOwner">
      <h2>For Owners only</h2>
    </div>
    <AddOracle  v-else />
  </div>
</template>

<script>
import { isOwner } from '@/services/tronWebUtils';
import AddOracle from '@/components/AddOracle.vue';

export default {
  name: 'Owner',
  components: {
    AddOracle,
  },
  data() {
    return {
      isOwner: false,
    };
  },
  async mounted() {
    this.isOwner = await isOwner();
  },
};
</script>
