# MakerBit

[![Build Status](https://travis-ci.org/1010Technologies/pxt-makerbit.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit)

The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components. This is a package for Microsoft Makecode.

http://makerbit.com/

| ![MakerBit](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit.png "MakerBit") | ![MakerBit+R](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit+R.png "MakerBit+R")  |
|:--:|:--:|
| *MakerBit* | *MakerBit+R with motor controller* |



## Motors
The MakerBit board provides a motor controller that can control two bi-directional DC motors, or four one-direction motors.

### MakerBit runMotor
Sets the speed of a motor in the range of -100 to 100.
```sig
makerbit.runMotor(makerbit.Motor.A, 80)
```

### MakerBit stopMotor
Stops a motor.
```sig
makerbit.stopMotor(makerbit.Motor.A)
```

### MakerBit setMotorDirection
Sets the direction of a motor. Use this function at start time to configure your motors without the need to rewire.
```sig
makerbit.setMotorDirection(makerbit.Motor.A, makerbit.MotorDirection.Reverse)
```


## Touch
MakerBit offers built-in support for up to 12 touch sensors via the proximity capacitive touch sensor controller MPR121.

### MakerBit isTouchDetected
Returns true if a specific touch sensor is touched. False otherwise.
```sig
makerbit.isTouchDetected(makerbit.TouchSensor.T1)
```

### MakerBit onTouchDetected
Do something when a touch event is detected.
```sig
makerbit.onTouchDetected(makerbit.TouchSensor.T5, () => {})
```


## Serial MP3
This module includes support for external Serial MP3 devices that are based on the YX5300 chip.

## Ultrasonic
Attach an external HC-SR04 ultrasonic distance sensor to steer your robots.

### MakerBit getUltrasonicDistance
Measures the distance and returns the result in a range from 1 to 300 centimeters or up to 118 inch. The maximum value is returned to indicate when no object was detected.
```sig
makerbit.getUltrasonicDistance(makerbit.DistanceUnit.CM, makerbit.Pin.P5, makerbit.Pin.P8)
```

### Ultrasonic Example: Distance Graph
```blocks
basic.forever(() => {
    let distance = makerbit.getUltrasonicDistance(makerbit.DistanceUnit.CM, makerbit.Pin.P5, makerbit.Pin.P8)
    led.plotBarGraph(distance, 0)
})
```


## LCD
Use an I2C LCD 1602 to display numbers and text.

### MakerBit showStringOnLcd
Displays a string on the LCD at a given position. The text is wrapped automatically at line end.
```sig
makerbit.showStringOnLcd("Hello world", 1, 1)
```

### MakerBit showNumberOnLcd
Displays a number on the LCD at a given position. The number is wrapped automatically at line end.
```sig
makerbit.showNumberOnLcd(42, 2, 1)
```

### MakerBit clearLcd
Clears the LCD completely.
```sig
makerbit.clearLcd()
```

### MakerBit setLcdBacklight
Enables or disables the backlight of the LCD.
```sig
makerbit.setLcdBacklight(makerbit.LcdBacklight.On)
```

### MakerBit connectLcd
Connects to the LCD at a given I2C address.
```sig
makerbit.connectLcd(39
```

### LCD Example: Distance Graph
```blocks
makerbit.connectLcd(39)
makerbit.setLcdBacklight(makerbit.LcdBacklight.Off)
makerbit.showStringOnLcd("MakerBit", 1, 1)
makerbit.showNumberOnLcd(42, 2, 1)
basic.pause(2000)
makerbit.clearLcd()
```

## License

MIT

## Supported targets

* for PXT/microbit
