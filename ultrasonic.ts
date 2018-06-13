// MakerBit blocks supporting a HC-SR04 ultrasonic distance sensor

namespace makerbit {

    /**
     * Measures the distance and returns the result in millimeters from 1 to 3000.
     * @param trig Ultrasonic trig pin, eg: makerbit.MakerBitPin.P5
     * @param echo Ultrasonic echo pin, eg: makerbit.MakerBitPin.P8
     */
    //% subcategory="Ultrasonic"
    //% blockExternalInputs=1
    //% blockId="makerbit_ultrasonic_distance" block="ultrasonic distance (cm) trig %trig | echo %echo"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=3
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=3
    //% echo.fieldOptions.tooltips="false"
    //% weight=45
    export function getUltrasonicDistance(trig: MakerBitPin, echo: MakerBitPin): number {
        const trigPinNumber: number = trig
        const echoPinNumber: number = echo
        
        const MAX_DIST_MM = 3000
        const VELOCITY_OF_SOUND = 343  // 343 m/s at sea level and 20°C
        const MAX_PULSE_DURATION_US = (2 * 1000 * MAX_DIST_MM) / VELOCITY_OF_SOUND
        
        // Trigger pulse
        pins.setPull(trigPinNumber, PinPullMode.PullNone)
        pins.digitalWritePin(trigPinNumber, 0)
        control.waitMicros(2)
        pins.digitalWritePin(trigPinNumber, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trigPinNumber, 0)

        // Receive echo
        const pulseDuration = pins.pulseIn(echoPinNumber, PulseValue.High, MAX_PULSE_DURATION_US)
        let objectDistance = (pulseDuration * VELOCITY_OF_SOUND) / (2 * 1000)

        // Map timeouts to max distance and clip at max distance
        if (objectDistance === 0 || objectDistance > MAX_DIST_MM) {
            objectDistance = MAX_DIST_MM
        }

        return objectDistance
    }

 }
