/**
 * Helper tests
 */

makerbit.setLedPins(0)
makerbit.setDigitalPin(5, 1)
makerbit.setAnalogPin(5, 1023)
let level: number = makerbit.level(PinLevel.High)


/**
 * Motor tests
 */

makerbit.runMotor(Motor.A, 80)
makerbit.stopMotor(Motor.A)

makerbit.runMotor(Motor.B, -50)
makerbit.stopMotor(Motor.B)

makerbit.setMotorDirection(Motor.A, MotorDirection.Forward)
makerbit.setMotorDirection(Motor.B, MotorDirection.Reverse)


/**
 * Touch tests
 */

makerbit.onTouchSensorTouched(TouchSensor.T5, () => { })
makerbit.onTouchSensorReleased(TouchSensor.T16, () => { })
makerbit.onTouchEvent(() => { })
makerbit.onTouchEvent(({sensor, isTouched}) => { })
let touchSensor: number = makerbit.touchSensor()
let isTouched: boolean = makerbit.isTouched(TouchSensor.T5)


/**
 * Serial MP3 tests
 */

makerbit.connectSerialMp3(MakerBitPin.A0, MakerBitPin.A1)

makerbit.playMp3TrackFromFolder(1, 1, Mp3Repeat.No)
makerbit.playMp3TrackFromFolder(1, 1, Mp3Repeat.Forever)
makerbit.playMp3Folder(1, Mp3Repeat.No)
makerbit.playMp3Folder(1, Mp3Repeat.Forever)
makerbit.setMp3Volume(30)

makerbit.runMp3Command(Mp3Command.PLAY_NEXT_TRACK)
makerbit.runMp3Command(Mp3Command.PLAY_PREVIOUS_TRACK)
makerbit.runMp3Command(Mp3Command.INCREASE_VOLUME)
makerbit.runMp3Command(Mp3Command.DECREASE_VOLUME)
makerbit.runMp3Command(Mp3Command.PAUSE)
makerbit.runMp3Command(Mp3Command.RESUME)
makerbit.runMp3Command(Mp3Command.STOP)
makerbit.runMp3Command(Mp3Command.MUTE)
makerbit.runMp3Command(Mp3Command.UNMUTE)

makerbit.onMp3TrackStarted(() => { })
makerbit.onMp3TrackCompleted(() => { })
const folder: number = makerbit.mp3Folder()
const track: number = makerbit.mp3Track()
const volume: number = makerbit.mp3Volume()


/**
 * Ultrasonic tests
 */

const distance: number = makerbit.getUltrasonicDistance(DistanceUnit.CM, MakerBitPin.P5, MakerBitPin.P8)


/**
 * LCD tests
 */

makerbit.connectLcd(39)
makerbit.showStringOnLcd("Hello world", 0, 15)
makerbit.showNumberOnLcd(42, 16, 2)
makerbit.clearLcd()
makerbit.setLcdBacklight(LcdBacklight.On)
let pos: number = makerbit.position(LcdPosition.P0)
