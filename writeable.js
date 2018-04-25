let stream = require("stream");

class Writeable extends stream.Writable {
  constructor(opts) {
    super({ highWaterMark: 10, objectMode: true, ...opts });
  }

  _write(chunk, encoding, callback) {
    setTimeout(() => {
      callback();
    }, 100);
  }
}

let w = new Writeable();

w.on("close", () => {
  console.log("close");
});
w.on("drain", () => {
  console.log("drain");
});
w.on("error", err => {
  console.log(err);
});
// 在调用了 stream.end() 方法，且缓冲区数据都已经传给底层系统（underlying system）之后， 'finish' 事件将被触发。
w.on("finish", () => {
  console.log("finish2");
});

function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 100;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // 最后 一次
        writer.end(data, encoding, callback);
      } else {
        // 检查是否可以继续写入。
        // 这里不要传递 callback， 因为写入还没有结束！
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once("drain", write); //如果调用 stream.write(chunk) 方法返回 false，'drain' 事件会在适合恢复写入数据到流的时候触发。
    }
  }
}

writeOneMillionTimes(w, "1234567890", "utf8", () => {
  console.log("finish1");
  w.end();
});
