var assert = require('assert');
var Dicer = require('..'),
    boundary = '-----------------------------168072824752491622650073',
    d = new Dicer({ boundary: boundary }),
    mb = 100,
    buffer = createMultipartBuffer(boundary, mb * 1024 * 1024),
    callbacks =
      { partBegin: -1,
        partEnd: -1,
        headerField: -1,
        headerValue: -1,
        partData: -1,
        end: -1,
      };


d.on('part', function(p) {
  callbacks.partBegin++;
  p.on('header', function(header) {
    /*for (var h in header)
      console.log('Part header: k: ' + inspect(h) + ', v: ' + inspect(header[h]));*/
  });
  p.on('data', function(data) {
    callbacks.partData++;
    //console.log('Part data: ' + inspect(data.toString()));
  });
  p.on('end', function() {
    //console.log('End of part\n');
    callbacks.partEnd++;
  });
});
d.on('end', function() {
  //console.log('End of parts');
  callbacks.end++;
});

var start = +new Date(),
    nparsed = d.write(buffer),
    duration = +new Date - start,
    mbPerSec = (mb / (duration / 1000)).toFixed(2);

console.log(mbPerSec+' mb/sec');

//assert.equal(nparsed, buffer.length);

function createMultipartBuffer(boundary, size) {
  var head =
        '--'+boundary+'\r\n'
      + 'content-disposition: form-data; name="field1"\r\n'
      + '\r\n'
    , tail = '\r\n--'+boundary+'--\r\n'
    , buffer = Buffer.allocUnsafe(size);

  buffer.write(head, 'ascii', 0);
  buffer.write(tail, 'ascii', buffer.length - tail.length);
  return buffer;
}

process.on('exit', function() {
  /*for (var k in callbacks) {
    assert.equal(0, callbacks[k], k+' count off by '+callbacks[k]);
  }*/
});
