// MakerBit motor driver blocks 
namespace makerbit {

    export enum Motor {
        //% block="A"
        A = 0,
        //% block="B"
        B = 1
    }

    export enum MotorDirection {
        //% block="forward"
        Forward = 1,
        //% block="backward"
        Backward = -1
    }

    let motorDirections = [
        MotorDirection.Forward,
        MotorDirection.Forward
    ]

    /**
	 * Sets the speed of a motor.
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

        const forward = (speed * motorDirections[motor]) > 0
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

    /**
     * Sets the direction of a motor.
     * @param motor motor, eg: makerbit.Motor.A
     * @param direction direction of the motor
     */
    //% subcategory=Motors
    //% blockId=makebit_motor_set_direction block="set motor |%motor| direction to |%direction|"
    //% weight=88
    export function setMotorDirection(motor: Motor, direction: MotorDirection) {
        motorDirections[motor] = direction
    }
}
