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

    const MICROBIT_ID_SERIAL_MP3 = 698
    const MICROBIT_SERIAL_MP3_PLAYBACK_COMPLETED = 1

    let lastTrackCompleted = 0
    let tracksToPlay = 0

    function handleResponse(response: YX5300.Response) {

        if (response.type === YX5300.ResponseType.TRACK_COMPLETED) {
            let currentTrackCompleted = input.runningTime()

            if (currentTrackCompleted < lastTrackCompleted + 1000) {
                // At playback end we received two TRACK_COMPLETED events.
                // We use the 2nd TRACK_COMPLETED event to notify playback as complete
                // or to advance folder play.

                if (tracksToPlay > 0) {
                    tracksToPlay -= 1
                    serial.writeBuffer(YX5300.next())
                }
                else {
                    control.raiseEvent(
                        MICROBIT_ID_SERIAL_MP3,
                        MICROBIT_SERIAL_MP3_PLAYBACK_COMPLETED,
                        EventCreationMode.CreateAndFire
                    )
                }
            }

            lastTrackCompleted = currentTrackCompleted
        }
        else if (response.type === YX5300.ResponseType.FOLDER_TRACK_COUNT) {
            // Folder track count is queried for single play of folder only.
            // We fetch the track count to advance track in folder.
            tracksToPlay = response.payload - 1
        }
    }

    function readSerial() {
        let responseBuffer: Buffer = pins.createBuffer(10);
        let readBuffer: Buffer

        while (true) {
            readBuffer = serial.readBuffer(1);

            if (readBuffer.getNumber(NumberFormat.UInt8LE, 0) == YX5300.ResponseType.RESPONSE_START_BYTE) {

                responseBuffer.setNumber(NumberFormat.UInt8LE, 0, YX5300.ResponseType.RESPONSE_START_BYTE)

                for (let pos = 1; pos < 10; pos++) {
                    readBuffer = serial.readBuffer(1)
                    responseBuffer.write(pos, readBuffer)
                }

                const response = YX5300.decodeResponse(responseBuffer)

                handleResponse(response)
            }
        }
    }


	/**
	 * Connect to serial MP3 device with chip YX5300.
     * @param mp3Rx MP3 device receiver pin (RX), eg: makerbit.MakerBitPin.P5
     * @param mp3Tx MP3 device transmitter pin (TX), eg: makerbit.MakerBitPin.P8
	 */
    //% subcategory="Serial MP3"
    //% blockExternalInputs=1
    //% blockId="makebit_mp3_connect" block="connect MP3 with MP3 RX attached to %mp3Rx | and MP3 TX to %mp3Tx"
    //% mp3Rx.fieldEditor="gridpicker" mp3Rx.fieldOptions.columns=3
    //% mp3Rx.fieldOptions.tooltips="false"
    //% mp3Tx.fieldEditor="gridpicker" mp3Tx.fieldOptions.columns=3
    //% mp3Tx.fieldOptions.tooltips="false"
    //% weight=50
    export function connectSerialMp3(mp3Rx: MakerBitPin, mp3Tx: MakerBitPin): void {
        redirectSerial(mp3Rx, mp3Tx, BaudRate.BaudRate9600)
        spinWait(YX5300.REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS)
        sendCommand(YX5300.selectDeviceTfCard())
        spinWait(1500)
        sendCommand(YX5300.setVolume(30))
        sendCommand(YX5300.unmute())
        control.inBackground(readSerial)
    }

    //% shim=makerbit::redirectSerial
    export function redirectSerial(tx: number, rx: number, baud: number): void { return }

    /**
     * Play track.
     * @param track track index, eg:1
     * @param repeat indicates whether to repeat the track, eg: makerbit.Repeat.Once
     */
    //% subcategory="Serial MP3"
    //% blockId="makebit_mp3_play_track" block="play MP3 track %track | %repeat"
    //% track.min=1 track.max=255
    //% weight=49
    export function playMp3Track(track: number, repeat: Repeat): void {
        tracksToPlay = 0
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
     * @param repeat indicates whether to repeat the track, eg: makerbit.Repeat.Once
     */
    //% subcategory="Serial MP3"
    //% blockId="makebit_mp3_play_track_from_folder" block="play MP3 track %track | from folder %folder | %repeat"
    //% track.min=1 track.max=255
    //% folder.min=1 folder.max=99
    //% weight=48
    export function playMp3TrackFromFolder(track: number, folder: number, repeat: Repeat): void {
        tracksToPlay = 0
        sendCommand(YX5300.playTrackFromFolder(track, folder))
        if (repeat === Repeat.Repeatedly) {
            sendCommand(YX5300.enableRepeatModeForCurrentTrack())
        }
    }

    /**
     * Play folder.
     * @param folder folder index, eg:1
     * @param repeat indicates whether to repeat the folder, eg: makerbit.Repeat.Once
     */
    //% subcategory="Serial MP3"
    //% blockId="makebit_mp3_play_folder" block="play MP3 folder %folder | %repeat"
    //% folder.min=1 folder.max=99
    //% weight=47
    export function playMp3Folder(folder: number, repeat: Repeat): void {
        tracksToPlay = 0
        if (repeat === Repeat.Once) {
            sendCommand(YX5300.queryFolderTrackCount(folder))
            sendCommand(YX5300.playTrackFromFolder(1, folder))
        }
        else {
            sendCommand(YX5300.repeatFolder(folder))
        }
    }

    /**
     * Set volume.
     * @param volume volume in the range of 0 to 30: eg: 30
     */
    //% subcategory="Serial MP3"
    //% blockId="makebit_mp3_set_volume" block="set MP3 volume to %volume"
    //% volume.min=0 volume.max=30
    //% weight=46
    export function setMp3Volume(volume: number): void {
        sendCommand(YX5300.setVolume(volume))
    }

    /**
     * Dispatches a command to the MP3 device.
     * @param command command, eg: makerbit.Command.PLAY_NEXT_TRACK
     */
    //% subcategory="Serial MP3"
    //% blockId="makebit_mp3_run_command" block="run MP3 command %command"
    //% weight=45
    export function runMp3Command(command: Command): void {
        switch (command) {
            case Command.PLAY_NEXT_TRACK:
                tracksToPlay = 0
                sendCommand(YX5300.next())
                break
            case Command.PLAY_PREVIOUS_TRACK:
                tracksToPlay = 0
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
                tracksToPlay = 0
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

    /**
    * Do something when playback is completed.
    * @param handler body code to run when event is raised
    */
    //% subcategory="Serial MP3"
    //% blockId=makebit_mp3_playback_completed block="on MP3 playback completed"
    //% weight=43
    export function onPlaybackCompleted(handler: Action) {
        control.onEvent(
            MICROBIT_ID_SERIAL_MP3,
            MICROBIT_SERIAL_MP3_PLAYBACK_COMPLETED,
            handler
        )
    }

    function spinWait(millis: number) {
        control.waitMicros(millis * 1000)
    }

    function sendCommand(command: Buffer): void {
        serial.writeBuffer(command)
        spinWait(YX5300.REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS)
    }


    // YX5300 asynchronous serial port control commands
    export namespace YX5300 {

        export interface Response { type: ResponseType, payload?: number }

        export const REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS = 300

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
            REPEAT_CURRENT_TRACK = 0x19,
            MUTE = 0x1A,
            QUERY_STATUS = 0x42,
            QUERY_VOLUME = 0x43,
            QUERY_TOTAL_TRACK_COUNT = 0x48,
            QUERY_FOLDER_TRACK_COUNT = 0x4E,
            QUERY_FOLDER_COUNT = 0x4F
        }

        export enum ResponseType {
            RESPONSE_INVALID = 0x00,
            RESPONSE_START_BYTE = 0x7E,
            TRACK_COMPLETED = 0x3D,
            PLAYBACK_STATUS = 0x42,
            FOLDER_TRACK_COUNT = 0x4E
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

        export function queryStatus(): Buffer {
            return composeSerialCommand(CommandCode.QUERY_STATUS, 0x00, 0x00)
        }

        export function queryFolderTrackCount(folder: number): Buffer {
            return composeSerialCommand(CommandCode.QUERY_FOLDER_TRACK_COUNT, 0x00, clipFolder(folder))
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

        export function enableRepeatModeForCurrentTrack(): Buffer {
            return composeSerialCommand(CommandCode.REPEAT_CURRENT_TRACK, 0x00, 0x00)
        }

        export function disableRepeatMode(): Buffer {
            return composeSerialCommand(CommandCode.REPEAT_CURRENT_TRACK, 0x00, 0x01)
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

        export function decodeResponse(response: Buffer): Response {
            if (response.length != 10) {
                return { type: ResponseType.RESPONSE_INVALID }
            }

            if (response.getNumber(NumberFormat.UInt8LE, 0) != 0x7E) {
                return { type: ResponseType.RESPONSE_INVALID }
            }

            if (response.getNumber(NumberFormat.UInt8LE, 9) != 0xEF) {
                return { type: ResponseType.RESPONSE_INVALID }
            }

            const cmd = response.getNumber(NumberFormat.UInt8LE, 3)
            let type = ResponseType.RESPONSE_INVALID

            switch (cmd) {
                case ResponseType.TRACK_COMPLETED:
                    type = ResponseType.TRACK_COMPLETED
                    break
                case ResponseType.PLAYBACK_STATUS:
                    type = ResponseType.PLAYBACK_STATUS
                    break
                case ResponseType.FOLDER_TRACK_COUNT:
                    type = ResponseType.FOLDER_TRACK_COUNT
                    break
                default:
                    type = ResponseType.RESPONSE_INVALID
                    break
            }

            const payload = response.getNumber(NumberFormat.UInt8LE, 6)
            return { type: type, payload: payload };
        }
    }
}
