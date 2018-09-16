# datatable.js
Simple in-memory JavaScript data storage compatible with daqu queries

## API

### Create a datatable

```javascript
var tableInstance = datatable(
  ['key', 'name', 'age'],  // column names
  [    1,      0,     1],  // column types, 0 = string, 1 = number
  [                        // data columns
    [    1,      2,    3], //   key
    ['Jim', 'Jane', 'Jo'], //   name
    [   31,     27,   35]  //   age
  ],
  4                        // next key value
);
```

```javascript
var tableInstance = datatable(
  ['key', 'name', 'age'],  // column names
  [    1,      0,     1]   // column types, 0 = string, 1 = number
);

tableInstance.create({
  name: 'Jim',
  age:  31  
});

tableInstance.create({
  name: 'Jane',
  age:  27  
});

tableInstance.create({
  name: 'Jo',
  age:  35  
});
```

```javascript
var tableInstance = datatable().unserialize(serializedData);
```
