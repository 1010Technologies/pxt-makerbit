// MakerBit blocks supporting a I2C LCD 1602
namespace makerbit {

    enum Lcd {
        Command = 0,
        Data = 1
    }

    export enum LcdBacklight {
        //% block="off"
        Off = 0,
        //% block="on"
        On = 8
    }

    let lcdAddr = 39
    let isLcdInitialized = false
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
        let a: number

        a = 0x80

        if (line > 1) {
            a = 0xC0
        }

        if (column < 1) {
            column = 1
        }

        a += column - 1

        sendCommand(a)
    }

    /**
     * Displays a string on the LCD at a given position.
     * @param text the text to show, eg: "MakerBit"
     * @param line the LCD line, [1 - 2], eg: 1
     * @param column the LCD column, [1 - 16], eg: 1
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_show_string" block="show LCD string %text|in line %x| at column %column"
    //% line.min=1 line.max=2
    //% column.min=1 column.max=16
    //% weight=90
    export function showStringOnLcd(text: string, line: number, column: number): void {

        setCursor(line, column)
        const MAX_COLUMN = 16

        for (let i = 0; i < text.length; i++) {
            sendData(text.charCodeAt(i))
            if (line === 1 && column + i === MAX_COLUMN) {
                // simulate carriage return
                setCursor(2, 1)
            }
        }
    }

    /**
     * Displays a number on the LCD at a given position.
     * @param value the number to show
     * @param line the LCD line, [1 - 2], eg: 1
     * @param column the LCD column, [1 - 16], eg: 1
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_show_number" block="show LCD number %value|in line %x| at column %column"
    //% line.min=1 line.max=2
    //% column.min=1 column.max=16
    //% weight=89
    export function showNumberOnLcd(value: number, line: number, column: number): void {
        showStringOnLcd(value.toString(), line, column)
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
