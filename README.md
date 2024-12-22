# Sosna

UI для адресной гирлянды



## Порты LiveServer наружу

_(потому что забываю)_

1. Параметры сети
2. Брандмауэр Windows
3. Дополнительные параметры
4. Создать правило для входящих подключений
5. Порт - 5500 (тот, который слушает LiveServer)

## Сборка без папки browser

```json 
"options": {
    "outputPath": {
        "base": "./docs",
        "browser": ""
    },
    "index": "src/index.html",
    "browser": "src/main.ts",
    "polyfills": [
        "zone.js"
    ],
    "tsConfig": "tsconfig.app.json",
    "assets": [
        {
        "glob": "**/*",
        "input": "public"
        }
    ],
    "styles": [
        "src/reset.css",
        "src/scheme.css",
        "src/styles.css"
    ],
    "scripts": []
}

```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
