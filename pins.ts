// MakerBit core blocks

const enum MakerBitPin {
  A0 = DigitalPin.P0,
  A1 = DigitalPin.P1,
  A2 = DigitalPin.P2,
  A3 = DigitalPin.P3,
  A4 = DigitalPin.P4,
  P5 = DigitalPin.P5,
  P6 = DigitalPin.P6,
  P7 = DigitalPin.P7,
  P8 = DigitalPin.P8,
  P9 = DigitalPin.P9,
  P10 = DigitalPin.P10,
  P11 = DigitalPin.P11,
  P12 = DigitalPin.P12,
  P13 = DigitalPin.P13,
  P14 = DigitalPin.P14,
  P15 = DigitalPin.P15,
  P16 = DigitalPin.P16,
  SDL = DigitalPin.P19,
  SDA = DigitalPin.P20
}

const enum PinLevel {
  //% block="high"
  High = 1,
  //% block="low"
  Low = 0
}

namespace makerbit {
  /**
   * Sets LED pins 5 to 16 to either on or off.
   * The pins 5 to 16 are MakerBit LED pins.
   * @param level digital pin level, either 0 or 1
   */
  //% blockId="makerbit_helper_set_led_pins"
  //% block="set all LED pins to %level=makerbit_helper_level"
  //% weight=90
  export function setLedPins(level: number): void {
    for (let i = 5; i <= 16; i++) {
      setDigitalPin(i, level);
    }
  }

  /**
   * Sets a digital pin to either on or off.
   * Configures this pin as a digital output (if necessary).
   * @param name name of the pin in the range from 0 to 20, eg: 5
   * @param level digital pin level, either 0 or 1
   */
  //% blockId="makerbit_helper_set_digital_pin"
  //% block="set digital pin %pin | to %level=makerbit_helper_level"
  //% name.min=0 name.max=20
  //% weight=89
  export function setDigitalPin(name: number, level: number): void {
    if (name < 0 || name > 20) {
      return;
    }
    pins.digitalWritePin(name + DigitalPin.P0, level);
  }

  /**
   * Sets an analog pin to a given level.
   * Configures this pin as an analog/pwm output, and change the output value to the given level
   * with the duty cycle proportional to the provided value.
   * The value is a number between 0 (0% duty cycle) and 1023 (100% duty).
   * @param name name of the pin in the range from 0 to 20, eg: 0
   * @param level value in the range from 0 to 1023 eg: 1023
   */
  //% blockId="makerbit_helper_set_analog_pin"
  //% block="set analog pin %pin | to %level"
  //% name.min=0 name.max=20
  //% level.min=0 level.max=1023
  //% weight=88
  export function setAnalogPin(name: number, level: number): void {
    if (name < 0 || name > 20) {
      return;
    }
    pins.analogWritePin(name + AnalogPin.P0, level);
  }

  /**
   * Turns a digital pin level into a number.
   * @param level the pin level, eg: PinLevel.High
   */
  //% blockId=makerbit_helper_level
  //% block="%level"
  //% blockHidden=true
  export function level(level: PinLevel): number {
    return level;
  }
}
