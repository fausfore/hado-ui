
# Autocomplete

  
 #### *template* : 
```html
<hado-autocomplete></hado-autocomplete>
```

## API

**Props** : *config*
```typescript
interface Config {
	values: any[]
	property?: string;
}
```

### **Methods** 

| name| effect|
|--|--|
| **initialize(props: Config)** | It will initialize the component for **React** and **Vanilla JS** |

### **Events** 

| name| effect|
|--|--|
| **NewValueList$** |  Return the array filtered|
| **isLoaded$** | Callback when the component is loaded |
