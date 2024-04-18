# Packeta.ts

Packeta.ts is an alternative frontend library for the packeta delivery platform

It is written in typescript with the types ported directly from the [packeta documentation](https://docs.packetery.com/index.html)

## Usage

The usage is the same as the [original library](https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html)
with a few changes

## 1. Packeta initialization

Previously to use packeta you just included the library script in your html and it automatically mounted it self to the window object.

This library on the other side is written as an es6 module.

Example:
How to create a new packeta instance:
```ts
import Packeta from 'your/path/to/this/lib/packeta.ts';

// Init packeta
const packeta = new Packeta('your-api-key');
```

## 2. Widget creation

To create a new widget you call the `openWidget` function on your packeta instance

Example:
How to create a new widget for choosing a __pickup point__
```ts
import Packeta from 'your/path/to/this/lib/packeta.ts';
import { PacketaPoint } from 'your/path/to/this/lib/types.ts'

// Init packeta
const packeta = new Packeta('your-api-key');

// Callback that gets called when the user selects a pickup point
function onPickupPointSelected(point: PacketaPoint) {
    console.log("Selected point", point);
}

// Options can be empty because pickup point is the default
// All possible options are in types.ts under PacketaWidgetOptions type
packeta.openWidget({}, onPickupPointSelected);

// Widget closes automatically when the user clicks on the cross in the right corner, outside the popup, selects a pickup point or presses the escape key

```

Example:
How to create a new widget for choosing a __delivery address__ (packeta home delivery)
```ts
import Packeta from 'your/path/to/this/lib/packeta.ts';
import { PacketaAddress } from 'your/path/to/this/lib/types.ts'

// Init packeta
const packeta = new Packeta('your-api-key');

// Callback that gets called when the user selects a delivery address
function onDeliveryAddressSelected(adress: PacketaAddress) {
    console.log('Selected adress:', adress);
}

// I have created the 'custom' property to simplify some things in the original options object
// For example if you wanted to get the home delivery popup you had to set layout to 'hd' which I found unintuitive
// Also standard property carrierId is required for home delivery widgets as stated in the docs https://docs.packetery.com/07-home-delivery/01-impl-man.html#toc-hd-options
packeta.openWidget({ custom: {widgetType: 'homeDelivery'}, carrierId: '80' }, onDeliveryAddressSelected);

// Widget closes automatically when the user clicks on the cross in the right corner, outside the popup, selects a delivery address or presses the escape key
```

## 3. Closing the widget
The packeta instance has a `closeWidget` method which closes the widget

<hr>

Apart from the custom extension of the options object the object stays the same and should support all properties specified in the documentation

If you don't want this library to take up two files you can just replace the imports in packeta.ts with the type definitions them selfs