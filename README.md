# Vite stack

V této dokumentaci je popsána práce s Vite stackem.

## **Instalace a spouštění FE stacku**
---

### Prerekvizity
Je potřeba mít nainstalovaný Node LTS (v.18)

Dále je potřeba mít nainstalovaný pnpm. Instalace je následovně:

`npm i -g pnpm`

<br>

### Instalace a spouštění
- `pnpm i` - nainstalování npm balíčků
- `pnpm run build` nebo `npm run build` - prvotní build
- `pnpm run dev` nebo `npm run dev` - spuštění development vite

<br>

## **Instalace balíčků**
---
**Instalace pomocí pnpm!**

`pnpm -i **balíček**` nebo `pnpm -i --save-dev **balíček**`

<br>

## **VS Code doplňky**
---
Je doporučené mít nainstalované tyto extensions:
- ESLint
- StyleLint
- EditorConfig for VS Code

<br>

## Lintery
---
Projekt používá ESLint a Stylelint. Kromě vyspecifikovaných pravidel (v .eslintrc.json a .stylelintrc.json v "rules") se používají balíčky (ve stejných souborech "extends")
<p>&nbsp;</p>

### ESLint rules
@typescript-eslint/recommended - https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts

prettier/recommended - https://github.com/prettier/eslint-plugin-prettier
<p>&nbsp;</p>

### Stylelint rules
stylelint-config-idiomatic-order - https://github.com/ream88/stylelint-config-idiomatic-order

stylelint-config-recommended-scss - https://www.npmjs.com/package/stylelint-config-recommended-scss
<p>&nbsp;</p>

<br>

## **Struktura**
---
Struktura složek ve stacku je následovná (jednotlivé složky a jejich význam níže):

```
/Projekt
    /assets
    /core
    /helpers
    /modules
```

<br>

### assets
Složka assets slouží pro obrázky, fonty, icomoon atd.
Ve výchozím stavu zde najdeme strukturu:

```
/fonts
/icons
/img
```

Do složky `fonts` patří soubory fontů, pokud web nepoužívá z GoogleFonts nebo AdobeFonts. Čili například `.woff`, `.ttf`, `.otf` atd.
Nepatří zde soubory pro ikony (např. Icomoon).
<br>

Na ikony slouží právě složka `icons`.
<br>

Složka `img` je pro obrázky, které jsou z filesystému. Například zde bude logo (či více log, pokud web má) nebo favicon atd.
<br>

Dále je možnost do složky assets vytvářet další složky například pro videa, lottie animace a další. Pro detaily, jak docílit toho, aby se vaše assety kopírovaly viz sekci **Assets**.

<br>

### core
Do složky Core patří soubory, které tvoří základ a měly by zde být jen ty zdroje, které jsou na všech stránkách. To znamená, že zde najdeme main soubory jak SCSS, tak TS. Dále zde jsou složky `base`, `layout` a `typography`.

V soubor `imports.scss` jsou nalinkované mixiny a SCSS proměnné. Tento soubor potom linkujeme místo jednotlivých mixinů a souborů s SCSS proměnnými.

Do souborů `eventManager.ts` a `moduleImporter.ts` prosím **nesahejte**, pokud nevíte, co přesně děláte a proč to děláte. Tyto soubory slouží k importování TS modulů a jejich obsluhu.

<br>

### helpers
Zde najdeme TS s helpery. Dle potřeby zde můžeme vytvářet další.

<br>

### modules
Této složce se obsáhle věnuje celá sekce **Moduly**. Obsahuje všechny moduly.

<br>

## **Moduly**
---
Ve stacku jsou využívány moduly. Tyto moduly jsou logické celky, které se skládají z TS a SCSS.

Soubory je potřeba mít pojmenované:
- `nejakymodul.bundle.scss` pro SCSS
- `nejakymodul.bundle.ts` pro TS

Je to z toho důvodu, že se buildí a následně kopírují jen ty soubory, které končí `.bundle.scss` a `.bundle.ts(x)`.

Příklad:
```
/benefit
    benefit.bundle.scss
    benefit.bundle.ts
```
<br>

V modulech může být i samostatné SCSS nebo samostatné TS. 

Například:
```
/benefit
    benefit.bundle.scss

/calculator
    calculator.bundle.ts
```
<br>

### Konvence modulů
---
Soubory `.bundle.scss` a `.bundle.ts(x)` slouží k tomu, že se do nich nalinkují dílčí soubory a neměl by v nich být obsah jako takový.

U SCSS to znamená nalinkování dílčích `.scss` souborů a mixinů, proměnných atd.
Zde je uvedena struktura ve složce:
```
/benefit
    benefit.bundle.scss
    benefit.scss
```
<br>

V souboru `benefit.scss` je stylování, které se týká benefitů.
Příklad:

```
.benefit {
    ...

    .benefit-title {...}
}

...
```
<br>

V souboru `benefit.bundle.scss` je potom:

```
@import "../../core/imports.scss"; // tady jsou mixiny a proměnné
@import "./benefit.scss";
```
<br>

U TS je to obdobné, mějme příklad:

```
/chart
    chart.bundle.ts
    chart.ts
```

V souborech `.ts` jsou jednotlivé funkce, classy atd.
Příklad:

```
export const initChart = () => {
    ...
}

...
```
<br>

V souboru `.bundle.ts` je potom:

```
import { initChart } from "./chart.ts"

const chartModule: IModule = {
    onLoad: () => {
        initChart()
        ...
    }
}

export default chartModule
```
<br>

Pro více informací ohledně IModule a jeho interface viz sekci **TypeScript**

<br>

V případě, že mám více dílčích souborů, je konvence vytvořit složku components, aby byla struktura přehlednější.
Mějme příklad:

```
/chart
    chart.bundle.scss
    chart.scss
    chart.bundle.ts
    chart.ts
    line-chart.ts
    bar-chart.ts
    pie-chart.ts
```
<br>

Začíná to být nepřehledné - proto vytvoříme složku:

```
/chart
    /components
        line-chart.ts
        bar-chart.ts
        pie-chart.ts
    chart.bundle.scss
    chart.scss
    chart.bundle.ts
    chart.ts    
```

### Použití modulů
---
Moduly lze použít dvěma způsoby:
1. nalinkované v mainu (pokud jsou na všech stránkách)
1. v html (modul bude jen na stránce, kde má být)

<br>

**1. Link do mainu**

Main SCSS je v `/core/main.bundle.scss`, main TS je `/core/main.bundle.ts`.

V SCSS je to:

```
@import "../modules/header/header.bundle.scss";
```
<br>

V TS je potřeba použít metodu `registerModule(module: IModule)`:

```
import headerModule from "../modules/header/header.bundle.ts"

...

eventManager.onLoad(() => {
  registerModule(headerModule)
})

...
```
<br>

**2. Link do html**

Do view lze module nalinkovat přes html značky `<link>` a `<script>`.
<br>

## **TypeScript**
---
Stack používá čistě TypeScript a JavaScript není možné do modulů importovat. TypeScript má ve stacku strukturu následovně:

- soubory `.ts` obsahující funkce, class a jejich případné exporty atd.
- soubory `.bundle.ts`, ve kterých jsou dílčí funkce naimportovány a následně obsaženy v objektu typu IModule

Příklad:
 ```
 /chart
    chart.ts
    chart.bundle.ts
 ```
<br>

Potom `chart.ts` obsahuje například funkci pro natáhnutí dat a inicializaci grafu:

```
const fetchChartData = () => {
    ...
}

export const initChart = () => {
    fetchChartData()
    ...
}
```
<br>

Tento graf inicializujeme v `chart.bundle.ts` v IModule jakmile je načtena stránka:

```
import { initChart } from "./chart.ts"

const chartModule: IModule = {
    onLoad: () => {
        initChart()
    }
}

export default chartModule
```
<br>

Moduly jsou importovány buď v mainu, nebo dynamicky z views viz sekce **Moduly**. V obou případech k tomu slouží IModule.

<br>

### IModule
IModule je typ, který má interface:

```
declare type IModule = {
  onInit?: () => void
  onLoad?: () => void
  onResize?: () => void
  onScroll?: () => void
}
```
<br>

Jsou to nepovinné anonymní funkce, které se volají v určitý momemt lifecyklu modulu.

<br>

### Lifecyklus modulu
O lifecyklus se starají soubory `moduleImporter.ts` a `eventManager.ts`, proto do nich nesahejte, pokud nevíte co a proč děláte!

A cyklus je prováděn následovně

- při zaregistrování/dynamickém importu se okamžitě provede zavolání `onInit()` daného modulu
- po kompletním načtení dokumentu se provede volání `onLoad()` daného modulu
- při resize okna se volá `onResize()`
- při scrollování na stránce se zavolá `onScroll()`

<br>

Pokud máte raději kód (v `main.bundle.ts`):

```
// importované moduly přímo v mainu - měly by být jen ty, 
// které jsou opravdu na každé stránce
eventManager.onLoad(() => {
    ...
    registerModule(headerModule) // pokud je v modulu onInit tak se hned volá
    ...
})

// dynamické načítání modulů z views, pokud je v modulu onInit tak se hned volá
window._puxldr.forEach((x) => importModule(x))

// zavolání onLoad všech modulů
window.addEventListener(`load`, () => eventManager.fireOnLoad())

// zavolání onResize všech modulů
window.addEventListener(`resize`, () => eventManager.fireOnResize())

// zavolání onScroll všech modulů
window.addEventListener(`scroll`, () => eventManager.fireOnScroll())
```

<br>

Mějme případ:
- při načtení stránky chci inicializovat graf
- při změně velikosti chci graf překreslit

Potom postupujeme následovně:

Do souboru `chart.ts` vytvořím funkce `initChart` a `updateChart`

```
export const initChart = () => {
    ...
}

export const updateChart = () => {
    ...
}
```
<br>

Tyto funkce použijeme v `chart.bundle.ts` následovně:

```
import { initChart, updateChart } from "./chart.ts"

const chartModule: IModule = {
    onLoad: () => {
        initChart()
    },
    onResize: () => {
        updateChart()
    }
}

export default chartModule
```

<br>

### ESLint
Ve stacku je na TS nasazen ESLint - pokud budete mít v kódu chybu, linter vám bude shazovat build a nepůjde vystavit. Nesnažte se to obejít, je to pro vaše dobro. Díky linteru předejdete špatně hledatelným chybám a bude kód jednotnější a díky tomu nebudou zbytečné merge konflikty či nečitelné commit changes.

<br>

## **React**
---
Ve stacku je použití reactu snadné díky podpoře npm balíčků. Nicméně je zavedena určitá konvence.

React soubory vkládáme do složky `react`. V této složce je potom struktura:

```
/react
    /helpers
    /shared
    /my-app1
    /my-app2
    ...
```
<br>

Složka helpers slouží pro vkládání užitečných funkcí napříč aplikacemi (např. fce pro detekci velikosti zařízení).

V shared jsou komponenty, které jsou využívány napříč aplikacemi, nebo třeba obecné komponety typu DyTa (Dynamická Tabulka) nebo puxí CustomSelect atd.

Poté pro každou aplikaci v projektu děláme samostatné složky, například calculator, quiz atd.

<br>

### Struktura react aplikace
Reactí aplikace má konvenci struktury následovně:

```
/calculator
    /components
        /common
            /buttons
                ...
            /inputs
                ...
        /layout
            ...        
        /graph
            ...
        ...
        Calculator.tsx  
    CalculatorApp.tsx
```
<br>

V `CalculatorApp.tsx` je root aplikace - ten potom využijeme pro začlenění do modulu, viz níže.

Příklad:

```
import ReactDOM from "react-dom/client";
import React from "react";
import { Calculator } from "./components/Calculator";

export const CalculatorApp = () => {
    const target = document.querySelector("#calculator-root")

    if (target) {
        ReactDOM.createRoot(target).render(
            <React.StrictMode>
                <Calculator />
            </React.StrictMode>
        )
    }    
}
```

<br>

### Použití react aplikací v modulu
Pokud máme takto vytvořenou funkci CalculatorApp, tak ji jednoduše naimportujeme do
`/modules/calculator/calculator.bundle.ts` následovně:

```
import { CalculatorApp } from "../../react/calculator/CalculatorApp";

const calculatorModule: IModule = {
    onLoad: () => {
        CalculatorApp()
    }
}

export default calculatorModule
```
<br>

A následně tento modul můžeme přidat do view.
Například:

```
<div id="calculator-root"></div>

<theme-module has-css=false module="calculator/calculator" />
```

<br>

### CSS v Reactu
CSS v Reactu je možné mít více způsoby.

1. v SCSS bundle, na stejné úrovni jako `.bundle.ts`
2. import stylů v komponentách
3. styled componenty v Reactu
<br>

#### 1. v SCSS bundle
Nejpřímočařejší varianta

<br>

#### 2. import stylů v komponentě
Toto řešení generuje classy s id a generuje to css do hlavičky.

Mějme příklad:

```
import styles from "./compnent.scss"

export const Component = () => {
    return (
        <div className={styles["MyComponent"]}>
            <div className={styles["MyComponent-title"]}>
                ...
            </div>
            ...
        </div>
    )
}
```

<br>

#### 3. styled componenty
https://styled-components.com/docs

<br>

## **Assets**
---
V základu jsou v assetech obrázky, webfonty a ikony. Z této složky se jen kopíruje, neprovádí se žádný build ani nic jiného.

V případě potřeby jde přidat další složky a soubory.

Například pokud chci nějaké video z filesystemu, vytvořím si složku video v assets. Budu tedy mít:

```
/assets
    /fonts
    /icons
    /img
    /video
    ...
/core
...
```
<br>

Jako další krok, aby fungovalo kopírování z této složky, je potřeba upravit soubor `project.config.json`. V něm je object "copy" a do něj je potřeba přidat nově vytvořenou složku. V našem příkladu tedy:

```
{
    "copy": [
        {
            "src": "assets/img",
            "dest": "assets/img"
        },
        {
            "src": "assets/video",
            "dest": "assets/video"
        },
        {
            "src": "mjml",
            "dest": "mjml",
            "filter": ".xml$"
        },
        {
            "src": "admin",
            "dest": "admin"
        }
    ]
}
```

- `"src"` zdrojová cesta - udává cestu za /Theme/src/
- `"dest"` výstupní cesta - v dist a CMS složkách
- `"filter"` je možnost filtrovat jen některé soubory v dané složce viz u mjml v příkladu výše - zadává se regulární výraz 

<br>

## **Balíčky a knihovny**
---
Baličky se instalují přes `pnpm` viz `README.md`. Například:

```
pnpm i micromodal
```

Tento balíček pak použijeme např. v `modal.ts`:

```
import MicroModal from 'micromodal'

export const initModal = () => {
    MicroModal.init()
}
```

Pokud balíček má, použijeme CSS/SCSS z něj. Tyto styly linkujeme do `.bundle.scss`:

```
@import "../../core/imports.scss";
@import "../../plugins/slim-select/slimselect.bundle.scss";

@import "./charts";
```

<br>

## **Favicon**
---
Favicon se vkládá do složky `assets/img`, tím se automaticky kopíruje na místo, ze kterého si jej bere Kentico.

<br>

## **MJML**
---
Pro tvorbu emailových šablon se ve stacku používá MJML.

MJML má vlastní složku `mjml`. V této složce se vybírají soubory `.mjml`, které se transformují na html. Dále tu na Kentico stacku nalezneme připojené XML soubory, které se pouze kopírují - viz sekce **Assets**.

### Konvence
Pokud je využito partial mjml, je potřeba je pojmenovat s podtržítkem na začátku. Například `_header.mjml` jinak bude padat build, protože se ten partial mjml soubor bude snažit zkompilovat jako samostatný celek.

Pokud budeme mít více šablon, je vhodné je začít rozdělovat do složek.

```
/mjml
    /newsletter
        /_partials
            _partial1.mjml
            _partial2.mjml
            _partial3.mjml
        newsletter.mjml
        newsletter.xml
    /invoice
        /_partials
            ...
        invoice.mjml
        invoice.xml
    /_shared
        _header.mjml
        _footer.mjml
        ...
    ...
```

<br>
