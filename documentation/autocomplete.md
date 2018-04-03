
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
    placeholder?: string;
}
```

### **Methods** 

| name| effect|
|--|--|
| **initialize(props: Config)** | It will initialize the component for **React** and **Vanilla JS** |

### **Events** 

| name| effect|
|--|--|
| **NewValueList$** |  Return the array filtered |
| **selectedItem$** |  Return the value of the selected item |
| **isLoaded$** | Callback when the component is loaded |
