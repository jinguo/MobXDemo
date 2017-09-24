import { observable, computed, autorun } from 'mobx';

export default function demo2() {
  const value = observable(0);

  const condition = computed(() => (value.get() >= 0));

  autorun(() => {
    console.log(`condition is: ${condition.get()}`);
  });

  value.set(2);
  value.set(8);
  value.set(-3);
}