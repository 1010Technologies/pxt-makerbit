// MakerBit motor driver blocks 
namespace makerbit {

    export enum Motor {
        //% block="A"
        A,
        //% block="B"
        B
    }

    /**
	 * Sets the speed and direction of a motor.
     * @param motor motor, eg: makerbit.Motor.A
     * @param speed speed in the range of -100 to 100, eg: 80
	 */
    //% subcategory=Motors
    //% blockId="makebit_motor_run" block="run motor %motor | at %speed |%"
    //% speed.min=-100 speed.max=100
    //% weight=90
    export function runMotor(motor: Motor, speed: number): void {
        if (speed === 0) {
            stopMotor(motor)
            return
        }

        const forward = speed > 0
        const absSpeedPercentage = Math.min(Math.abs(speed), 100)
        const analogSpeed = pins.map(absSpeedPercentage, 0, 100, 0, 1023)

        switch (motor) {
            case Motor.A:
                pins.digitalWritePin(DigitalPin.P11, forward ? 1 : 0)
                pins.digitalWritePin(DigitalPin.P12, forward ? 0 : 1)
                pins.analogWritePin(AnalogPin.P13, analogSpeed)
                break
            case Motor.B:
                pins.digitalWritePin(DigitalPin.P15, forward ? 1 : 0)
                pins.digitalWritePin(DigitalPin.P16, forward ? 0 : 1)
                pins.analogWritePin(AnalogPin.P14, analogSpeed)
                break
        }
    }

	/**
	 * Stops a motor.
     * @param motor motor, eg: makerbit.Motor.A
	 */
    //% subcategory=Motors
    //% blockId="makebit_motor_stop" block="stop motor %motor"
    //% weight=89
    export function stopMotor(motor: Motor): void {
        switch (motor) {
            case Motor.A:
                pins.digitalWritePin(DigitalPin.P11, 0)
                pins.digitalWritePin(DigitalPin.P12, 0)
                pins.digitalWritePin(DigitalPin.P13, 0)
                break
            case Motor.B:
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
                pins.digitalWritePin(DigitalPin.P14, 0)
                break
        }
    }
}
