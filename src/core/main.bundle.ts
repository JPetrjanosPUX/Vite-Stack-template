import buttonModule from '../modules/button/button.bundle'
import eventManager from './event-manager'
import { importModule, registerModule } from './module-importer'

declare global {
    interface Window {
        pux: unknown
        _puxldr: string[]
    }
}

window.pux = function (module: string) {
    importModule(module)
}

eventManager.onLoad(() => {
    registerModule(buttonModule)
})

window._puxldr.forEach((x) => importModule(x))

window.addEventListener(`load`, () => eventManager.fireOnLoad())
window.addEventListener(`resize`, () => eventManager.fireOnResize())
window.addEventListener(`scroll`, () => eventManager.fireOnScroll())
