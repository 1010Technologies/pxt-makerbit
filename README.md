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

## LCD

Use an I2C LCD 1602 to display numbers and text.

### LCD Example

```blocks
makerbit.connectLcd(39)
makerbit.setLcdBacklight(LcdBacklight.Off)
makerbit.showStringOnLcd("MakerBit", 0)
makerbit.showNumberOnLcd(42, 16)
basic.pause(2000)
makerbit.clearLcd()
```

### MakerBit connectLcd

Connects to the LCD at a given I2C address.

```sig
makerbit.connectLcd(39)
```

### MakerBit showStringOnLcd

Displays a string on the LCD at a given position. The text is wrapped automatically at line end.

```sig
makerbit.showStringOnLcd("Hello world", 0)
```

### MakerBit showNumberOnLcd

Displays a number on the LCD at a given position. The number is wrapped automatically at line end.

```sig
makerbit.showNumberOnLcd(42, 16)
```

### MakerBit clearLcd

Clears the LCD completely.

```sig
makerbit.clearLcd()
```

### MakerBit setLcdBacklight

Enables or disables the backlight of the LCD.

```sig
makerbit.setLcdBacklight(LcdBacklight.On)
```

### MakerBit position

Turns a LCD position value into a number.

```sig
makerbit.position(LcdPosition.P16)
```

## License

MIT

## Supported targets

- for PXT/microbit
