const enum Motor {
    //% block="A"
    A = 0,
    //% block="B"
    B = 1,
    //% block="A + B"
    All = 2
}

const enum MotorDirection {
    //% block="forward"
    Forward = 1,
    //% block="reverse"
    Reverse = -1
}

// MakerBit motor driver blocks
namespace makerbit {

    const motorDirections = [
        MotorDirection.Forward,
        MotorDirection.Forward
    ]

    /**
     * Sets the speed of a motor.
     * @param motor motor, eg: Motor.A
     * @param speed percentage in the range of -100 to 100, eg: 80
     */
    //% subcategory=Motors
    //% blockId="makerbit_motor_run" block="run motor %motor | at speed %speed"
    //% speed.min=-100 speed.max=100
    //% weight=90
    export function runMotor(motor: Motor, speed: number): void {
        if (speed === 0) {
            stopMotor(motor)
            return
        }

        const absSpeedPercentage = Math.min(Math.abs(speed), 100)
        const analogSpeed = pins.map(absSpeedPercentage, 0, 100, 0, 1023)

        if (motor === Motor.A || motor === Motor.All) {
            const isForward = (speed * motorDirections[Motor.A]) > 0
            pins.digitalWritePin(DigitalPin.P11, isForward ? 1 : 0)
            pins.digitalWritePin(DigitalPin.P12, isForward ? 0 : 1)
            pins.analogWritePin(AnalogPin.P13, analogSpeed)
        }

        if (motor === Motor.B || motor === Motor.All) {
            const isForward = (speed * motorDirections[Motor.B]) > 0
            pins.digitalWritePin(DigitalPin.P15, isForward ? 1 : 0)
            pins.digitalWritePin(DigitalPin.P16, isForward ? 0 : 1)
            pins.analogWritePin(AnalogPin.P14, analogSpeed)
        }
    }

    /**
     * Stops a motor.
     * @param motor motor, eg: Motor.A
     */
    //% subcategory=Motors
    //% blockId="makerbit_motor_stop" block="stop motor %motor"
    //% weight=89
    export function stopMotor(motor: Motor): void {

        if (motor === Motor.A || motor === Motor.All) {
            pins.digitalWritePin(DigitalPin.P11, 0)
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
        }

        if (motor === Motor.B || motor === Motor.All) {
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P16, 0)
            pins.digitalWritePin(DigitalPin.P14, 0)
        }
    }

    /**
     * Sets the direction of a motor.
     * @param motor motor, eg: Motor.A
     * @param direction direction of the motor, eg: MotorDirection.Forward
     */
    //% subcategory=Motors
    //% blockId=makerbit_motor_set_direction block="set motor %motor direction | to %direction"
    //% weight=88
    export function setMotorDirection(motor: Motor, direction: MotorDirection) {

        if (motor === Motor.A || motor === Motor.All) {
            motorDirections[Motor.A] = direction
        }

        if (motor === Motor.B || motor === Motor.All) {
            motorDirections[Motor.B] = direction
        }
    }
}
