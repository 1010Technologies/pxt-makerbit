/**
 * Motor tests 
 */

makerbit.runMotor(makerbit.Motor.A, 80)
makerbit.stopMotor(makerbit.Motor.A)

makerbit.runMotor(makerbit.Motor.B, -50)
makerbit.stopMotor(makerbit.Motor.B)

makerbit.setMotorDirection(makerbit.Motor.A, makerbit.MotorDirection.Forward)
makerbit.setMotorDirection(makerbit.Motor.B, makerbit.MotorDirection.Backward)

/**
 * Serial MP3 tests 
 */

makerbit.connectSerialMp3(makerbit.MakerBitPin.A0, makerbit.MakerBitPin.A1)

makerbit.playMp3Track(1, makerbit.Play.Once)
makerbit.playMp3Track(1, makerbit.Play.Repeatedly)
makerbit.playMp3TrackFromFolder(1, 1, makerbit.Play.Once)
makerbit.playMp3TrackFromFolder(1, 1, makerbit.Play.Repeatedly)
makerbit.playMp3Folder(1, makerbit.Play.Once)
makerbit.playMp3Folder(1, makerbit.Play.Repeatedly)
makerbit.setMp3Volume(30)

makerbit.runMp3Command(makerbit.Command.PLAY_NEXT_TRACK)
makerbit.runMp3Command(makerbit.Command.PLAY_PREVIOUS_TRACK)
makerbit.runMp3Command(makerbit.Command.INCREASE_VOLUME)
makerbit.runMp3Command(makerbit.Command.DECREASE_VOLUME)
makerbit.runMp3Command(makerbit.Command.PAUSE)
makerbit.runMp3Command(makerbit.Command.RESUME)
makerbit.runMp3Command(makerbit.Command.STOP)
makerbit.runMp3Command(makerbit.Command.MUTE)
makerbit.runMp3Command(makerbit.Command.UNMUTE)

makerbit.onMp3PlaybackCompleted(() => {})


/**
 * Touch tests 
 */

let b : boolean = makerbit.isTouchDetected(makerbit.MakerBitTouchSensor.T5)
makerbit.isTouchDetected(makerbit.MakerBitTouchSensor.T16)
makerbit.onTouchDetected(makerbit.MakerBitTouchSensor.T6, () => {})


/**
 * Ultrasonic tests 
 */

let n : number = makerbit.getUltrasonicDistance(makerbit.MakerBitPin.P5, makerbit.MakerBitPin.P8)


/**
 * LCD tests 
 */

makerbit.showStringOnLcd("Hello world",1,1)
makerbit.showNumberOnLcd(42, 2, 1)
makerbit.clearLcd()
makerbit.setLcdBacklight(makerbit.LcdBacklight.On)
makerbit.connectLcd(39)
