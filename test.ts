/**
 * Motor tests
 */

makerbit.runMotor(makerbit.Motor.A, 80)
makerbit.stopMotor(makerbit.Motor.A)

makerbit.runMotor(makerbit.Motor.B, -50)
makerbit.stopMotor(makerbit.Motor.B)

makerbit.setMotorDirection(makerbit.Motor.A, makerbit.MotorDirection.Forward)
makerbit.setMotorDirection(makerbit.Motor.B, makerbit.MotorDirection.Reverse)


/**
 * Touch tests
 */

let b: boolean = makerbit.isTouchDetected(makerbit.TouchSensor.T5)
makerbit.isTouchDetected(makerbit.TouchSensor.T16)
makerbit.onTouchDetected(makerbit.TouchSensor.T6, () => { })


/**
 * Serial MP3 tests
 */

makerbit.connectSerialMp3(makerbit.Pin.A0, makerbit.Pin.A1)

makerbit.playMp3TrackFromFolder(1, 1, makerbit.Play.Once)
makerbit.playMp3TrackFromFolder(1, 1, makerbit.Play.Repeatedly)
makerbit.playMp3Folder(1, makerbit.Play.Once)
makerbit.playMp3Folder(1, makerbit.Play.Repeatedly)
makerbit.setMp3Volume(30)

makerbit.runMp3Command(makerbit.Mp3Command.PLAY_NEXT_TRACK)
makerbit.runMp3Command(makerbit.Mp3Command.PLAY_PREVIOUS_TRACK)
makerbit.runMp3Command(makerbit.Mp3Command.INCREASE_VOLUME)
makerbit.runMp3Command(makerbit.Mp3Command.DECREASE_VOLUME)
makerbit.runMp3Command(makerbit.Mp3Command.PAUSE)
makerbit.runMp3Command(makerbit.Mp3Command.RESUME)
makerbit.runMp3Command(makerbit.Mp3Command.STOP)
makerbit.runMp3Command(makerbit.Mp3Command.MUTE)
makerbit.runMp3Command(makerbit.Mp3Command.UNMUTE)

makerbit.onMp3PlaybackCompleted(() => { })


/**
 * Ultrasonic tests
 */

let n: number = makerbit.getUltrasonicDistance(makerbit.DistanceUnit.CM, makerbit.Pin.P5, makerbit.Pin.P8)


/**
 * LCD tests
 */

makerbit.showStringOnLcd("Hello world", 0)
makerbit.showNumberOnLcd(42, 16)
makerbit.clearLcd()
makerbit.setLcdBacklight(makerbit.LcdBacklight.On)
makerbit.connectLcd(39)
let pos: number = makerbit.position(makerbit.LcdPosition.P0)
