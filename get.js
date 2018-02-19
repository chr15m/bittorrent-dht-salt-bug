#!/usr/bin/env node
var DHT = require('bittorrent-dht');
var ed = require('ed25519-supercop');

var dht = new DHT

// var seed = ed.createSeed();
var hash = new Buffer("46a1d9e1a44f7a5bb9a7dd31266b470fe2fd5773", "hex");
var salt = new Buffer("yumyum");

console.log("doing dht.get");

dht.get(hash, {
  "verify": ed.verify,
  "salt": salt,
}, function(err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log("dht.get success:", res);
  }
  process.exit();
});
