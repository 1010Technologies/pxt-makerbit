/**
 * Motor tests 
 */

makerbit.runMotor(makerbit.Motor.A, 80)
makerbit.stopMotor(makerbit.Motor.A)

makerbit.runMotor(makerbit.Motor.B, -50)
makerbit.stopMotor(makerbit.Motor.B)


/**
 * Serial MP3 tests 
 */

makerbit.connectSerialMp3(makerbit.MakerBitPin.A0, makerbit.MakerBitPin.A1)

makerbit.playMp3Track(1, makerbit.Repeat.Once)
makerbit.playMp3Track(1, makerbit.Repeat.Repeatedly)
makerbit.playMp3TrackFromFolder(1, 1, makerbit.Repeat.Once)
makerbit.playMp3TrackFromFolder(1, 1, makerbit.Repeat.Repeatedly)
makerbit.playMp3Folder(1, makerbit.Repeat.Once)
makerbit.playMp3Folder(1, makerbit.Repeat.Repeatedly)
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

makerbit.onPlaybackCompleted(() => {})


/**
 * Touch tests 
 */

makerbit.isElectrodeTouched(makerbit.MakerBitTouchElectrode.T5)
makerbit.isElectrodeTouched(makerbit.MakerBitTouchElectrode.T16)
makerbit.onElectrodeTouched(makerbit.MakerBitTouchElectrode.T6, () => {})
