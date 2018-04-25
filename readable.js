let stream = require("stream");

class Reader extends stream.Readable {
  constructor(opts) {
    super({ highWaterMark: 10, encoding: "utf8", ...opts });
  }
  _read(size) {
    let value = `abcdefghijklmnopqrstuvwxzy1234567890`;
    size = Math.floor(Math.random() * value.length);
    let val = value.substr(0, size);
    console.log(`向缓存中添加${size}个字:${val}`);
    this.push(val);
  }
}

let r = new Reader();

setInterval(() => {
  console.log(r.read(2)); // 每隔2秒消息2个字
}, 2000);
