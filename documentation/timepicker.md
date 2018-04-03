# Timepicker

 #### *template* : 
```html
<hado-timepicker></hado-timepicker>
```

## API

**Props** : *config*
```typescript
Interface Config  {
	value: Moment,
	format: string,
	labels: {
		title: string,
		btnValue: string,
		closeIcon: string,
		timeIcon: string,
		placeholder: string
	}
}
```

### **Methods** 

| name| effect|
|--|--|
| **initialize(props: Config)*** | It will initialize the component for **React** and **Vanilla JS** |

### **Events** 

| name| effect|
|--|--|
| **dateSelected$** |  Return the new value selected|
| **isLoaded$** | Callback when the component is loaded |
