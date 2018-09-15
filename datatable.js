var datatable = (function() {

  datatable.version = '0.1.0';

  // factory function

  function datatable(names,  // ['key', ...] 
                     types,  // [0, 1, ...]
                     data,   // [[keys], [col 1], ...]
                     counter // integer
                     ) { 
    var i = 1;
    names = names || [];
    if (!data) {
      data = [
        []
      ];
      while (i < names.length) {
        data[i++] = [];
      }
    }
    return buildLookup({
      data: data,
      counter: counter || 1,
      names: names,
      types: types || [],
      create: create,
      read: read,
      update: update,
      remove: remove,
      serialize: serialize,
      unserialize: unserialize
    }, 0);
  }

  // private methods

  function buildLookup(datatable, index) {
    if (!index) {
      datatable.lookup = {};
    }
    var lookup = datatable.lookup,
      key = datatable.data[0],
      len = key.length;
    while (index < len) {
      lookup[key[index]] = index++;
    }
    return datatable;
  }

  // public methods

  function create(record, customID) {
    var datatable = this,
      keys = datatable.data[0],
      id = customID !== void 0 ? customID : datatable.counter++;
    keys[(datatable.lookup[id] = keys.length)] = record[datatable
      .names[0]] = id;
    return datatable.update(record);
  }

  function read(id) {
    var datatable = this,
      record = {},
      data = datatable.data,
      names = datatable.names,
      index = datatable.lookup[id],
      column = 0;
    if (data[0][index] != id) {
      return false;
    }
    while (column < data.length) {
      record[names[column]] = data[column++][index];
    }
    return record;
  }

  function update(record) {
    var datatable = this,
      data = datatable.data,
      names = datatable.names,
      types = datatable.types,
      id = record[names[0]],
      index = datatable.lookup[id],
      column = 0;
    if (data[0][index] != id) {
      return false;
    }
    while (column < data.length) {
      data[column][index] = types[column] == 1 ?
        +record[names[column++]] :
        (record[names[column++]] + '')
        .replace(/[\x1c-\x1f]/g, '');
    }
    return record;
  }

  function remove(id) {
    var datatable = this,
      data = datatable.data,
      lookup = datatable.lookup,
      index = lookup[id],
      column = 0;
    if (data[0][index] != id) {
      return false;
    }
    while (column < data.length) {
      data[column++].splice(index, 1);
    }
    lookup[id] = null;
    buildLookup(datatable, index);
    return true;
  }

  function unserialize(serialized) {
    var datatable = this,
      col,
      row, temp, data;
    serialized = ('' + serialized)
      .split('\x1c');
    datatable.counter = +serialized[0];
    datatable.names = ('' + serialized[1])
      .split('\x1d');
    datatable.types = ('' + serialized[2])
      .split('\x1d');
    data = datatable.data = [];
    for (col = 0; col < serialized.length - 3; col++) {
      temp = data[col] = serialized[col + 3].split('\x1d');
      if (datatable.types[col] == 1) {
        data[col] = [];
        for (row = 0; row < temp.length; row++) {
          data[col][row] = +temp[row];
        }
      }
    }
    buildLookup(datatable, 0);
  };

  function serialize(toSource, customID) {
    var d1 = '\x1c',
      d2 = '\x1d',
      datatable = this,
      data,
      col = 0,
      serialized = (customID !== void 0 ? customID : datatable.counter) +
      d1 + datatable.names.join(d2) + d1 + datatable.types.join(
        d2);
    data = datatable.data;
    while (col < data.length) {
      serialized += d1 + data[col++].join(d2);
    }
    return toSource ? '"' + serialized.replace(
      /[\x00-\x1f\"\\\/]/g,
      function(m) {
        return '\\x' + ('0' + m.charCodeAt(0)
            .toString(16))
          .slice(-2);
      }) + '"' : serialized;
  };

  return datatable;
})();
