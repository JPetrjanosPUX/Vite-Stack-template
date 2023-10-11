/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'virtual:dynamic-imports' {
    export function loader(module: string): Promise<any>
}

declare type IModule = {
    onInit?: () => void
    onLoad?: () => void
    onResize?: () => void
    onScroll?: () => void
}
