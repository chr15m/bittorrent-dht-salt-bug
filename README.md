Test code to replicate webtorrent/bittorrent-dht#167 and check webtorrent/bittorrent-dht#190.

Steps to replicate the bug:

 * `npm install`
 * Run `put.js` to put a known value into the DHT for testing against.
 * Edit `node_modules/bittorrent-dht/client.js` add a `console.log("reply", r);` on line 391:

    if (isMutable) {
      console.log("reply", r);

This is so we can see the raw replies that live DHT nodes are sending back in response.

 * Run `get.js` and observe that the replies that come back do not include `salt`:

```
reply { id: <Buffer 46 a1 dd 8c 57 43 7e 02 e7 f5 36 01 a8 fb 9f 49 b3 4b d4 02>,
  k: <Buffer b0 3f 32 98 a2 94 b9 77 57 a2 a4 d1 3d 59 57 97 7f af 76 b1 ba fd 1a d1 3b 8f c1 2f f0 15 40 75>,
  nodes: <Buffer 46 a1 da ba 7e 0e f9 d7 11 d7 57 cb 43 54 e9 40 a7 1b f8 da bc a3 66 d8 c9 d1 46 a1 df c7 a4 00 00 f4 ad 74 39 d2 be 87 72 0c a1 65 7f 3a 5e 85 20 0f ... >,
  p: 52423,
  seq: 2,
  sig: <Buffer 3c e6 0a 09 6f c5 82 8b 45 69 72 18 18 fa ac b9 44 f6 e1 33 cf 7e e4 15 74 26 b6 91 3b 66 09 9a 88 2c 9c e8 80 6e 00 2d 26 27 60 91 83 8b 6a 50 98 6e ... >,
  token: <Buffer 9c c8 cb e5>,
  v: <Buffer 68 65 6c 6c 6f> }
```

Also observe `dht.get success: null` indicating we did not successfully fetch the `put` value from the DHT.

This is the failing condition replicated.

### Test fix

 * Apply patch webtorrent/bittorrent-dht#190 by adding `if (opts.salt) r.salt = new Buffer(opts.salt)` on line 390 before the `if` clause.

 * Run `get.js` again with the patch in place. This time observe the final response is successful, returning the value we `put` previously:

```
dht.get success: { id: <Buffer 46 a0 70 eb b3 a6 db 3c 87 0c 3e 99 24 5e 0d 1c 06 b7 47 bb>,
  k: <Buffer b0 3f 32 98 a2 94 b9 77 57 a2 a4 d1 3d 59 57 97 7f af 76 b1 ba fd 1a d1 3b 8f c1 2f f0 15 40 75>,
  nodes: <Buffer 46 a1 d3 f1 f1 bb e9 eb b3 a6 db 3c 87 0c 3e 99 24 5e 0d 90 a8 c2 a1 9d c4 42 46 a1 fd ab 43 a9 58 8a 30 57 26 d9 d7 b7 34 58 c8 51 c2 0b 74 6c 00 07 ... >,
  seq: 2,
  sig: <Buffer 3c e6 0a 09 6f c5 82 8b 45 69 72 18 18 fa ac b9 44 f6 e1 33 cf 7e e4 15 74 26 b6 91 3b 66 09 9a 88 2c 9c e8 80 6e 00 2d 26 27 60 91 83 8b 6a 50 98 6e ... >,
  token: <Buffer f3 1a be dd a3 a4 6e d0 59 75 03 72 b6 8c 63 c0 a7 b9 79 ed>,
  v: <Buffer 68 65 6c 6c 6f>,
  salt: <Buffer 79 75 6d 79 75 6d> }
```
