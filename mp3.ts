// MakerBit Serial MP3 blocks supporting Catalex Serial MP3 1.0
namespace makerbit {

    export const enum Repeat {
        //% block="once"
        No = 0,
        //% block="forever"
        Forever = 1,
    }

    export const enum Mp3Command {
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

    const enum PlayMode {
        Track = 0,
        Folder = 1,
    }

    interface PlaybackState {
        track: number
        folder: number
        playMode: PlayMode
        repeat: Repeat
        maxTracksInFolder: number
        lastTrackCompletedTimestamp: number
    }

    let playState: PlaybackState = {
        track: 1,
        folder: 1,
        playMode: PlayMode.Track,
        repeat: Repeat.No,
        maxTracksInFolder: 99,
        lastTrackCompletedTimestamp: 0
    }

    function readSerial() {
        const responseBuffer: Buffer = pins.createBuffer(10)

        while (true) {
            const first = serialReadBuffer(1)

            if (first.getNumber(NumberFormat.UInt8LE, 0) == YX5300.ResponseType.RESPONSE_START_BYTE) {

                responseBuffer.setNumber(NumberFormat.UInt8LE, 0, YX5300.ResponseType.RESPONSE_START_BYTE)
                const remainder = serialReadBuffer(9)
                responseBuffer.write(1, remainder)

                const response = YX5300.decodeResponse(responseBuffer)

                handleResponse(response)
            }
        }
    }

    function handleResponse(response: YX5300.Response) {
        switch (response.type) {
            case YX5300.ResponseType.TRACK_NOT_FOUND:
                handleResponseTrackNotFound(response)
                break
            case YX5300.ResponseType.TRACK_COMPLETED:
                handleResponseTrackCompleted(response)
                break
            default:
                break
        }
    }

    function handleResponseTrackNotFound(response: YX5300.Response) {
        if (playState.track < playState.maxTracksInFolder) {
            playState.maxTracksInFolder = playState.track
        }

        if (playState.playMode === PlayMode.Folder && playState.repeat === Repeat.Forever) {
            playState.track = 1
            play(playState)
        }
    }

    function handleResponseTrackCompleted(response: YX5300.Response) {
        let eventTimestamp = input.runningTime()

        // At end of playback we receive up to two TRACK_COMPLETED events.
        // We use the 1st TRACK_COMPLETED event to notify playback as complete
        // or to advance folder play. A closely following 2nd event is ignored.
        if (playState.lastTrackCompletedTimestamp < eventTimestamp - 250) {
            if (playState.playMode === PlayMode.Folder) {
                playState.track++
                // Send as fast as possible to prevent collision with 2nd TRACK_COMPLETED event
                serial.writeBuffer(YX5300.playTrackFromFolder(playState.track, playState.folder))
            }
        }

        playState.lastTrackCompletedTimestamp = eventTimestamp
    }

    /**
     * Connects to serial MP3 device with chip YX5300.
     * @param mp3RX MP3 device receiver pin (RX), eg: makerbit.Pin.A0
     * @param mp3TX MP3 device transmitter pin (TX), eg: makerbit.Pin.A1
     */
    //% subcategory="Serial MP3"
    //% blockId="makerbit_mp3_connect" block="connect MP3 with MP3 RX attached to %mp3RX | and MP3 TX to %mp3TX"
    //% mp3RX.fieldEditor="gridpicker" mp3RX.fieldOptions.columns=3
    //% mp3RX.fieldOptions.tooltips="false"
    //% mp3TX.fieldEditor="gridpicker" mp3TX.fieldOptions.columns=3
    //% mp3TX.fieldOptions.tooltips="false"
    //% weight=50
    export function connectSerialMp3(mp3RX: Pin, mp3TX: Pin): void {
        redirectSerial(mp3RX, mp3TX, BaudRate.BaudRate9600)
        control.inBackground(readSerial)
        sendCommand(YX5300.selectDeviceTfCard())
        basic.pause(500)
        sendCommand(YX5300.setVolume(30))
        sendCommand(YX5300.unmute())
    }

    /** Support serial redirect to all pins. */
    //% shim=makerbit::redirectSerial
    export function redirectSerial(tx: number, rx: number, baud: number): void { return }

    /** Prevent pxsim failure */
    //% shim=makerbit::serialReadBuffer
    export function serialReadBuffer(length: number): Buffer { return pins.createBuffer(length) }


    /**
     * Plays a track from a folder.
     * @param track track index, eg:1
     * @param folder folder index, eg:1
     * @param repeat indicates whether to repeat the track, eg: makerbit.Repeat.No
     */
    //% subcategory="Serial MP3"
    //% blockId="makerbit_mp3_play_track_from_folder" block="play MP3 track %track | from folder %folder | %repeat"
    //% track.min=1 track.max=255
    //% folder.min=1 folder.max=99
    //% weight=48
    export function playMp3TrackFromFolder(track: number, folder: number, repeat: Repeat): void {
        const newState = {
            track: track,
            folder: folder,
            playMode: PlayMode.Track,
            repeat: repeat,
            maxTracksInFolder: 99,
            lastTrackCompletedTimestamp: 0
        }
        play(newState)
    }

    /**
     * Plays all tracks in a folder.
     * @param folder folder index, eg:1
     * @param repeat indicates whether to repeat the folder, eg: makerbit.Repeat.No
     */
    //% subcategory="Serial MP3"
    //% blockId="makerbit_mp3_play_folder" block="play MP3 folder %folder | %repeat"
    //% folder.min=1 folder.max=99
    //% weight=47
    export function playMp3Folder(folder: number, repeat: Repeat): void {
        const newState = {
            track: 1,
            folder: folder,
            playMode: PlayMode.Folder,
            repeat: repeat,
            maxTracksInFolder: 99,
            lastTrackCompletedTimestamp: 0
        }
        play(newState)
    }

    function play(newState: PlaybackState): void {
        playState = newState

        sendCommand(YX5300.playTrackFromFolder(newState.track, newState.folder))

        if (newState.playMode === PlayMode.Track && newState.repeat === Repeat.Forever) {
            sendCommand(YX5300.enableRepeatModeForCurrentTrack())
        }
    }

    /**
     * Sets the volume.
     * @param volume volume in the range of 0 to 30: eg: 30
     */
    //% subcategory="Serial MP3"
    //% blockId="makerbit_mp3_set_volume" block="set MP3 volume to %volume"
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
    //% blockId="makerbit_mp3_run_command" block="run MP3 command %command"
    //% weight=45
    export function runMp3Command(command: Mp3Command): void {
        switch (command) {
            case Mp3Command.PLAY_NEXT_TRACK:
                if (playState.track < playState.maxTracksInFolder) {
                    playState.track += 1
                    if (playState.playMode === PlayMode.Track) {
                        playState.repeat = Repeat.No
                    }
                    play(playState)
                }
                break
            case Mp3Command.PLAY_PREVIOUS_TRACK:
                if (playState.track > 1) {
                    playState.track -= 1
                }
                if (playState.playMode === PlayMode.Track) {
                    playState.repeat = Repeat.No
                }
                play(playState)
                break
            case Mp3Command.INCREASE_VOLUME:
                sendCommand(YX5300.increaseVolume())
                break
            case Mp3Command.DECREASE_VOLUME:
                sendCommand(YX5300.decreaseVolume())
                break
            case Mp3Command.PAUSE:
                sendCommand(YX5300.pause())
                break
            case Mp3Command.RESUME:
                sendCommand(YX5300.resume())
                break
            case Mp3Command.STOP:
                sendCommand(YX5300.stop())
                break
            case Mp3Command.MUTE:
                sendCommand(YX5300.mute())
                break
            case Mp3Command.UNMUTE:
                sendCommand(YX5300.unmute())
                break
        }
    }

    function sendCommand(command: Buffer): void {
        serial.writeBuffer(command)
        basic.pause(YX5300.REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS)
    }

    // YX5300 asynchronous serial port control commands
    export namespace YX5300 {

        export interface Response { type: ResponseType, payload?: number }

        export const REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS = 300

        export const enum CommandCode {
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
            QUERY_TRACK = 0x4C,
            QUERY_FOLDER_TRACK_COUNT = 0x4E,
            QUERY_FOLDER_COUNT = 0x4F
        }

        export const enum ResponseType {
            RESPONSE_INVALID = 0x00,
            RESPONSE_START_BYTE = 0x7E,
            TF_CARD_INSERT = 0x3A,
            TRACK_COMPLETED = 0x3D,
            TRACK_NOT_FOUND = 0x40,
            ACK = 0x41,
            PLAYBACK_STATUS = 0x42,
            VOLUME = 0x43,
            CURRENT_TRACK = 0x4C,
            FOLDER_TRACK_COUNT = 0x4E,
            FOLDER_COUNT = 0x4F
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
            )
        }

        export function queryStatus(): Buffer {
            return composeSerialCommand(CommandCode.QUERY_STATUS, 0x00, 0x00)
        }

        export function queryVolume(): Buffer {
            return composeSerialCommand(CommandCode.QUERY_VOLUME, 0x00, 0x00)
        }

        export function queryTrack(): Buffer {
            return composeSerialCommand(CommandCode.QUERY_TRACK, 0x00, 0x00)
        }

        export function queryFolderTrackCount(folder: number): Buffer {
            return composeSerialCommand(CommandCode.QUERY_FOLDER_TRACK_COUNT, 0x00, clipFolder(folder))
        }

        export function queryFolderCount(): Buffer {
            return composeSerialCommand(CommandCode.QUERY_FOLDER_COUNT, 0x00, 0x00)
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

            const type = response.getNumber(NumberFormat.UInt8LE, 3)
            const payload = (response.getNumber(NumberFormat.UInt8LE, 5) << 8) | response.getNumber(NumberFormat.UInt8LE, 6)

            return { type: type, payload: payload }
        }
    }
}
