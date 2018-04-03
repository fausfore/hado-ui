# A Collection of web component build with Stencil

 
It is based on [MomentJS](https://momentjs.com/docs/) and use [HammerJS](https://hammerjs.github.io/) for the gestures.

  

## Components

* Datepicker & Rangepicker
* Timepicker

  

<p  align="center">
<img  src="https://github.com/fausfore/hado-ui/blob/master/documentation/assets/mode-mobile.png"/>
</p>

```bash
npm i hado-ui or yarn add hado-ui
```

## How to use in Angular :

1 - Add the script in the *.angular-cli.json* :

```json
"assets": [
	"...",
	"favicon.ico",
	{
		"glob": "**/*",
		"input": "../node_modules/hado-ui/dist",
		"output": "./assets/hado-ui"
	}
],
```

2 - Add the script tag in the main *index.html* :

```html
<head>
	<script  src='assets/hado-ui/hado-ui.js'></script>
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
<element
	[config]="your_config_object">
</element>
```

```typescript
// Change the ref in Angular use :
this.config.value_to_change = newValue;
```

## How to use in Vue :

```bash
npm i @stencil/webpack or yarn add @stencil/webpack
```

```javascript
// webpack.base.conf.js
const  stencil = require('@stencil/webpack');
const  StencilComponent =
	new  stencil.StencilPlugin({
	collections : [
		'../node_modules/hado-ui/dist'
	]
	});
module.export = {
	plugins: [StencilComponent]
}
```

```javascript
// main.js
import  'hado-ui/dist/hado-ui';
Vue.config.ignoredElements = ['st-',];
```

  

```html
<!-- vue files -->
<template>
	<template :config="configValue"></template>
</template>
```

## How to use in React :

For React you can use **@stencil/webpack** ( *must eject the webpack config* ) like Vue or copy the dist folder into your **public** folder.

```html
// add the script on the index.html
<script  src="%PUBLIC_URL%/static/js/hado-ui.js">
```

For the moment you can't use the React props binding until the React 17 so you will do like a vanilla :

```javascript
// define a state
this.state = {
config: {...}
};

// component calendar Ref
this.calendar;
componentDidMount () {
	this.calendar = document.querySelector('your_element');
	// Await the component mounting
	this.calendar.addEventListener('EventIsLoaded', () => {
		// Init component props
		this.calendar.initAppState(this.state.start)
		// remove event
		this.calendar.removeEventListener('datepickerIsLoaded', function() {
			console.log('stop event')
		})
	})
}

// If your state change
componentDidUpdate (prevProps, prevState) {
	this.state.config !== prevState.config
	? this.calendar.initAppState(this.state.start)
	: null
}
```

## How to use in Vanilla Js :

2 - Add scripts on the top of the *index.html* :

```html
<html>
	<head>
		<script  src="moment.min.js"/>
		<script  src="hammer.min.js"/>
		<script  src='assets/hado-ui/hado-ui.js'></script>
	</head>
	<body> ... </body>
</html>
```

2 - Add the script tag on the bottom of the *index.html* :

```html
<script>
	var  element = document.querySelector('your_element');
	var  config = {...};
	element.addEventListener('datepickerIsLoaded', function() {
		element.initAppState(config)
	});
</script>
```
