let stream = require("stream");

class Transform extends stream.Transform {
  constructor(opts) {
    super({ objectMode: true, ...opts });
  }
  _transform(data, encoding, callback) {
    console.log(data);
    this.push(data);
    callback();
  }
}

class Reader extends stream.Readable {
  constructor(opts) {
    super({ highWaterMark: 10, encoding: "utf8", ...opts });
  }
  _read(size) {
    let i = 0;
    while (i < 100) {
      this.push("" + i);
      i++;
    }
    this.push(null);
  }
}
class Writer extends stream.Writable {
  constructor(opts) {
    super({ highWaterMark: 10, objectMode: true, ...opts });
  }
  _write(chunk, encoding, callback) {
    console.log(chunk);
    setTimeout(() => {
      callback();
    }, 10);
  }
}

let r = new Reader();
let w = new Writer();
r.pipe(w);