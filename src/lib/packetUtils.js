// packetUtils.js
const NETMSG_HEARTBEAT    = 0;
const NETMSG_CLIENTLOGINID  = 1003;
const NETMSG_CLIENTLOGINPWD = 1004;
const NETMSG_SELECTCHANNEL = 2003;

// Add your new room-related codes
const NETMSG_ROOMLIST    = 2100;
const NETMSG_ROOMCREATE  = 2103;
const NETMSG_ROOMREMOVE  = 2101;
const NETMSG_SUPERADMIN_FEE_PERCENTAGE = 3010;
// Constants for type codes
const TYPE_CODES = {
    EMPTY: 0,
    OBJECT: 1,
    DBNULL: 2,
    BOOLEAN: 3,
    CHAR: 4,
    SBYTE: 5,
    BYTE: 6,
    INT16: 7,
    UINT16: 8,
    INT32: 9,
    UINT32: 10,
    INT64: 11,
    UINT64: 12,
    SINGLE: 13,
    DOUBLE: 14,
    DECIMAL: 15,
    DATETIME: 16,
    STRING: 18,
};

const SIGNATURE = 0x80;

// Helper methods for reading/writing 64-bit integers in JavaScript
function readInt64(view, offset, littleEndian = true) {
    const low = view.getUint32(offset, littleEndian);
    const high = view.getInt32(offset + 4, littleEndian);
    return high * 0x100000000 + low;
}

function readUInt64(view, offset, littleEndian = true) {
    const low = view.getUint32(offset, littleEndian);
    const high = view.getUint32(offset + 4, littleEndian);
    return high * 0x100000000 + low;
}

/**
 * Parse a received buffer into a more readable object.
 * Returns an object containing:
 *    - signature
 *    - sendPacketId
 *    - lastRecvPacketId
 *    - msgCode
 *    - dataNum
 *    - dataItems: an array of parsed data items
 */
function parsePacket(buffer) {
    const view = new DataView(buffer);

    // Parse header
    const signature = view.getUint8(0);
    if (signature !== SIGNATURE) {
        throw new Error(`Invalid signature: ${signature}`);
    }

    const sendPacketId = view.getInt32(1, true);
    const lastRecvPacketId = view.getInt32(5, true);
    const msgCode = view.getUint16(9, true);
    const dataNum = view.getUint8(11);

    // Parse data items
    let offset = 12;
    const dataItems = [];
    for (let i = 0; i < dataNum; i++) {
        const { value, newOffset } = parseDataItem(view, offset);
        offset = newOffset;
        dataItems.push(value);
    }

    return {
        signature,
        sendPacketId,
        lastRecvPacketId,
        msgCode,
        dataNum,
        dataItems,
    };
}

/**
 * Parse one data item (based on type code) from the buffer starting at `offset`.
 * Returns an object containing:
 *    - value (the parsed item)
 *    - newOffset (the offset after reading this item)
 */
function parseDataItem(view, offset) {
    const typeCode = view.getUint8(offset);
    offset += 1;

    let value;

    switch (typeCode) {
        case TYPE_CODES.EMPTY: // 0
        case TYPE_CODES.DBNULL: // 2
            value = null;
            break;

        case TYPE_CODES.OBJECT: // 1
            // Assuming this is a raw byte array
        {
            const objLength = view.getInt32(offset, true);
            offset += 4;
            value = new Uint8Array(view.buffer, offset, objLength);
            offset += objLength;
        }
            break;

        case TYPE_CODES.BOOLEAN: // 3
            value = !!view.getUint8(offset);
            offset += 1;
            break;

        case TYPE_CODES.CHAR: // 4
            value = String.fromCharCode(view.getUint8(offset));
            offset += 1;
            break;

        case TYPE_CODES.SBYTE: // 5
            value = view.getInt8(offset);
            offset += 1;
            break;

        case TYPE_CODES.BYTE: // 6
            value = view.getUint8(offset);
            offset += 1;
            break;

        case TYPE_CODES.INT16: // 7
            value = view.getInt16(offset, true);
            offset += 2;
            break;

        case TYPE_CODES.UINT16: // 8
            value = view.getUint16(offset, true);
            offset += 2;
            break;

        case TYPE_CODES.INT32: // 9
            value = view.getInt32(offset, true);
            offset += 4;
            break;

        case TYPE_CODES.UINT32: // 10
            value = view.getUint32(offset, true);
            offset += 4;
            break;

        case TYPE_CODES.INT64: // 11
            value = readInt64(view, offset, true);
            offset += 8;
            break;

        case TYPE_CODES.UINT64: // 12
            value = readUInt64(view, offset, true);
            offset += 8;
            break;

        case TYPE_CODES.SINGLE: // 13
            value = view.getFloat32(offset, true);
            offset += 4;
            break;

        case TYPE_CODES.DOUBLE: // 14
            value = view.getFloat64(offset, true);
            offset += 8;
            break;

        case TYPE_CODES.DECIMAL: // 15
            // Not handled natively
            console.warn('Decimal type not natively supported.');
            value = null;
            offset += 16; // or however your server encodes decimals
            break;

        case TYPE_CODES.DATETIME: // 16
        {
            // Assuming a double representing a timestamp
            const timestamp = view.getFloat64(offset, true);
            offset += 8;
            value = new Date(timestamp);
        }
            break;

        case TYPE_CODES.STRING: // 18
        {
            const strLength = view.getInt32(offset, true);
            offset += 4;
            const strBytes = new Uint8Array(view.buffer, offset, strLength);
            value = new TextDecoder().decode(strBytes);
            offset += strLength;
        }
            break;

        default:
            console.error(`Unsupported type code: ${typeCode}`);
            value = null;
            break;
    }

    return { value, newOffset: offset };
}

/**
 * Create a packet (ArrayBuffer) given the header info and an array of data items.
 * Each data item should be an object of the form:
 * {
 *   type: one of TYPE_CODES,
 *   value: the actual JS value to be encoded
 * }
 *
 * Example usage:
 * const dataItems = [
 *   { type: TYPE_CODES.STRING, value: 'testUser' },
 *   { type: TYPE_CODES.STRING, value: 'testPassword' },
 * ];
 *
 * const packet = createPacket(SIGNATURE, sendPacketId, lastRecvPacketId, msgCode, dataItems);
 */
function createPacket(signature, sendPacketId, lastRecvPacketId, msgCode, dataItems) {
    // First, calculate total size
    let totalSize = 12; // header: 1 + 4 + 4 + 2 + 1
    for (const item of dataItems) {
        totalSize += calculateDataItemSize(item);
    }

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    // Write header
    let offset = 0;
    view.setUint8(offset, signature);       offset += 1;
    view.setInt32(offset, sendPacketId, true);  offset += 4;
    view.setInt32(offset, lastRecvPacketId, true); offset += 4;
    view.setUint16(offset, msgCode, true);     offset += 2;
    view.setUint8(offset, dataItems.length);   offset += 1;

    // Write data items
    for (const item of dataItems) {
        offset = writeDataItem(view, offset, item);
    }

    return buffer;
}

/**
 * Determine the byte size of one data item, including the type code byte itself.
 */
function calculateDataItemSize(item) {
    const { type, value } = item;

    switch (type) {
        case TYPE_CODES.EMPTY:
        case TYPE_CODES.DBNULL:
            return 1;

        case TYPE_CODES.OBJECT:
            // value assumed to be Uint8Array or similar
            return 1 + 4 + value.length;

        case TYPE_CODES.BOOLEAN:
        case TYPE_CODES.CHAR:
        case TYPE_CODES.SBYTE:
        case TYPE_CODES.BYTE:
            return 2; // 1 type code + 1 byte

        case TYPE_CODES.INT16:
        case TYPE_CODES.UINT16:
            return 3; // 1 type code + 2 bytes

        case TYPE_CODES.INT32:
        case TYPE_CODES.UINT32:
            return 5; // 1 type code + 4 bytes

        case TYPE_CODES.INT64:
        case TYPE_CODES.UINT64:
            return 9; // 1 type code + 8 bytes

        case TYPE_CODES.SINGLE:
            return 5; // 1 type code + 4 bytes

        case TYPE_CODES.DOUBLE:
            return 9; // 1 type code + 8 bytes

        case TYPE_CODES.DECIMAL:
            // Not natively supported, assume 16 bytes + 1 for type code
            return 17;

        case TYPE_CODES.DATETIME:
            // 1 type code + 8 bytes
            return 9;

        case TYPE_CODES.STRING:
        {
            // 1 (type code) + 4 (length) + string bytes
            const encoder = new TextEncoder();
            const strBytes = encoder.encode(String(value));
            return 1 + 4 + strBytes.length;
        }

        default:
            throw new Error(`Unsupported type code in calculateDataItemSize: ${type}`);
    }
}

/**
 * Write a single data item to the buffer
 */
function writeDataItem(view, offset, item) {
    const { type, value } = item;
    view.setUint8(offset, type);
    offset += 1;

    switch (type) {
        case TYPE_CODES.EMPTY:
        case TYPE_CODES.DBNULL:
            // no extra data
            break;

        case TYPE_CODES.OBJECT: {
            // value is Uint8Array or similar
            view.setInt32(offset, value.length, true);
            offset += 4;
            new Uint8Array(view.buffer).set(value, offset);
            offset += value.length;
            break;
        }

        case TYPE_CODES.BOOLEAN:
            view.setUint8(offset, value ? 1 : 0);
            offset += 1;
            break;

        case TYPE_CODES.CHAR:
            view.setUint8(offset, value.charCodeAt(0));
            offset += 1;
            break;

        case TYPE_CODES.SBYTE:
            view.setInt8(offset, value);
            offset += 1;
            break;

        case TYPE_CODES.BYTE:
            view.setUint8(offset, value);
            offset += 1;
            break;

        case TYPE_CODES.INT16:
            view.setInt16(offset, value, true);
            offset += 2;
            break;

        case TYPE_CODES.UINT16:
            view.setUint16(offset, value, true);
            offset += 2;
            break;

        case TYPE_CODES.INT32:
            view.setInt32(offset, value, true);
            offset += 4;
            break;

        case TYPE_CODES.UINT32:
            view.setUint32(offset, value, true);
            offset += 4;
            break;

        case TYPE_CODES.INT64: {
            // We'll split the 64-bit number into two 32-bit parts
            const low = value & 0xffffffff;
            const high = Math.floor(value / 0x100000000);
            view.setUint32(offset, low, true);
            offset += 4;
            view.setInt32(offset, high, true);
            offset += 4;
            break;
        }

        case TYPE_CODES.UINT64: {
            const low = value & 0xffffffff;
            const high = Math.floor(value / 0x100000000);
            view.setUint32(offset, low, true);
            offset += 4;
            view.setUint32(offset, high, true);
            offset += 4;
            break;
        }

        case TYPE_CODES.SINGLE:
            view.setFloat32(offset, value, true);
            offset += 4;
            break;

        case TYPE_CODES.DOUBLE:
            view.setFloat64(offset, value, true);
            offset += 8;
            break;

        case TYPE_CODES.DECIMAL:
            // Not natively supported. You must define how your server expects decimals.
            // For example, if it's 16 bytes, you might have to split it out similarly
            // to how we do for 64-bit integers. We'll skip here.
            offset += 16;
            break;

        case TYPE_CODES.DATETIME:
            // If your server expects a double representing a timestamp
            view.setFloat64(offset, value.getTime(), true);
            offset += 8;
            break;

        case TYPE_CODES.STRING: {
            const encoder = new TextEncoder();
            const strBytes = encoder.encode(String(value));
            view.setInt32(offset, strBytes.length, true);
            offset += 4;
            new Uint8Array(view.buffer).set(strBytes, offset);
            offset += strBytes.length;
            break;
        }

        default:
            throw new Error(`Unsupported type code in writeDataItem: ${type}`);
    }

    return offset;
}

module.exports = {
    SIGNATURE,
    TYPE_CODES,
    NETMSG_HEARTBEAT,
    NETMSG_CLIENTLOGINID,
    NETMSG_CLIENTLOGINPWD,
    NETMSG_ROOMLIST,
    NETMSG_ROOMCREATE,
    NETMSG_SELECTCHANNEL,
    NETMSG_ROOMREMOVE,
    NETMSG_SUPERADMIN_FEE_PERCENTAGE,
    createPacket,
    parsePacket,
};
