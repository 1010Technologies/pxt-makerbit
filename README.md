# MakerBit

[![Build Status](https://travis-ci.org/1010Technologies/pxt-makerbit.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit)

The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components. This is a package for Microsoft Makecode.

http://makerbit.com/

| ![MakerBit](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit.png "MakerBit") | ![MakerBit+R](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit+R.png "MakerBit+R") |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                                            _MakerBit_                                            |                                   _MakerBit+R with motor controller_                                   |

## Ultrasonic

Attach an external HC-SR04 ultrasonic distance sensor to steer your robots.

### MakerBit getUltrasonicDistance

Measures the distance and returns the result in a range from 1 to 300 centimeters or up to 118 inch. The maximum value is returned to indicate when no object was detected.

```sig
makerbit.getUltrasonicDistance(DistanceUnit.CM, MakerBitPin.P5, MakerBitPin.P8)
```

### Ultrasonic Example: Distance Graph

```blocks
let distance = 0
basic.forever(() => {
    distance = makerbit.getUltrasonicDistance(DistanceUnit.CM, MakerBitPin.P5, MakerBitPin.P8)
    led.plotBarGraph(distance, 0)
})
```

## License

MIT

## Supported targets

- for PXT/microbit
