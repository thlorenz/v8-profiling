if (typeof print !== 'function') print = console.log;

var a = new Array(300);
var b;

for (var i = 0; i < a.length; i++) {
  if (i % 2 === 0) {
    delete a;
    a = new Array(300);
  }
  b = new Array(i);
  a[i] = i;
  b[0] = a[i];
  print(b[0]);
  gc()
}
