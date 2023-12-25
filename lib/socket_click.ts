import { type InjectionKey } from "vue";

export interface OutputToInput {
    get_value: () => Promise<any>,
    reset: () => void,
}
export interface InputToOutput {
    make_dirty: () => void
    reset: () => void,
}

export interface SocketClickInput {
    element: HTMLElement,
    io: "input",
    kind: string,
    update_value: (info: OutputToInput, kill_connection: () => void) => void
    data: InputToOutput,
    update_kind: (kind: string) => void,
}
export interface SocketClickOutput {
    element: HTMLElement,
    io: "output",
    kind: string,
    update_value: (info: InputToOutput, kill_connection: () => void) => void,
    data: OutputToInput,
}

export type SocketClick = SocketClickOutput | SocketClickInput;
export const inject_key = Symbol() as InjectionKey<(socket: SocketClick) => void>;

