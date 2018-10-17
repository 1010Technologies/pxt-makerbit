// MakerBit helper blocks
namespace makerbit {

    export const enum PinLevel {
        //% block="high"
        High = 1,
        //% block="low"
        Low = 0
    }

    /**
     * Sets all LED pins to either on or off.
     * The pins 5 to 16 are MakerBit LED pins.
     * @param level digital pin level, either 0 or 1
     */
    //% blockId="makerbit_helper_set_led_pins"
    //% block="set all LED pins to %level=makerbit_helper_level"
    //% weight=90
    export function setLedPins(level: number): void {
        for (let i = 5; i <= 16; i++) {
            setDigitalPin(i, level)
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
        pins.digitalWritePin(name + DigitalPin.P0, level)
    }

    /**
      * Sets an analog pin to a given level.
      * Configures this pin as an analog/pwm output, and change the output value to the given level
      * with the duty cycle proportional to the provided value.
      * The value is a number between 0 (0% duty cycle) and 1023 (100% duty).
      * @param name name of the pin in the range from 0 to 20, eg: 5
      * @param level value in the range from 0 to 1023 eg: 1023
      */
    //% blockId="makerbit_helper_set_analog_pin"
    //% block="set analog pin %pin | to %level"
    //% name.min=0 name.max=20
    //% level.min=0 level.max=1023
    //% weight=88
    export function setAnalogPin(name: number, level: number): void {
        pins.analogWritePin(name + AnalogPin.P0, level)
    }

    /**
     * Turns a digital pin level into a number.
     * @param level the pin level, eg: makerbit.PinLevel.High
     */
    //% weight=49
    //% blockId=makerbit_helper_level
    //% block="level %level"
    export function level(level?: PinLevel): number {
        if (level === undefined) return PinLevel.High
        return level
    }
}
