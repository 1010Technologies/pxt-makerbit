// MakerBit helper blocks
namespace makerbit {

    /**
     * Sets all LED pins to either on or off.
     * The pins 5 to 16 are MakerBit LED pins.
     * @param level value of the pin level, either 0 or 1, eg: 0
     */
    //% blockId="makerbit_pins_set_all_led"
    //% block="set all LED pins to %level"
    //% level.min=0 level.max=1
    //% weight=90
    export function setAllLedPins(level: number): void {
        for (let i=5; i<=16; i++) {
            setDigitalPin(i, level)
        }
     }

     /**
      * Sets a pin to either on or off.
      * @param name name of the pin in the range from 0 to 20, eg: 5
      * @param level value of the pin level, either 0 or 1, eg: 1
      */
     //% blockId="makerbit_pins_set"
     //% block="set pin %pin | to %level"
     //% name.min=0 name.max=20
     //% level.min=0 level.max=1
     //% weight=89
     export function setDigitalPin(name: number, level: number): void {
        pins.digitalWritePin(name + DigitalPin.P0, level)
     }
}
