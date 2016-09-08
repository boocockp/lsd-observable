LSD Observable
==============

Provides an extremely lightweight mechanism for simply publishing and observing *events* and *values*, 
without the overhead of a full reactive programming library.  It does not provide any functions for
filtering or transforming the events or values.

## Classes

### ObservableValue

This class is intended for values held in one object that need to be copied into another.
It holds a value that can be set and read at any time with the `value` property.  
You can add listener callbacks with the `sendTo` method.
Listeners receive the current value as soon as they subscribe.

It is a little like a Subject in [Rx](https://github.com/Reactive-Extensions/RxJS).

### ObservableEvent
This class is intended for events that need to be sent when they occur to another object to act on.
You can send events with the `send` method
You can add listener callbacks with the `sendTo` method.
Listeners do not receive any value when they subscribe - only when the next event is sent.
There is also a convenience method `sendFlatTo` that expands arrays or collection objects passed to `send` 
and sends each element to the listeners separately.  
There is no `value` property but a `latestEvent` property is provided for debugging and testing.

It is a little like an ordinary Observable in [Rx](https://github.com/Reactive-Extensions/RxJS).

### Util

Utility functions:

- `bindFunctions`: binds all the public functions  in an object (names not starting with _) to `this` 
   so that they can easily be used as listeners for the observable classes



