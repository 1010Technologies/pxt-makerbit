// MakerBit blocks supporting a HC-SR04 ultrasonic distance sensor

namespace makerbit {

    export enum DistanceUnit {
        //% block="cm"
        CM = 10000,
        //% block="inch"
        INCH = 25400
    }

    /**
     * Measures the distance and returns the result in a range from 1 to 300 centimeters or up to 118 inch. The maximum value is returned to indicate when no object was detected.
     * @param unit unit of distance, eg: makerbit.DistanceUnit.Cm
     * @param trig pin connected to trig, eg: makerbit.MakerBitPin.P5
     * @param echo Pin connected to echo, eg: makerbit.MakerBitPin.P8
     */
    //% subcategory="Ultrasonic"
    //% blockExternalInputs=1
    //% blockId="makerbit_ultrasonic_distance" block="ultrasonic distance in %unit | trig %trig | echo %echo"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=3
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=3
    //% echo.fieldOptions.tooltips="false"
    //% weight=45
    export function getUltrasonicDistance(unit: DistanceUnit, trig: MakerBitPin, echo: MakerBitPin): number {
        const trigPinNumber: number = trig
        const echoPinNumber: number = echo
        
        const MAX_DIST_MICROMETER = 3000 * 1000
        const VELOCITY_OF_SOUND = 343  // 343 m/s at sea level and 20°C
        const MAX_PULSE_DURATION_US = (2 * MAX_DIST_MICROMETER) / VELOCITY_OF_SOUND
        
        // Trigger pulse
        pins.setPull(trigPinNumber, PinPullMode.PullNone)
        pins.digitalWritePin(trigPinNumber, 0)
        control.waitMicros(2)
        pins.digitalWritePin(trigPinNumber, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trigPinNumber, 0)

        // Receive echo
        const pulseDuration = pins.pulseIn(echoPinNumber, PulseValue.High, MAX_PULSE_DURATION_US)
        let objectDistance = (pulseDuration * VELOCITY_OF_SOUND) / 2

        // Map timeouts to max distance and clip at max distance
        if (objectDistance === 0 || objectDistance > MAX_DIST_MICROMETER) {
            objectDistance = MAX_DIST_MICROMETER
        }

        return objectDistance / unit
    }

 }
