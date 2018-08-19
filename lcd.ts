// MakerBit blocks supporting a I2C LCD 1602
namespace makerbit {

    const enum Lcd {
        Command = 0,
        Data = 1
    }

    export const enum LcdPosition {
        //% block="0"
        P0 = 0,
        //% block="1"
        P1 = 1,
        //% block="2"
        P2 = 2,
        //% block="3"
        P3 = 3,
        //% block="4"
        P4 = 4,
        //% block="5"
        P5 = 5,
        //% block="6"
        P6 = 6,
        //% block="7"
        P7 = 7,
        //% block="8"
        P8 = 8,
        //% block="9"
        P9 = 9,
        //% block="10"
        P10 = 10,
        //% block="11"
        P11 = 11,
        //% block="12"
        P12 = 12,
        //% block="13"
        P13 = 13,
        //% block="14"
        P14 = 14,
        //% block="15"
        P15 = 15,
        //% block="16"
        P16 = 16,
        //% block="17"
        P17 = 17,
        //% block="18"
        P18 = 18,
        //% block="19"
        P19 = 19,
        //% block="20"
        P20 = 20,
        //% block="21"
        P21 = 21,
        //% block="22"
        P22 = 22,
        //% block="23"
        P23 = 23,
        //% block="24"
        P24 = 24,
        //% block="25"
        P25 = 25,
        //% block="26"
        P26 = 26,
        //% block="27"
        P27 = 27,
        //% block="28"
        P28 = 28,
        //% block="29"
        P29 = 29,
        //% block="30"
        P30 = 30,
        //% block="31"
        P31 = 31
    }

    export const enum LcdBacklight {
        //% block="off"
        Off = 0,
        //% block="on"
        On = 8
    }

    let lcdAddr: number = 0x3F
    let isLcdInitialized: boolean = false
    let lcdBacklight: LcdBacklight = LcdBacklight.On

    // Lazy intialization of the display
    function initLcdIfRequired(): void {
        if (!isLcdInitialized) {

            // set 4bit mode
            send(Lcd.Command, 0x33)
            i2cWrite(0x30)
            i2cWrite(0x20)

            // set mode
            send(Lcd.Command, 0x28)
            send(Lcd.Command, 0x0C)
            send(Lcd.Command, 0x06)

            // clear
            send(Lcd.Command, 0x01)

            isLcdInitialized = true
        }
    }

    // Send bits via I2C bus
    function i2cWrite(value: number) {
        pins.i2cWriteNumber(lcdAddr, value, NumberFormat.Int8LE)
        basic.pause(1)
        pins.i2cWriteNumber(lcdAddr, value + 4, NumberFormat.Int8LE)
        basic.pause(1)
        pins.i2cWriteNumber(lcdAddr, value, NumberFormat.Int8LE)
        basic.pause(50)
    }

    // Send data to I2C bus
    function send(RS_bit: number, payload: number) {
        const highnib = payload & 0xF0
        i2cWrite(highnib | lcdBacklight | RS_bit)
        const lownib = (payload << 4) & 0xF0
        i2cWrite(lownib | lcdBacklight | RS_bit)
    }

    // Send command
    function sendCommand(command: number) {
        initLcdIfRequired()
        send(Lcd.Command, command)
    }

    // Send data
    function sendData(data: number) {
        initLcdIfRequired()
        send(Lcd.Data, data)
    }

    // Set cursor
    function setCursor(line: number, column: number) {
        let cmd = line === 0 ? 0x80 : 0xC0
        cmd += column
        sendCommand(cmd)
    }

    /**
     * Displays a string on the LCD at a given position.
     * @param text the text to show, eg: "MakerBit"
     * @param position the position on the LCD, [0 - 31], eg: 0
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_show_string" block="show LCD string %text| at %position=lcd_position"
    //% weight=90
    export function showStringOnLcd(text: string, position: number): void {
        const COLUMNS = 16

        setCursor(Math.idiv(position, COLUMNS), position % COLUMNS)

        for (let i = 0; i < text.length; i++) {
            if (i > 0 && (position + i) % COLUMNS === 0) {
                // simulate carriage return
                setCursor(Math.idiv(position + i, COLUMNS), 0)
            }
            sendData(text.charCodeAt(i))
        }
    }

    /**
     * Displays a number on the LCD at a given position.
     * @param value the number to show
     * @param position the position on the LCD, [0 - 31], eg: 0
       */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_show_number" block="show LCD number %value| at %position=lcd_position"
    //% weight=89
    export function showNumberOnLcd(value: number, position: number): void {
        showStringOnLcd(value.toString(), position)
    }

    /**
     * Turns a LCD position value into a number.
     * @param position the LCD position
     */
    //% weight=49
    //% blockId=lcd_position block="position %position"
    //% position.fieldEditor="gridpicker" position.fieldOptions.columns=16
    //% position.fieldOptions.tooltips="false"
    //% subcategory="LCD"
    export function position(position?: LcdPosition): number {
        if (position == null) return 0
        return position
    }

    /**
     * Clears the LCD completely.
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_clear" block="clear LCD"
    //% weight=80
    export function clearLcd(): void {
        send(Lcd.Command, 0x01)
    }

    /**
     * Enables or disables the backlight of the LCD.
     * @param backlight new state of backlight, eg: makerbit.LcdBacklight.Off
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_backlight" block="switch LCD backlight %backlight"
    //% weight=79
    export function setLcdBacklight(backlight: LcdBacklight): void {
        lcdBacklight = backlight
        send(Lcd.Command, 0)
    }

    /**
     * Connects to the LCD at a given I2C address.
     * @param i2cAddress I2C address of LCD, eg: 39
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_set_address" block="connect LCD at I2C address %i2cAddress"
    //% i2cAddress.min=0 i2cAddress.max=127
    //% weight=50
    export function connectLcd(i2cAddress: number): void {
        lcdAddr = i2cAddress
        isLcdInitialized = false
        initLcdIfRequired()
    }
}
