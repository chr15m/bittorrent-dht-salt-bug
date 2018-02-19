#!/usr/bin/env node
var DHT = require('bittorrent-dht');
var ed = require('ed25519-supercop');

var dht = new DHT

// var seed = ed.createSeed();
var seed = Buffer("48088b9a8c356bd06b1f970668e6cbbf4c59813ba8e3ae5c7ff9e6ad879991a3", "hex");
var salt = new Buffer("yumyum");
var keypair = ed.createKeyPair(seed);

console.log("doing dht.put");

dht.put({
  "k": keypair.publicKey,
  "sign": function (buf) { return ed.sign(buf, keypair.publicKey, keypair.secretKey); },
  "v": new Buffer("hello"),
  "salt": salt,
  "seq": 2,
}, function(err, hash, count) {
  if (err) {
    console.log(err);
  } else {
    console.log("dht.put success:", hash.toString("hex"), salt.toString(), count);
  }
  process.exit();
});
