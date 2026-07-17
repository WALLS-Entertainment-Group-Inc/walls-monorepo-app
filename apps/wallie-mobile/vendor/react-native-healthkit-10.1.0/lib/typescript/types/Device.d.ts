/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export interface Device {
    readonly name: string | null;
    readonly firmwareVersion: string | null;
    readonly hardwareVersion: string | null;
    readonly localIdentifier: string | null;
    readonly manufacturer: string | null;
    readonly model: string | null;
    readonly softwareVersion: string | null;
    readonly udiDeviceIdentifier: string | null;
}
