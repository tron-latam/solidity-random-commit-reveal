<template>
  <div class="content">
    <div v-if="latestNumber">
      <h2>Latest number</h2>
      <h3>{{latestNumber}}</h3>
    </div>
    <h2>Random Numbers List</h2>
    <table v-if="numbers.length > 0">
      <thead>
        <tr>
          <th>Number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(number, index) in numbers" :key='index'>
          <td>{{number}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getTronWebInstance } from '@/services/tronWebUtils';

export default {
  name: 'NumbersList',
  data() {
    return {
      latestNumber: null,
      numbers: [],
      error: false,
    };
  },
  async mounted() {
    const { contract, tronWeb } = await getTronWebInstance();
    const numbers = await contract.getnumbers().call();
    const { length } = numbers;
    for (let i = 0; i < length; i += 1) {
      const bigNumber = tronWeb.toBigNumber(numbers[i]);
      const stringNumber = bigNumber.toFixed();
      this.numbers.push(stringNumber);
      if (i === length - 1) this.latestNumber = stringNumber;
    }
    contract.NewRandomNumber().watch(async (err, event) => {
      if (err) {
        // Something went wrong
      }
      if (event) {
        const { number } = event.result;
        const bigNumber = tronWeb.toBigNumber(number);
        const stringNumber = bigNumber.toFixed();
        this.numbers.push(stringNumber);
        this.latestNumber = stringNumber;
      }
    });
  },
  methods: {
  },
};
</script>

<style scoped>
table {
  margin-left:auto;
  margin-right:auto;
}
td, th {
  padding: 1em 3em;
}
</style>
