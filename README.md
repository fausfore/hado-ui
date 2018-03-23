
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

 ```typescript
interface  Model {
	mode:  string; // 'single' or 'range'
	singleValue:  string; // single only
	StartDateSelected:  string  // range only
	EndDateSelected:  string  // range only
	calendarIcon:  string;
	angleRightIcon:  string;
	angleLeftIcon:  string;
	closeIcon:  string;
	activePreviousDate:  boolean; // Disable inputs before the current date
	startWeek: number // 0 => start on sunday and 1 => monday
	labels: {
		title:  string;
		title_2:  string; // range only
		datepickerBtnValue:  string; // single only
		months:  string[];
		days:  string[];
	}
}
 ```

### Events

| Properties | Types | Value |
|--|--|--|
| selectSingleDate | Moment | 'single' or 'range' |

### Update config object

```typescript
let my_datepicker_config = {/* properties */};
my_update_function() {

	my_datepicker_config.mode = 'range' // BAD
	
	my_datepicker_config = {
		...my_datepicker_config,
		mode: 'range'
	} // GOOD
	
}

```