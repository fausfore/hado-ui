
# Datepicker & Rangepicker

  
 #### *template* : 
```html
<hado-datepicker></hado-datepicker>
```

## API

**Props** : *config*
```typescript
interface Config {
	mode: string // "range" or "single"
	singleValue?: string;
	rangeStartValue?: string;
	rangeEndValue?: string;
	calendarIcon: string;
	angleRightIcon: string;
	angleLeftIcon: string;
	closeIcon: string;
	activePreviousDate: boolean;
	startWeek: number;
	labels: {
		datepickerBtnValue: string;
		rangeNextBtnValue: string;
		placeholder: string;
		placeholder_2: string;
		title: string;
		title_2: string;
		months: string[];
		days: string[]
	}
}
```

### **Methods** 

| name| effect|
|--|--|
| **initialize(props: Config)** | It will initialize the component for **React** and **Vanilla JS** |

### **Events** 

| name| effect|
|--|--|
| **selectSingleDate** |  Return the new value selected (datepicker only)|
| **startDateSelectedEvent** |  Return the new value selected (rangepicker only)|
| **endDateSelectedEvent** |  Return the new value selected (rangepicker only)|
| **isLoaded$** | Callback when the component is loaded |
