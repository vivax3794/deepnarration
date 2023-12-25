export const NODE_CONSTANT = "blue-darken-4"
export const NODE_DISPLAY = "teal-darken-4"
export const NODE_AI = "purple-darken-4"
export const NODE_ACTION = "red-darken-4"
export const NODE_LOCAL = "yellow-darken-4"
export const NODE_CONTROL_FLOW = "blue-grey-darken-4"

export const SOCKET_NUMBER = "lightgreen"
export const SOCKET_STRING = "green"
export const SOCKET_IMAGE = "cyan"
export const SOCKET_IMAGE_URL = "blue"
export const SOCKET_AUDIO = "red"
export const SOCKET_VIDEO = "purple"
export const SOCKET_GENERIC = "gray"
export const SOCKET_SPECIAL = "yellow"
export const SOCKET_CACHE = "pink"

export function kind_to_color(kind: string): string {
    switch (kind) {
        case "number": return SOCKET_NUMBER
        case "string": return SOCKET_STRING
        case "image": return SOCKET_IMAGE
        case "url": return SOCKET_IMAGE_URL
        case "audio": return SOCKET_AUDIO
        case "video": return SOCKET_VIDEO
        case "generic": return SOCKET_GENERIC
        case "cache": return SOCKET_CACHE
        default: return SOCKET_SPECIAL
    }
}
