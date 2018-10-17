// MakerBit blocks supporting a I2C LCD 1602
namespace makerbit {

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

    const enum Lcd {
        Command = 0,
        Data = 1
    }

    const LcdRows = 2
    const LcdColumns = 16

    interface LcdState {
        i2cAddress: number
        backlight: LcdBacklight
        characters: Buffer
        cursor: number
    }

    let lcdState: LcdState = undefined

    // Write 4 bits (high nibble) to I2C bus
    function write4bits(value: number) {
        if (!lcdState) {
            return
        }
        pins.i2cWriteNumber(lcdState.i2cAddress, value, NumberFormat.Int8LE)
        pins.i2cWriteNumber(lcdState.i2cAddress, value | 0x04, NumberFormat.Int8LE)
        control.waitMicros(1)
        pins.i2cWriteNumber(lcdState.i2cAddress, value & (0xFF ^ 0x04), NumberFormat.Int8LE)
        control.waitMicros(50)
    }

    // Send high and low nibble
    function send(RS_bit: number, payload: number) {
        if (!lcdState) {
            return
        }
        const highnib = payload & 0xF0
        write4bits(highnib | lcdState.backlight | RS_bit)
        const lownib = (payload << 4) & 0xF0
        write4bits(lownib | lcdState.backlight | RS_bit)
    }

    // Send command
    function sendCommand(command: number) {
        send(Lcd.Command, command)
    }

    // Send data
    function sendData(data: number) {
        send(Lcd.Data, data)
    }

    // Set cursor
    function setCursor(line: number, column: number) {
        sendCommand((line === 0 ? 0x80 : 0xC0) + column)
    }

    /**
     * Displays a text on the LCD in the given position range.
     * The text will be cropped if it is longer than the provided range.
     * If there is space left, it will be filled with whitespaces.
     *
     * @param text the text to show, eg: "MakerBit"
     * @param startPosition the start position on the LCD, [0 - 31]
     * @param endPosition the end position on the LCD, [0 - 31]
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_show_string"
    //% block="show LCD string %text| from %startPosition=makerbit_lcd_position | to %endPosition=makerbit_lcd_position"
    //% weight=90
    export function showStringOnLcd(text: string, startPosition: number, endPosition: number): void {
        const whitespace = ' '.charCodeAt(0)

        for (let textPosition = 0; startPosition + textPosition <= endPosition; textPosition++) {
            let character = text.charCodeAt(textPosition)

            if (textPosition >= text.length) {
                character = whitespace
            }

            updateCharacterIfRequired(character, startPosition + textPosition)
        }
    }

    function updateCharacterIfRequired(character: number, position: number): void {
        if (position < 0 || position >= LcdRows * LcdColumns) {
            return
        }

        if (lcdState.characters[position] != character) {
            lcdState.characters[position] = character

            if (lcdState.cursor !== position || (lcdState.cursor % LcdColumns) === 0) {
                setCursor(Math.idiv(position, LcdColumns), position % LcdColumns)
            }

            sendData(character)
            lcdState.cursor = position + 1
        }
    }

    /**
     * Displays a number on the LCD in the given position range.
     * If the number needs more space than the range provides, it will be cropped.
     * If there is space left, it will be filled with whitespaces.
     *
     * @param value the number to show
     * @param startPosition the start position on the LCD, [0 - 31]
     * @param endPosition the end position on the LCD, [0 - 31]
       */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_show_number"
    //% block="show LCD number %value| from %startPosition=makerbit_lcd_position | to %endPosition=makerbit_lcd_position"
    //% weight=89
    export function showNumberOnLcd(value: number, startPosition: number, endPosition: number): void {
        showStringOnLcd(value.toString(), startPosition, endPosition)
    }

    /**
     * Turns a LCD position value into a number.
     * @param position the LCD position, eg: makerbit.LcdPosition.P0
     */
    //% weight=49
    //% blockId=makerbit_lcd_position
    //% block="pos %position"
    //% position.fieldEditor="gridpicker" position.fieldOptions.columns=16
    //% position.fieldOptions.tooltips="false"
    //% subcategory="LCD"
    export function position(position?: LcdPosition): number {
        if (position === undefined) return 0
        return position
    }

    /**
     * Clears the LCD completely.
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_clear" block="clear LCD"
    //% weight=80
    export function clearLcd(): void {
        showStringOnLcd('', 0, 31)
    }

    /**
     * Enables or disables the backlight of the LCD.
     * @param backlight new state of backlight, eg: makerbit.LcdBacklight.Off
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_backlight" block="switch LCD backlight %backlight"
    //% weight=79
    export function setLcdBacklight(backlight: LcdBacklight): void {
        if (!lcdState) {
            return
        }
        lcdState.backlight = backlight
        send(Lcd.Command, 0)
    }

    /**
     * Connects to the LCD at a given I2C address.
     * The addresses 39 (PCF8574) or 63 (PCF8574A) seem to be widely used.
     * @param i2cAddress I2C address of LCD in the range from 0 to 127, eg: 39
     */
    //% subcategory="LCD"
    //% blockId="makerbit_lcd_set_address" block="connect LCD at I2C address %i2cAddress"
    //% i2cAddress.min=0 i2cAddress.max=127
    //% weight=95
    export function connectLcd(i2cAddress: number): void {
        lcdState = {
            i2cAddress: i2cAddress,
            backlight: LcdBacklight.On,
            characters: pins.createBuffer(LcdRows * LcdColumns),
            cursor: -1
        }

        // Wait 50ms before sending first command to device after being powered on
        basic.pause(50)

        // Pull both RS and R/W low to begin commands
        pins.i2cWriteNumber(lcdState.i2cAddress, lcdState.backlight, NumberFormat.Int8LE)
        basic.pause(50)

        // Set 4bit mode
        write4bits(0x30)
        control.waitMicros(4100)
        write4bits(0x30)
        control.waitMicros(4100)
        write4bits(0x30)
        control.waitMicros(4100)
        write4bits(0x20)
        control.waitMicros(1000)

        // Configure function set
        const LCD_FUNCTIONSET = 0x20
        const LCD_4BITMODE = 0x00
        const LCD_2LINE = 0x08
        const LCD_5x8DOTS = 0x00
        send(Lcd.Command, LCD_FUNCTIONSET | LCD_4BITMODE | LCD_2LINE | LCD_5x8DOTS)
        control.waitMicros(1000)

        // Configure display
        const LCD_DISPLAYCONTROL = 0x08
        const LCD_DISPLAYON = 0x04
        const LCD_CURSOROFF = 0x00
        const LCD_BLINKOFF = 0x00
        send(Lcd.Command, LCD_DISPLAYCONTROL | LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF)
        control.waitMicros(1000)

        // Set the entry mode
        const LCD_ENTRYMODESET = 0x04
        const LCD_ENTRYLEFT = 0x02
        const LCD_ENTRYSHIFTDECREMENT = 0x00
        send(Lcd.Command, LCD_ENTRYMODESET | LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT)
        control.waitMicros(1000)

        // Clear display and buffer
        const whitespace = 'x'.charCodeAt(0)
        for (let pos = 0; pos < LcdRows * LcdColumns; pos++) {
            lcdState.characters[pos] = whitespace
        }
        clearLcd()
    }
}
