// Generated by LiveScript 1.5.0
/**
 * @package   noise-c.wasm
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2017, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
(function(){
  var randombytes, lib, test;
  randombytes = require('crypto').randomBytes;
  lib = require('..');
  test = require('tape');
  lib.ready(function(){
    var i$, ref$, len$, cipher;
    for (i$ = 0, len$ = (ref$ = ['NOISE_CIPHER_CHACHAPOLY', 'NOISE_CIPHER_AESGCM']).length; i$ < len$; ++i$) {
      cipher = ref$[i$];
      test("CipherState (" + cipher + "): Encryption/decryption without additional data", fn$);
      test("CipherState (" + cipher + "): Encryption/decryption with additional data", fn1$);
    }
    function fn$(t){
      var key, plaintext, cs1, ciphertext, ciphertext2, cs2, plaintext_decrypted;
      key = randombytes(32);
      plaintext = new Uint8Array(randombytes(10));
      t.doesNotThrow(function(){
        cs1 = new lib.CipherState(lib.constants[cipher]);
      }, "Constructor doesn't throw an error");
      t.equal(cs1.HasKey(), false, 'No key initially');
      cs1.InitializeKey(key);
      t.equal(cs1.HasKey(), true, 'Key was initialized');
      t.doesNotThrow(function(){
        ciphertext = cs1.EncryptWithAd(new Uint8Array, plaintext);
      }, "EncryptWithAd doesn't throw an error");
      t.equal(ciphertext.length, plaintext.length + 16, 'ciphertext length is plaintext length + MAC');
      t.notEqual(plaintext.toString(), ciphertext.slice(0, plaintext.length).toString(), 'Plaintext and ciphertext are different');
      ciphertext2 = cs1.EncryptWithAd(new Uint8Array, plaintext);
      t.notEqual(ciphertext.toString(), ciphertext2.toString(), "Subsequent encryption doesn't have the same result");
      cs1.free();
      t.throws(function(){
        cs1.EncryptWithAd(new Uint8Array, plaintext);
      }, "CipherState shouldn't be usable after `.free()` is called");
      cs2 = new lib.CipherState(lib.constants[cipher]);
      cs2.InitializeKey(key);
      t.doesNotThrow(function(){
        plaintext_decrypted = cs2.DecryptWithAd(new Uint8Array, ciphertext);
      }, "DecryptWithAd doesn't throw an error");
      t.equal(plaintext.toString(), plaintext_decrypted.toString(), 'Plaintext decrypted correctly');
      t.throws(function(){
        cs2.DecryptWithAd(new Uint8Array, ciphertext);
      }, Error, 'Subsequent decryption fails');
      cs2.free();
      t.end();
    }
    function fn1$(t){
      var key, ad, plaintext, cs1, ciphertext, ciphertext2, cs2, plaintext_decrypted, cs3;
      key = randombytes(32);
      ad = randombytes(256);
      plaintext = new Uint8Array(randombytes(10));
      t.doesNotThrow(function(){
        cs1 = new lib.CipherState(lib.constants[cipher]);
      }, "Constructor doesn't throw an error");
      t.equal(cs1.HasKey(), false, 'No key initially');
      cs1.InitializeKey(key);
      t.equal(cs1.HasKey(), true, 'Key was initialized');
      t.doesNotThrow(function(){
        ciphertext = cs1.EncryptWithAd(ad, plaintext);
      }, "EncryptWithAd doesn't throw an error");
      t.equal(ciphertext.length, plaintext.length + 16, 'ciphertext length is plaintext length + MAC');
      t.notEqual(plaintext.toString(), ciphertext.slice(0, plaintext.length).toString(), 'Plaintext and ciphertext are different');
      ciphertext2 = cs1.EncryptWithAd(ad, plaintext);
      t.notEqual(ciphertext.toString(), ciphertext2.toString(), "Subsequent encryption doesn't have the same result");
      cs1.free();
      t.throws(function(){
        cs1.EncryptWithAd(new Uint8Array, plaintext);
      }, "CipherState shouldn't be usable after `.free()` is called");
      cs2 = new lib.CipherState(lib.constants[cipher]);
      cs2.InitializeKey(key);
      t.doesNotThrow(function(){
        plaintext_decrypted = cs2.DecryptWithAd(ad, ciphertext);
      }, "DecryptWithAd doesn't throw an error");
      t.equal(plaintext.toString(), plaintext_decrypted.toString(), 'Plaintext decrypted correctly');
      t.throws(function(){
        cs2.DecryptWithAd(ad, ciphertext);
      }, Error, 'Subsequent decryption fails');
      cs2.free();
      cs3 = new lib.CipherState(lib.constants[cipher]);
      cs3.InitializeKey(key);
      t.throws(function(){
        cs2.DecryptWithAd(randombytes(256), ciphertext);
      }, Error, 'Plaintext decryption with incorrect additional data fails');
      cs3.free();
      t.end();
    }
  });
}).call(this);