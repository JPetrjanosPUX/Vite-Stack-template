let documentIsLoaded = false
const pendingOnLoadCallbacks: (() => void)[] = []
const onResizeCallbacks: (() => void)[] = []
const onScrollCallbacks: (() => void)[] = []

const eventManager = {
    fireOnLoad() {
        documentIsLoaded = true
        pendingOnLoadCallbacks.forEach((x) => x())
    },
    onLoad(callback: () => void) {
        if (documentIsLoaded) {
            // the document's "onload" has been already fired, fire the module immediatelly
            callback()
        } else {
            // add to queue of pending onload events, will be triggered once the document is ready
            pendingOnLoadCallbacks.push(callback)
        }
    },
    onResize(callback: () => void) {
        onResizeCallbacks.push(callback)
    },
    fireOnResize() {
        onResizeCallbacks.forEach((x) => x())
    },
    onScroll(callback: () => void) {
        onScrollCallbacks.push(callback)
    },
    fireOnScroll() {
        onScrollCallbacks.forEach((x) => x())
    },
}

export default eventManager
