// Copyright 2009 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Test that getters can be defined and called with an index as a parameter.

var o = {};
o.x = 42;
o.__defineGetter__('0', function() { return o.x; });
assertEquals(o.x, o[0]);
assertEquals(o.x, o.__lookupGetter__('0')());

o.__defineSetter__('0', function(y) { o.x = y; });
assertEquals(o.x, o[0]);
assertEquals(o.x, o.__lookupGetter__('0')());
o[0] = 21;
assertEquals(21, o.x);
o.__lookupSetter__(0)(7);
assertEquals(7, o.x);

function Pair(x, y) {
  this.x = x;
  this.y = y;
};
Pair.prototype.__defineGetter__('0', function() { return this.x; });
Pair.prototype.__defineGetter__('1', function() { return this.y; });
Pair.prototype.__defineSetter__('0', function(x) { this.x = x; });
Pair.prototype.__defineSetter__('1', function(y) { this.y = y; });

var p = new Pair(2, 3);
assertEquals(2, p[0]);
assertEquals(3, p[1]);
p.x = 7;
p[1] = 8;
assertEquals(7, p[0]);
assertEquals(7, p.x);
assertEquals(8, p[1]);
assertEquals(8, p.y);


// Testing that a defined getter doesn't get lost due to inline caching.
var expected = {};
var actual = {};
for (var i = 0; i < 10; i++) {
  expected[i] = actual[i] = i;
}
function testArray() {
  for (var i = 0; i < 10; i++) {
    assertEquals(expected[i], actual[i]);
  }
}
actual[1000000] = -1;
testArray();
testArray();
actual.__defineGetter__('0', function() { return expected[0]; });
expected[0] = 42;
testArray();
expected[0] = 111;
testArray();

// The functionality is not implemented for arrays due to performance issues.
var a = [ 1 ];
a.__defineGetter__('2', function() { return 7; });
assertEquals(undefined, a[2]);
assertEquals(1, a.length);
var b = 0;
a.__defineSetter__('5', function(y) { b = y; });
assertEquals(1, a.length);
a[5] = 42;
assertEquals(0, b);
assertEquals(42, a[5]);
assertEquals(6, a.length);

// Using a setter where only a getter is defined throws an exception.
var q = {};
q.__defineGetter__('0', function() { return 42; });
assertThrows('q[0] = 7');