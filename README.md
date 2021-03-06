# datatable.js
Simple in-memory JavaScript data storage compatible with daqu queries

```javascript
// create empty datatable with 3 fields,
// first field is record identifier
// fields are of type string by default

var data = datatable(['key', 'name', 'age']);

// create first record, store a copy

var recordCopy = data.create({
  name: 'Jim',
  age: 27
});

// identifier field is assigned on creation

console.log(recordCopy.key);
> "1"

// records are retreived by their identifier

console.log(data.read("1"));
> {key: "1", name: "Jim", age: "27"}

// records are also deleted by their identifier
// data.remove() returns a boolean to confirm deletion

console.log(data.remove("1"));
> true

// attempting to retrieve a nonexisting record returns false

console.log(data.read("1"));
> false

// attempting to delete a nonexisting record returns false

console.log(data.remove("1"));
> false




```

## API

### Instance creation

#### datatable([fieldNamesArray][, fieldTypesArray][, dataArray][, counterState])

#### Creation from serialized data

```javascript
var datatableInstance = datatable().unserialize(serializedData);
```

### Instance methods

#### datatableInstance.create(recordObject)

```javascript
var recordCopy = datatableInstance.create(recordObject);
```

#### datatableInstance.read(identifier)

```javascript
var recordCopy = datatableInstance.read(recordIdentifier);
```

#### datatableInstance.update(recordObject)

```javascript
var recordCopy = datatableInstance.update(recordObject);
```

#### datatableInstance.remove(identifier)

```javascript
var confirmRemoval = datatableInstance.remove(recordIdentifier);
```


#### datatableInstance.serialize()

```javascript
var serializedString = datatableInstance.serialize();
```

#### datatableInstance.unserialize(serializedString)

```javascript
datatableInstance.unserialize(serializedString);
```

### Instance properties

#### datatableInstance.names
#### datatableInstance.types
#### datatableInstance.data
#### datatableInstance.counter
#### datatableInstance.index

### Constructor properties

#### datatable.version
#### datatable.mixins

### Create a datatable

```
datatable(
  columnNames, // array of column names, 
               // first is name of key column
  columnTypes, // array of column types, 
               // 0 = string, 1 = number
               // defaults to all strings (if falsy)
  data,        // two-dimensional array of data
  nextKey      // integer, next key value
)
```


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

### Serialize and unserialize

```javascript
var serializedDataString = tableInstance.serialize();
var newTableInstance = datatable().unserialize(serializedDataString);
```

### Create, read, update and delete records

```javascript
var tableInstance = datatable(
  ['key', 'name', 'age'],  // column names
  [    1,      0,     1]   // column types, 0 = string, 1 = number
);

var record = {
  name: 'James',
  age: 45
};

tableInstance.create(record);     // record is copied to datatable
                                  // record.key is set
record.age = 44;                  // edit record field
tableInstance.update(record);     // update record in datatable
tableInstance.read(record.key);   // returns record copy
tableInstance.remove(record.key); // deletes record from datatable
```