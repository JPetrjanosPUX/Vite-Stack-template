import { loader } from 'virtual:dynamic-imports'

import eventManager from './event-manager'

export function importModule(module: string) {
    loader(module)
        .then((x) => {
            registerModule(x.default)

            console.log(`Loaded and registered module "` + module + `".`)
        })
        .catch((x) => {
            console.error(`Can not load module "` + module + `". `)
            console.error(x)
        })
}

export function registerModule(module: IModule) {
    if (module.onInit) {
        module.onInit()
    }

    if (module.onLoad) {
        eventManager.onLoad(module.onLoad)
    }

    if (module.onResize) {
        eventManager.onResize(module.onResize)
    }

    if (module.onScroll) {
        eventManager.onScroll(module.onScroll)
    }

    console.log(`Registered module ` + typeof module)
}
