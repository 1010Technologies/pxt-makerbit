// MakerBit helper blocks
namespace makerbit {

    /**
     * Sets all LED pins to either on or off.
     * The pins 5 to 16 are MakerBit LED pins.
     * @param level digital pin level, either 0 or 1, eg: 0
     */
    //% blockId="makerbit_helper_set_all_led"
    //% block="set all LED pins to %level"
    //% level.min=0 level.max=1
    //% weight=90
    export function setAllLedPins(level: number): void {
        for (let i=5; i<=16; i++) {
            setDigitalPin(i, level)
        }
     }

     /**
      * Sets a digital pin to either on or off.
      * Configures this pin as a digital output (if necessary).
      * @param name name of the pin in the range from 0 to 20, eg: 5
      * @param level digital pin level, either 0 or 1, eg: 1
      */
     //% blockId="makerbit_helper_set_digital_pin"
     //% block="set digital pin %pin | to %level"
     //% name.min=0 name.max=20
     //% level.min=0 level.max=1
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
}
