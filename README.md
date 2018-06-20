# MakerBit

[![Build Status](https://travis-ci.org/1010Technologies/pxt-makerbit.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit)

The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components. This is a package for Microsoft Makecode.

http://makerbit.com/

## Motors
The MakerBit board provides a motor controller that can control two bi-directional DC motors.

## Touch
MakerBit offers built-in support for up to 12 touch electrodes via the proximity capacitive touch sensor controller MPR121.

## Serial MP3
This module includes support for external Serial MP3 devices that are based on the YX5300 chip.

## Ultrasonic
Attach an external HC-SR04 ultrasonic distance sensor to steer your robots.

```sig
makerbit.getUltrasonicDistance(makerbit.MakerBitPin.P5, makerbit.MakerBitPin.P8)
```

### Usage
```blocks
basic.forever(() => {
    let distance = makerbit.getUltrasonicDistance(makerbit.MakerBitPin.P5, makerbit.MakerBitPin.P8)
    led.plotBarGraph(distance, 0)
})
```

## LCD
Use an I2C LCD 1602 to display text, numbers and ASCII art.

## License

MIT

## Supported targets

* for PXT/microbit


