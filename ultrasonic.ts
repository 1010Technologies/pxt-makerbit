// MakerBit blocks supporting a HC-SR04 ultrasonic distance sensor

const enum DistanceUnit {
    //% block="cm"
    CM = 58,       // Duration of echo round-trip in Microseconds (uS) for two centimeters, 343 m/s at sea level and 20°C
    //% block="inch"
    INCH = 148     // Duration of echo round-trip in Microseconds (uS) for two inches, 343 m/s at sea level and 20°C
}

namespace makerbit {

    const MAX_ULTRASONIC_TRAVEL_TIME = 300 * DistanceUnit.CM

    /**
     * Measures the distance and returns the result in a range from 1 to 300 centimeters or up to 118 inch.
     * The maximum value is returned to indicate when no object was detected.
     * @param unit unit of distance, eg: DistanceUnit.CM
     * @param trig pin connected to trig, eg: MakerBitPin.P5
     * @param echo Pin connected to echo, eg: MakerBitPin.P8
     */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_distance" block="ultrasonic distance in %unit | with Trig at %trig | and Echo at %echo"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=3
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=3
    //% echo.fieldOptions.tooltips="false"
    //% weight=45
    export function getUltrasonicDistance(unit: DistanceUnit, trig: MakerBitPin, echo: MakerBitPin): number {
        const travelTime = medianTravelTime(() => ping(trig, echo))
        return Math.idiv(travelTime, unit)
    }

    function medianTravelTime(measure: () => number) {
        const travelTimes: number[] = []

        for (let i = 0; i < 3; i++) {
            basic.pause(25) // wait for echos to disappear
            const travelTime = measure()
            if (travelTime > 0) {
                travelTimes.push(travelTime)
            }
        }

        travelTimes.sort()

        return travelTimes.length > 0
            ? travelTimes[travelTimes.length >> 1]
            : MAX_ULTRASONIC_TRAVEL_TIME
    }

    function ping(trig: MakerBitPin, echo: MakerBitPin): number {
        // Reset trigger pin
        pins.setPull(trig as number, PinPullMode.PullNone)
        pins.digitalWritePin(trig as number, 0)
        control.waitMicros(2)

        // Trigger pulse
        pins.digitalWritePin(trig as number, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trig as number, 0)

        // Measure travel time of echo
        return pins.pulseIn(echo as number, PulseValue.High, MAX_ULTRASONIC_TRAVEL_TIME)
    }
}
