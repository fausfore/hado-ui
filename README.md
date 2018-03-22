
# A datepicker web component build with Stencil

It is based on [MomentJS](https://momentjs.com/docs/) and use [HammerJS](https://hammerjs.github.io/) for the gestures.

  
## How to use in Angular :

  

1 - Add the script in the *.angular-cli.json* :

```json

"assets": [
	"assets",
	"favicon.ico",
	{
		"glob": "**/*",
		"input": "../node_modules/st-datepicker/dist",
		"output": "./assets/st-datepicker"
	}
],
```

2 - Add the script tag in the *index.html* :

```html
<head>
	<script  src='assets/st-datepicker/st-datepicker.js'></script>
</head>
```

3 - Add the *CUSTOM_ELEMENTS_SCHEMA* in the main module :

```typescript

@NgModule({
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

```

4 - Add the component in your template :

```html
<oui-datepicker
	config="your_config_object">
</oui-datepicker>
```

  

## Properties

### Inputs

  
| Properties | Types | Value |
|--|--|--|
| mode | string | 'single' or 'range' |
| singleValue | date | 'YYYY-MM-DD' |
| rangeStartValue | date | 'YYYY-MM-DD' |
| rangeEndValue | date | 'YYYY-MM-DD' |
| calendarIcon | string | none |
| angleRightIcon | string | none |
| angleLeftIcon | string | none |
| closeIcon | string | none |
| labels | string | 'value1;value2' |
| activePreviousDate | boolean | none |

### Events

| Properties | Types | Value |
|--|--|--|
| selectSingleDate | Moment | 'single' or 'range' |