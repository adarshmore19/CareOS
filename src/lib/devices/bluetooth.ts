/**
 * CareOS Authentic Web Bluetooth GATT Health Device Driver
 * Follows Bluetooth SIG Adopted Specifications:
 * - Heart Rate Service (0x180D) / Measurement Characteristic (0x2A37)
 * - Blood Pressure Service (0x1810) / Measurement Characteristic (0x2A35)
 * - Pulse Oximeter Service (0x1822) / Measurement Characteristic (0x2A5F)
 * 
 * Strict Data Integrity:
 * - No simulated or fabricated numbers
 * - Connects only to actual physical Bluetooth LE devices
 * - Returns honest disconnection / unsupported states
 */

export interface BluetoothDeviceSession {
  device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
  metricType: "heart_rate" | "blood_pressure" | "pulse_oximeter";
}

export function isBluetoothSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(navigator && "bluetooth" in navigator);
}

/**
 * Connect to an authentic Bluetooth LE Heart Rate Monitor (Smartwatch, Chest Strap, Armband)
 */
export async function connectHeartRateMonitor(
  onReading: (bpm: number) => void,
  onDisconnect?: () => void
): Promise<BluetoothDeviceSession> {
  if (!isBluetoothSupported()) {
    throw new Error(
      "Web Bluetooth API is not supported in this browser. Please use Google Chrome, Edge, or Brave over HTTPS/localhost."
    );
  }

  // Request standard Bluetooth SIG Heart Rate Service
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ["heart_rate"] }],
    optionalServices: ["battery_service"],
  });

  if (!device.gatt) {
    throw new Error("GATT server is not available on selected health device.");
  }

  const server = await device.gatt.connect();

  if (onDisconnect) {
    device.addEventListener("gattserverdisconnected", onDisconnect);
  }

  const service = await server.getPrimaryService("heart_rate");
  const characteristic = await service.getCharacteristic("heart_rate_measurement");

  // Start authentic continuous GATT notifications
  await characteristic.startNotifications();

  characteristic.addEventListener("characteristicvaluechanged", (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    // Bluetooth SIG Heart Rate Measurement Parsing:
    // Byte 0: Flags
    // Bit 0: Heart Rate Value Format (0 = UINT8, 1 = UINT16)
    const flags = value.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;

    let bpm: number;
    if (is16Bit) {
      bpm = value.getUint16(1, true); // Little endian
    } else {
      bpm = value.getUint8(1);
    }

    if (bpm > 0) {
      onReading(bpm);
    }
  });

  return {
    device,
    server,
    metricType: "heart_rate",
  };
}

/**
 * Gracefully disconnect an active hardware device
 */
export function disconnectHealthDevice(session: BluetoothDeviceSession | null): void {
  if (session && session.device && session.device.gatt?.connected) {
    session.device.gatt.disconnect();
  }
}
