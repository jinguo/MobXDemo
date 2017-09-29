## MobX 从入门到修行靠个人

### 介绍

MobX 是一个经过战火洗礼的库，它通过透明的函数响应式编程使得状态管理变得简单和可扩展。MobX 背后的哲学很简单:

*任何源自应用状态的东西都应该自动地获得。*

其中包括 UI、数据序列化、服务器通讯，等等。

![flow](/Users/zkw/Desktop/flow.png)

### 实战

接下去我们将通过几个简单的小例子来认识一下 MobX，这个用 react + mobx 写的 demo 我放在 GitHub 上，地址：https://github.com/JangGwa/MobXDem

#### 一、初识 observable 与 autorun

```javascript
import { observable, autorun } from 'mobx';

export default function demo1() {
  const value = observable(0);

  autorun(() => {
    console.log(`Value is: ${value.get()}`);
  });

  value.set(2);
  value.set(8);
  value.set(-3);
}
================== 以下是输出 ======================
Value is: 0
Value is: 2
Value is: 8
Value is: -3
```

这是一个最简单的例子，首先我们通过这句代码 `const value = observable(0);` 来认识一下 observable 。

这句代码通过 observable 去创建了一个值 value ,默认值是0。这里值得说一下的是一旦用 observable 去创建了一个值，这个值就相当于自带了一个事件发送器，值一旦进行修改，就会发送一个事件出去。

然后我们可以看到另一个核心的 api autorun，它的中文名呢叫依赖收集。这个玩意呢比较陌生，因为在别的地方都不曾见过它的样子。autorun 其实就是一种监听的方式，可以看到在代码中 autorun 方法使用了 `value.get()`，这样就相当于对 value 进行了订阅。这里值得说一下的是 autorun 去包装过的方法这个函数只会订阅自己使用到的设为 observable 的值。

所以后面的代码中 `value.set()` 去修改，便有了相应的改变。

#### 二、认识 Computed

```javascript
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
================== 以下是输出 ======================
condition is: true
condition is: false
```

Computed 中文名叫计算属性，是一种特殊的类型，它即是观察者，也是被观察者，它最大的特性是，它的计算不是每次调用的时候发生的，而是在每次依赖的值发生改变的时候计算的，调用只是简单的返回了最后一次的计算结果。

我们从上面代码更深入的了解一下 computed。从结果中我们可以看到只输出了一个 true 和一个 false，这个 true 呢就是一开始默认传入的0所输出的 condition 值，后面 `value.set(2)` 和 `value.set(8)` 再去改变 value 的值虽然会触发 computed 方法的执行，但并不会影响 condition 的值。直到最后 `value.set(-3)` 才会使 condition 发生改变。

#### 三、走进 Observable Object

```javascript
import { observable, autorun } from 'mobx';

export default function demo3() {
  const value = observable({
    foo: 0,
    bar: 0,
    get condition() {
      return this.foo >= 0;
    },
  });

  autorun(() => {
    console.log(`value.foo is: ${value.foo}`);
  });

  autorun(() => {
    console.log(`value.condition is: ${value.condition}`);
  });

  value.foo = 2;
  value.foo = 8;
  value.foo = -3;

  value.bar = 1;
  value.bar = 2;
}
================== 以下是输出 ======================
value.foo is: 0
value.condition is: true
value.foo is: 2
value.foo is: 8
value.condition is: false
value.foo is: -3
```

这边我们通过 observable 创建了一个对象，值得说一下的是对象中的` get condition()`方法会被转换成computed 方法。

接下去我们从上面代码来更深入认识一下 observable object。从结果中我们可以看到首先输出0和 true，这是由默认值所产生的，然后 `value.foo = 2` 代码使得 value.foo 发生了改变，但 condition 的值并没有发生改变。`value.foo = 8 `也是一样，直到 `value.foo = -3` 才会使 condition 的值发生改变。然后后面的 `value.bar` 的值改变与否都不会被 autorun 所监听，因为它只会去订阅使用到的值。

#### 四、走进 Observable Array

```javascript
import { observable, computed, autorun } from 'mobx';

export default function demo4() {
  const value = observable([0]);

  autorun(() => {
    console.log(`value.length is: ${value.length}`);
  });

  autorun(() => {
    console.log(`value[0] is: ${value[0]}`);
  });

  // const first = computed(() => value[0]);
  //
  // autorun(() => {
  //   console.log(`first is: ${first.get()}`);
  // });

  value[0] = 1;
  value.push(2);
  value.push(3);

  value.splice(0, 1);
}
================== 以下是输出 ======================
value.length is: 1
value[0] is: 0
value[0] is: 1
value.length is: 1
value[0] is: 1
value.length is: 2
value[0] is: 1
value.length is: 3
value[0] is: 2
value.length is: 2
```

这边我们通过 observable 创建了一个数组，值得说一下的是我们在使用 redux 的时候对于数组的操作我们通常会去用 map 或是 split 等操作去保证数据的 immutable，但是在 mobx 中我们会直接使用 push、splice 这种直接对数组操作的方式，这样才能使 mobx 实现性能的优化。

同样我们从上面代码来更深入认识一下 observable array。整个过程我就不再详细分析了，从结果中我们可以看到尽管 value[0] 的值始终没变，但是它还是被输出了，说明数组里面的值的变化 autorun 是不去做监听的。如果我们需要对其进行优化，那就需要将其放到 computed 方法中，也就是上面注释的代码。

#### 五、Use Class

```javascript
import { observable, computed, autorun, action } from 'mobx';

class Foo {
  @observable
  selected = 0;

  @observable
  items = [];

  @computed
  get selectedItem() {
    if (this.selected >= this.items.length) {
      return null;
    }
    return this.items[this.selected];
  }

  @action
  addItem(item) {
    this.items.push(item);
  }

  @action
  removeAt(id) {
    this.items.splice(id, 1);
    if (this.selected >= id) {
      this.selected--;
    }
  }

  @action
  removeSelected() {
    this.items.splice(this.selected, 1);
  }
}

export default function demo5() {
  const foo = new Foo();
  autorun(() => {
    console.log(`Current selected is: ${foo.selectedItem}`);
  });
  foo.addItem(0);
  foo.addItem(1);
  foo.addItem(2);
  foo.addItem(3);

  foo.selected = 2;

  foo.removeSelected();

  foo.removeAt(0);
}
================== 以下是输出 ======================
Current selected is: null
Current selected is: 0
Current selected is: 2
Current selected is: 3
```

这个 demo 呢和我们的项目使用比较相像了，首先是一个类 Foo 里面有通过 observable 创建的数据和一个 computed 方法以及三个 action 方法。这边值得说的是 action 方法，前面的 demo 中多没有用到它，但其实前面的 demo 中只用使用了 observable 创建的数据就会自动去发一个 action。那这边写和不写有什么区别呢，这个 demo 正是想来说明这一点。

我们可以看到上面代码中我们首先给 foo 去添加了4个值，然后在把选定的下标指向2，再移除了当前指定的值，最后移除了第一项。按照这个流程走，输出的结果也就理所当然。接下去，我们要干一个事就是把下面代码中的@aciton 去掉

```javascript
@action
removeAt(id) {
  this.items.splice(id, 1);
  if (this.selected >= id) {
    this.selected--;
  }
}
```

大家觉着结果还会和上面的一样吗？当然不一样，一样我还讲个蛇皮怪。

```javascript
================== 以下是输出 ======================
Current selected is: null
Current selected is: 0
Current selected is: 2
Current selected is: 3
Current selected is: null
Current selected is: 3
```

我们可以看到在进行  `foo.removeAt(0)` 操作时它会发两个 action ，没有 @action 去标记它就不会觉着你是一个 action 。它会在 splice 操作后去发一个 action，输出了 null，然后 `this.selected—` 后又去发一个action。所以该写 @action 还是写。

### 总结

Mobx 想要入门上手可以说非常简单，只需要记住少量概念并可以完成许多基础业务了。但深入学习下去，也还是要接触许多概念的。例如 Modifier、Transation 等等。

不管怎样，修行靠个人，入门到此就告一段落了。