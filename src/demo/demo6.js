import { ObservableMap, autorun } from 'mobx';

export default function demo6() {
  const foo = new ObservableMap({});
  autorun(() => {
    console.log(`map have ${foo.size} keys`);
  });

  foo.set('foo', 1);
  foo.set('bar', 1);
  foo.set('foo', 2);
  foo.delete('bar');
}