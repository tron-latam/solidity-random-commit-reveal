import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import NumbersList from '@/components/NumbersList.vue';

describe('NumbersList.vue', () => {
  it('should mount', () => {
    const wrapper = shallowMount(NumbersList);
    expect(wrapper.exists()).to.equal(true);
  });
});
