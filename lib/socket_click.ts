import { type InjectionKey } from "vue";

export interface SocketClick {
    element: HTMLElement,
    io: "input" | "output",
    kind: string,
    get_value: (() => Promise<string>) | undefined,
    set_get_value: ((callback: () => Promise<string>) => void) | undefined,
}

export const inject_key = Symbol() as InjectionKey<(socket: SocketClick) => void>;

