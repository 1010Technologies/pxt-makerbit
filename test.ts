/**
 * Helper tests
 */

makerbit.setLedPins(0);
makerbit.setDigitalPin(5, 1);
makerbit.setAnalogPin(5, 1023);
const level: number = makerbit.level(PinLevel.High);
