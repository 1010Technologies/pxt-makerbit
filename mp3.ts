// MakerBit Serial MP3 blocks supporting Catalex Serial MP3 1.0
namespace makerbit {

    export enum Repeat {
        //% block="once"
        Once = 0,
        //% block="repeatedly"
        Repeatedly = 1,
    }

    export enum Command {
        PLAY_NEXT_TRACK,
        PLAY_PREVIOUS_TRACK,
        INCREASE_VOLUME,
        DECREASE_VOLUME,
        PAUSE,
        RESUME,
        STOP,
        MUTE,
        UNMUTE,
    }

	/**
	 * Connect to serial MP3 device with chip YX5300.
     * @param mp3Tx MP3 device transmitter pin (TX), eg: SerialPin.P0
     * @param mp3Rx MP3 device receiver pin (RX), eg: SerialPin.P1
	 */
    //% subcategory=MP3
    //% blockId="makebit_mp3_connect" block="connect to MP3 device with MP3 TX attached to %tx | and MP3 RX to %rx"
    //% weight=50
    export function connectSerialMp3(mp3Tx: SerialPin, mp3Rx: SerialPin): void {
        serial.redirect(mp3Rx, mp3Tx, BaudRate.BaudRate9600)
        basic.pause(100)
        sendCommand(YX5300.selectDeviceTfCard())
        basic.pause(500)
        sendCommand(YX5300.setVolume(30))
        sendCommand(YX5300.unmute())
    }

    /**
     * Play track.
     * @param track track index, eg:1
     * @param repeat indicates whether to repeat the track
     */
    //% subcategory=MP3
    //% blockId="makebit_mp3_play_track" block="play MP3 track %track | %repeat"
    //% track.min=1 track.max=255
    //% weight=49
    export function playMp3Track(track: number, repeat: Repeat): void {
        if (repeat === Repeat.Once) {
            sendCommand(YX5300.playTrack(track))
        } else {
            sendCommand(YX5300.repeatTrack(track))
        }
    }

    /**
     * Play track from folder.
     * @param track track index, eg:1
     * @param folder folder index, eg:1
     * @param repeat indicates whether to repeat the track
     */
    //% subcategory=MP3
    //% blockId="makebit_mp3_play_track_from_folder" block="play MP3 track %track | from folder %folder | %repeat"
    //% track.min=1 track.max=255
    //% folder.min=1 folder.max=99
    //% weight=48
    export function playMp3TrackFromFolder(track: number, folder: number, repeat: Repeat): void {
        if (repeat === Repeat.Repeatedly) {
            sendCommand(YX5300.enableRepeatModeForNextPlayCommand())
        }
        sendCommand(YX5300.playTrackFromFolder(track, folder))
    }

    /**
     * Play folder.
     * @param folder folder index, eg:1
     */
    //% subcategory=MP3
    //% blockId="makebit_mp3_play_folder" block="play MP3 folder %folder | repeatedly"
    //% folder.min=1 folder.max=99
    //% weight=47
    export function playMp3Folder(folder: number): void {
        sendCommand(YX5300.repeatFolder(folder))
    }

    /**
     * Set volume.
     * @param volume volume in the range of 0 to 30: eg: 30
     */
    //% subcategory=MP3
    //% blockId="makebit_mp3_set_volume" block="set MP3 volume to %volume"
    //% volume.min=0 volume.max=30
    //% weight=46
    export function setMp3Volume(volume: number): void {
        sendCommand(YX5300.setVolume(volume))
    }

    /**
     * Dispatches a command to the MP3 device.
     * @param command command
     */
    //% subcategory=MP3
    //% blockId="makebit_mp3_run_command" block="run MP3 command %command"
    //% weight=45
    export function runMp3Command(command: Command): void {
        switch (command) {
            case Command.PLAY_NEXT_TRACK:
                sendCommand(YX5300.next())
                break
            case Command.PLAY_PREVIOUS_TRACK:
                sendCommand(YX5300.previous())
                break
            case Command.INCREASE_VOLUME:
                sendCommand(YX5300.increaseVolume())
                break
            case Command.DECREASE_VOLUME:
                sendCommand(YX5300.decreaseVolume())
                break
            case Command.PAUSE:
                sendCommand(YX5300.pause())
                break
            case Command.RESUME:
                sendCommand(YX5300.resume())
                break
            case Command.STOP:
                sendCommand(YX5300.stop())
                break
            case Command.MUTE:
                sendCommand(YX5300.mute())
                break
            case Command.UNMUTE:
                sendCommand(YX5300.unmute())
                break
        }
    }

    function sendCommand(command: Buffer): void {
        serial.writeBuffer(command)
        basic.pause(YX5300.REQUIRED_PAUSE_BETWEEN_COMMANDS)
    }


    // YX5300 asynchronous serial port control commands
    export namespace YX5300 {

        export const REQUIRED_PAUSE_BETWEEN_COMMANDS = 100

        export enum CommandCode {
            PLAY_NEXT_TRACK = 0x01,
            PLAY_PREV_TRACK = 0x02,
            PLAY_TRACK = 0x03,
            INCREASE_VOLUME = 0x04,
            DECREASE_VOLUME = 0x05,
            SET_VOLUME = 0x06,
            REPEAT_TRACK = 0x08,
            SELECT_DEVICE = 0x09,
            RESET = 0x0C,
            RESUME = 0x0D,
            PAUSE = 0x0E,
            PLAY_TRACK_FROM_FOLDER = 0x0F,
            STOP = 0x16,
            REPEAT_FOLDER = 0x17,
            PLAY_RANDOM = 0x18,
            REPEAT_NEXT_TRACK = 0x19,
            MUTE = 0x1A
        }

        let commandBuffer: Buffer

        export function composeSerialCommand(command: CommandCode, dataHigh: number, dataLow: number): Buffer {
            if (!commandBuffer) {
                commandBuffer = pins.createBuffer(8)
                commandBuffer.setNumber(NumberFormat.UInt8LE, 0, 0x7E)
                commandBuffer.setNumber(NumberFormat.UInt8LE, 1, 0xFF)
                commandBuffer.setNumber(NumberFormat.UInt8LE, 2, 0x06)
                commandBuffer.setNumber(NumberFormat.UInt8LE, 4, 0x00)
                commandBuffer.setNumber(NumberFormat.UInt8LE, 7, 0xEF)
            }
            commandBuffer.setNumber(NumberFormat.UInt8LE, 3, command)
            commandBuffer.setNumber(NumberFormat.UInt8LE, 5, dataHigh)
            commandBuffer.setNumber(NumberFormat.UInt8LE, 6, dataLow)
            return commandBuffer
        }

        export function next(): Buffer {
            return composeSerialCommand(CommandCode.PLAY_NEXT_TRACK, 0x00, 0x00)
        }

        export function previous(): Buffer {
            return composeSerialCommand(CommandCode.PLAY_PREV_TRACK, 0x00, 0x00)
        }

        export function playTrack(track: number): Buffer {
            return composeSerialCommand(CommandCode.PLAY_TRACK, 0x00, clipTrack(track))
        }

        export function increaseVolume(): Buffer {
            return composeSerialCommand(CommandCode.INCREASE_VOLUME, 0x00, 0x00)
        }

        export function decreaseVolume(): Buffer {
            return composeSerialCommand(CommandCode.DECREASE_VOLUME, 0x00, 0x00)
        }

        export function setVolume(volume: number): Buffer {
            const clippedVolume = Math.min(Math.max(volume, 0), 30)
            return composeSerialCommand(CommandCode.SET_VOLUME, 0x00, clippedVolume)
        }

        export function repeatTrack(track: number): Buffer {
            return composeSerialCommand(CommandCode.REPEAT_TRACK, 0x00, clipTrack(track))
        }

        export function selectDeviceTfCard(): Buffer {
            return composeSerialCommand(CommandCode.SELECT_DEVICE, 0x00, 0x02)
        }

        export function resume(): Buffer {
            return composeSerialCommand(CommandCode.RESUME, 0x00, 0x00)
        }

        export function pause(): Buffer {
            return composeSerialCommand(CommandCode.PAUSE, 0x00, 0x00)
        }

        export function playTrackFromFolder(track: number, folder: number): Buffer {
            return composeSerialCommand(
                CommandCode.PLAY_TRACK_FROM_FOLDER,
                clipFolder(folder),
                clipTrack(track)
            );
        }

        export function stop(): Buffer {
            return composeSerialCommand(CommandCode.STOP, 0x00, 0x00)
        }

        export function repeatFolder(folder: number): Buffer {
            return composeSerialCommand(CommandCode.REPEAT_FOLDER, clipFolder(folder), 0x02)
        }

        export function playRandom(): Buffer {
            return composeSerialCommand(CommandCode.PLAY_RANDOM, 0x00, 0x00)
        }

        export function enableRepeatModeForNextPlayCommand(): Buffer {
            return composeSerialCommand(CommandCode.REPEAT_NEXT_TRACK, 0x00, 0x00)
        }

        export function disableRepeatMode(): Buffer {
            return composeSerialCommand(CommandCode.REPEAT_NEXT_TRACK, 0x00, 0x01)
        }

        export function mute(): Buffer {
            return composeSerialCommand(CommandCode.MUTE, 0x00, 0x01)
        }

        export function unmute(): Buffer {
            return composeSerialCommand(CommandCode.MUTE, 0x00, 0x00)
        }

        function clipTrack(track: number): number {
            return Math.min(Math.max(track, 1), 255)
        }

        function clipFolder(folder: number): number {
            return Math.min(Math.max(folder, 1), 99)
        }
    }
}
