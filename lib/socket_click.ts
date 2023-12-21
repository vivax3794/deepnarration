import { type InjectionKey } from "vue";

export interface OutputToInput {
    get_value: () => Promise<string>
}
export interface InputToOutput {
    make_dirty: () => void
}

export interface SocketClickInput {
    element: HTMLElement,
    io: "input",
    kind: string,
    update_value: (info: OutputToInput) => void
    data: InputToOutput,
}
export interface SocketClickOutput {
    element: HTMLElement,
    io: "output",
    kind: string,
    update_value: (info: InputToOutput) => void,
    data: OutputToInput,
}

export type SocketClick = SocketClickOutput | SocketClickInput;
export const inject_key = Symbol() as InjectionKey<(socket: SocketClick) => void>;

