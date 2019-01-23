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
 * LCD tests
 */

makerbit.connectLcd(39);
makerbit.showStringOnLcd("Hello world", 0, 15);
makerbit.showNumberOnLcd(42, 16, 2);
makerbit.clearLcd();
makerbit.setLcdBacklight(LcdBacklight.On);
const pos: number = makerbit.position(LcdPosition.P0);
const isLcdConnected: boolean = makerbit.isLcdConnected();

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
