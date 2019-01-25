/**
 * Helper tests
 */

makerbit.setLedPins(0);
makerbit.setDigitalPin(5, 1);
makerbit.setAnalogPin(5, 1023);
let level: number = makerbit.level(PinLevel.High);

/**
 * Ultrasonic tests
 */

const distance: number = makerbit.getUltrasonicDistance(
  DistanceUnit.CM,
  MakerBitPin.P5,
  MakerBitPin.P8
);

/**
 * IR tests
 */

makerbit.connectInfrared(MakerBitPin.A0);
makerbit.onIrButtonPressed(IrButton.Ok, () => {});
makerbit.onIrButtonReleased(IrButton.Up, () => {});
makerbit.isIrButtonPressed(IrButton.Number_0);
makerbit.onIrCommandReceived(() => {});
makerbit.onIrCommandExpired(() => {});
const command: number = makerbit.irCommandCode();
const button: number = makerbit.irButton(IrButton.Number_9);
