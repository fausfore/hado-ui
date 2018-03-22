## A datepicker web component build with Stencil

to use in Angular :

1 - Add the script in the *.angular-cli.json* :
```json
"assets": [
    "assets",
    "favicon.ico",
    { "glob": "**/*", "input": "../node_modules/st-datepicker/dist", "output": "./assets/st-datepicker" }
],
```
2 - Add the script tag in the *index.html* :
```html
<head>
    <script src='assets/st-datepicker/st-datepicker.js'></script>
</head>
```
3 - Add the *CUSTOM_ELEMENTS_SCHEMA* in the main module :
```typescript
@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
```
4 - Add the component in your template :
```html
<oui-datepicker
    mode='single'
    calendar-icon="far fa-calendar-alt"
    angle-right-icon="fas fa-angle-right"
    angle-left-icon="fas fa-angle-left"
    close-icon="fas fa-times"
    active-previous-date=true
    labels="Date de début">
</oui-datepicker>
```

## configuration

| Properties        | Types           | Value  |
| ------------- |:-------------:| -----:|
| mode     | string | 'single' or 'range' |
| calendar-icon      | string      |   none |
| angle-right-icon | string      |    none |
| angle-left-icon      | string      |   none |
| close-icon | string      |    none |
| active-previous-date      | boolean      |   true or false |
| labels | string  |    'value1;value2' |
| single-value | string of date  |    'YYYY-MM-DD' |
| range-end-value | string of date  |    'YYYY-MM-DD' |
| range-start-value | string of date  |    'YYYY-MM-DD' |

