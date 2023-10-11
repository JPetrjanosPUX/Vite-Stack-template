class CookiesHelper {
    static createCookie = (name?: string, value?: string, days?: number) => {
        let expires = ``

        if (days) {
            const date = new Date()
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)

            expires = `; expires=${date.toUTCString()}`
        }

        document.cookie = name + `=` + value + expires + `; path=/`
    }

    static readCookie = (name: string) => {
        const nameEQ = name + `=`
        const ca = document.cookie.split(`;`)
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ` `) c = c.substring(1, c.length)
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length)
        }
        return null
    }

    static deleteCookie = (name: string) => {
        this.createCookie(name, ``, -1)
    }
}

export default CookiesHelper

