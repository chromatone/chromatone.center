var Aubio = function (Aubio) {
  Aubio = Aubio || {}

  var c
  c || (c = typeof Aubio !== 'undefined' ? Aubio : {})
  var n = {},
    r
  for (r in c) c.hasOwnProperty(r) && (n[r] = c[r])
  c.arguments = []
  c.thisProgram = './this.program'
  c.quit = function (a, b) {
    throw b
  }
  c.preRun = []
  c.postRun = []
  var u = !1,
    v = !1,
    aa = !1,
    ba = !1
  u = 'object' === typeof window
  v = 'function' === typeof importScripts
  aa = 'object' === typeof process && 'function' === typeof require && !u && !v
  ba = !u && !aa && !v
  var w = ''
  function ca(a) {
    return c.locateFile ? c.locateFile(a, w) : w + a
  }
  if (aa) {
    w = __dirname + '/'
    var da, ea
    c.read = function (a, b) {
      da || (da = require('fs'))
      ea || (ea = require('path'))
      a = ea.normalize(a)
      a = da.readFileSync(a)
      return b ? a : a.toString()
    }
    c.readBinary = function (a) {
      a = c.read(a, !0)
      a.buffer || (a = new Uint8Array(a))
      assert(a.buffer)
      return a
    }
    1 < process.argv.length &&
      (c.thisProgram = process.argv[1].replace(/\\/g, '/'))
    c.arguments = process.argv.slice(2)
    process.on('uncaughtException', function (a) {
      throw a
    })
    process.on('unhandledRejection', function () {
      process.exit(1)
    })
    c.quit = function (a) {
      process.exit(a)
    }
    c.inspect = function () {
      return '[Emscripten Module object]'
    }
  } else if (ba)
    'undefined' != typeof read &&
      (c.read = function (a) {
        return read(a)
      }),
      (c.readBinary = function (a) {
        if ('function' === typeof readbuffer)
          return new Uint8Array(readbuffer(a))
        a = read(a, 'binary')
        assert('object' === typeof a)
        return a
      }),
      'undefined' != typeof scriptArgs
        ? (c.arguments = scriptArgs)
        : 'undefined' != typeof arguments && (c.arguments = arguments),
      'function' === typeof quit &&
        (c.quit = function (a) {
          quit(a)
        })
  else if (u || v) {
    if (u) {
      var fa = this._currentScript
      0 !== fa.src.indexOf('blob:') && (w = '/')
    } else v && (w = '/')
    c.read = function (a) {
      var b = new XMLHttpRequest()
      b.open('GET', a, !1)
      b.send(null)
      return b.responseText
    }
    v &&
      (c.readBinary = function (a) {
        var b = new XMLHttpRequest()
        b.open('GET', a, !1)
        b.responseType = 'arraybuffer'
        b.send(null)
        return new Uint8Array(b.response)
      })
    c.readAsync = function (a, b, d) {
      var e = new XMLHttpRequest()
      e.open('GET', a, !0)
      e.responseType = 'arraybuffer'
      e.onload = function () {
        200 == e.status || (0 == e.status && e.response) ? b(e.response) : d()
      }
      e.onerror = d
      e.send(null)
    }
    c.setWindowTitle = function (a) {
      let title = a
    }
  }
  var ha =
      c.print ||
      ('undefined' !== typeof console
        ? console.log.bind(console)
        : 'undefined' !== typeof print
        ? print
        : null),
    x =
      c.printErr ||
      ('undefined' !== typeof printErr
        ? printErr
        : ('undefined' !== typeof console && console.warn.bind(console)) || ha)
  for (r in n) n.hasOwnProperty(r) && (c[r] = n[r])
  n = void 0
  function ia(a) {
    var b
    b || (b = 16)
    return Math.ceil(a / b) * b
  }
  var ja = {
      'f64-rem': function (a, b) {
        return a % b
      },
      debugger: function () {
        debugger
      },
    },
    ka = 0
  function assert(a, b) {
    a || y('Assertion failed: ' + b)
  }
  var la = 'undefined' !== typeof TextDecoder ? new TextDecoder('utf8') : void 0
  'undefined' !== typeof TextDecoder && new TextDecoder('utf-16le')
  var buffer, ma, z, na, oa, A, B, pa, qa
  function ra() {
    c.HEAP8 = ma = new Int8Array(buffer)
    c.HEAP16 = na = new Int16Array(buffer)
    c.HEAP32 = A = new Int32Array(buffer)
    c.HEAPU8 = z = new Uint8Array(buffer)
    c.HEAPU16 = oa = new Uint16Array(buffer)
    c.HEAPU32 = B = new Uint32Array(buffer)
    c.HEAPF32 = pa = new Float32Array(buffer)
    c.HEAPF64 = qa = new Float64Array(buffer)
  }
  var sa, C, ta, ua, va, wa, xa
  sa = C = ta = ua = va = wa = xa = 0
  function ya() {
    y(
      'Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' +
        E +
        ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ',
    )
  }
  var za = c.TOTAL_STACK || 5242880,
    E = c.TOTAL_MEMORY || 16777216
  E < za &&
    x(
      'TOTAL_MEMORY should be larger than TOTAL_STACK, was ' +
        E +
        '! (TOTAL_STACK=' +
        za +
        ')',
    )
  c.buffer
    ? (buffer = c.buffer)
    : ('object' === typeof WebAssembly &&
      'function' === typeof WebAssembly.Memory
        ? ((c.wasmMemory = new WebAssembly.Memory({
            initial: E / 65536,
            maximum: E / 65536,
          })),
          (buffer = c.wasmMemory.buffer))
        : (buffer = new ArrayBuffer(E)),
      (c.buffer = buffer))
  ra()
  function Aa(a) {
    for (; 0 < a.length; ) {
      var b = a.shift()
      if ('function' == typeof b) b()
      else {
        var d = b.B
        'number' === typeof d
          ? void 0 === b.F
            ? c.dynCall_v(d)
            : c.dynCall_vi(d, b.F)
          : d(void 0 === b.F ? null : b.F)
      }
    }
  }
  var Ba = [],
    Ca = [],
    Da = [],
    Ea = [],
    Fa = !1
  function Ga() {
    var a = c.preRun.shift()
    Ba.unshift(a)
  }
  var Ha = Math.cos,
    Ia = Math.sin,
    F = 0,
    Ja = null,
    G = null
  c.preloadedImages = {}
  c.preloadedAudios = {}
  function Ka(a) {
    return String.prototype.startsWith
      ? a.startsWith('data:application/octet-stream;base64,')
      : 0 === a.indexOf('data:application/octet-stream;base64,')
  }
  ;(function () {
    function a() {
      try {
        if (c.wasmBinary) return new Uint8Array(c.wasmBinary)
        if (c.readBinary) return c.readBinary(f)
        throw 'both async and sync fetching of the wasm failed'
      } catch (g) {
        y(g)
      }
    }
    function b() {
      return c.wasmBinary || (!u && !v) || 'function' !== typeof fetch
        ? new Promise(function (b) {
            b(a())
          })
        : fetch(f, { credentials: 'same-origin' })
            .then(function (a) {
              if (!a.ok) throw "failed to load wasm binary file at '" + f + "'"
              return a.arrayBuffer()
            })
            .catch(function () {
              return a()
            })
    }
    function d(a) {
      function d(a) {
        k = a.exports
        if (k.memory) {
          a = k.memory
          var b = c.buffer
          a.byteLength < b.byteLength &&
            x(
              'the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here',
            )
          b = new Int8Array(b)
          new Int8Array(a).set(b)
          c.buffer = buffer = a
          ra()
        }
        c.asm = k
        c.usingWasm = !0
        F--
        c.monitorRunDependencies && c.monitorRunDependencies(F)
        0 == F &&
          (null !== Ja && (clearInterval(Ja), (Ja = null)),
          G && ((a = G), (G = null), a()))
      }
      function e(a) {
        d(a.instance)
      }
      function g(a) {
        b()
          .then(function (a) {
            return WebAssembly.instantiate(a, h)
          })
          .then(a)
          .catch(function (a) {
            x('failed to asynchronously prepare wasm: ' + a)
            y(a)
          })
      }
      if ('object' !== typeof WebAssembly)
        return x('no native wasm support detected'), !1
      if (!(c.wasmMemory instanceof WebAssembly.Memory))
        return x('no native wasm Memory in use'), !1
      a.memory = c.wasmMemory
      h.global = { NaN: NaN, Infinity: Infinity }
      h['global.Math'] = Math
      h.env = a
      F++
      c.monitorRunDependencies && c.monitorRunDependencies(F)
      if (c.instantiateWasm)
        try {
          return c.instantiateWasm(h, d)
        } catch (vb) {
          return (
            x('Module.instantiateWasm callback failed with error: ' + vb), !1
          )
        }
      c.wasmBinary ||
      'function' !== typeof WebAssembly.instantiateStreaming ||
      Ka(f) ||
      'function' !== typeof fetch
        ? g(e)
        : WebAssembly.instantiateStreaming(
            fetch(f, { credentials: 'same-origin' }),
            h,
          )
            .then(e)
            .catch(function (a) {
              x('wasm streaming compile failed: ' + a)
              x('falling back to ArrayBuffer instantiation')
              g(e)
            })
      return {}
    }
    var e = 'aubio.wast',
      f = 'aubio.wasm',
      l = 'aubio.temp.asm.js'
    Ka(e) || (e = ca(e))
    Ka(f) || (f = ca(f))
    Ka(l) || (l = ca(l))
    var h = { global: null, env: null, asm2wasm: ja, parent: c },
      k = null
    c.asmPreload = c.asm
    var m = c.reallocBuffer
    c.reallocBuffer = function (a) {
      if ('asmjs' === p) var b = m(a)
      else
        a: {
          var d = c.usingWasm ? 65536 : 16777216
          0 < a % d && (a += d - (a % d))
          d = c.buffer.byteLength
          if (c.usingWasm)
            try {
              b =
                -1 !== c.wasmMemory.grow((a - d) / 65536)
                  ? (c.buffer = c.wasmMemory.buffer)
                  : null
              break a
            } catch (t) {
              b = null
              break a
            }
          b = void 0
        }
      return b
    }
    var p = ''
    c.asm = function (a, b) {
      if (!b.table) {
        a = c.wasmTableSize
        void 0 === a && (a = 1024)
        var e = c.wasmMaxTableSize
        b.table =
          'object' === typeof WebAssembly &&
          'function' === typeof WebAssembly.Table
            ? void 0 !== e
              ? new WebAssembly.Table({
                  initial: a,
                  maximum: e,
                  element: 'anyfunc',
                })
              : new WebAssembly.Table({ initial: a, element: 'anyfunc' })
            : Array(a)
        c.wasmTable = b.table
      }
      b.memoryBase || (b.memoryBase = c.STATIC_BASE)
      b.tableBase || (b.tableBase = 0)
      b = d(b)
      assert(b, 'no binaryen method succeeded.')
      return b
    }
  })()
  sa = 1024
  C = sa + 9312
  Ca.push(
    {
      B: function () {
        La()
      },
    },
    {
      B: function () {
        Ma()
      },
    },
    {
      B: function () {
        Na()
      },
    },
    {
      B: function () {
        Oa()
      },
    },
  )
  c.STATIC_BASE = sa
  c.STATIC_BUMP = 9312
  C += 16
  var H = 0
  function I() {
    H += 4
    return A[(H - 4) >> 2]
  }
  var Pa = {}
  function J(a, b) {
    H = b
    try {
      var d = I(),
        e = I(),
        f = I()
      a = 0
      J.J ||
        ((J.J = [null, [], []]),
        (J.P = function (a, b) {
          var d = J.J[a]
          assert(d)
          if (0 === b || 10 === b) {
            a = 1 === a ? ha : x
            a: {
              for (var e = (b = 0); d[e]; ) ++e
              if (16 < e - b && d.subarray && la)
                b = la.decode(d.subarray(b, e))
              else
                for (e = ''; ; ) {
                  var f = d[b++]
                  if (!f) {
                    b = e
                    break a
                  }
                  if (f & 128) {
                    var k = d[b++] & 63
                    if (192 == (f & 224))
                      e += String.fromCharCode(((f & 31) << 6) | k)
                    else {
                      var l = d[b++] & 63
                      if (224 == (f & 240)) f = ((f & 15) << 12) | (k << 6) | l
                      else {
                        var h = d[b++] & 63
                        if (240 == (f & 248))
                          f = ((f & 7) << 18) | (k << 12) | (l << 6) | h
                        else {
                          var bb = d[b++] & 63
                          if (248 == (f & 252))
                            f =
                              ((f & 3) << 24) |
                              (k << 18) |
                              (l << 12) |
                              (h << 6) |
                              bb
                          else {
                            var m = d[b++] & 63
                            f =
                              ((f & 1) << 30) |
                              (k << 24) |
                              (l << 18) |
                              (h << 12) |
                              (bb << 6) |
                              m
                          }
                        }
                      }
                      65536 > f
                        ? (e += String.fromCharCode(f))
                        : ((f -= 65536),
                          (e += String.fromCharCode(
                            55296 | (f >> 10),
                            56320 | (f & 1023),
                          )))
                    }
                  } else e += String.fromCharCode(f)
                }
            }
            a(b)
            d.length = 0
          } else d.push(b)
        }))
      for (b = 0; b < f; b++) {
        for (
          var l = A[(e + 8 * b) >> 2], h = A[(e + (8 * b + 4)) >> 2], k = 0;
          k < h;
          k++
        )
          J.P(d, z[l + k])
        a += h
      }
      return a
    } catch (m) {
      return ('undefined' !== typeof FS && m instanceof FS.I) || y(m), -m.L
    }
  }
  function Qa(a) {
    switch (a) {
      case 1:
        return 0
      case 2:
        return 1
      case 4:
        return 2
      case 8:
        return 3
      default:
        throw new TypeError('Unknown type size: ' + a)
    }
  }
  var Ra = void 0
  function K(a) {
    for (var b = ''; z[a]; ) b += Ra[z[a++]]
    return b
  }
  var L = {},
    M = {},
    Sa = {}
  function Ta(a) {
    if (void 0 === a) return '_unknown'
    a = a.replace(/[^a-zA-Z0-9_]/g, '$')
    var b = a.charCodeAt(0)
    return 48 <= b && 57 >= b ? '_' + a : a
  }
  function Ua(a, b) {
    a = Ta(a)
    return new Function(
      'body',
      'return function ' +
        a +
        '() {\n    "use strict";    return body.apply(this, arguments);\n};\n',
    )(b)
  }
  function Va(a) {
    var b = Error,
      d = Ua(a, function (b) {
        this.name = a
        this.message = b
        b = Error(b).stack
        void 0 !== b &&
          (this.stack =
            this.toString() + '\n' + b.replace(/^Error(:[^\n]*)?\n/, ''))
      })
    d.prototype = Object.create(b.prototype)
    d.prototype.constructor = d
    d.prototype.toString = function () {
      return void 0 === this.message
        ? this.name
        : this.name + ': ' + this.message
    }
    return d
  }
  var O = void 0
  function P(a) {
    throw new O(a)
  }
  var Wa = void 0
  function Xa(a) {
    throw new Wa(a)
  }
  function Ya(a, b, d) {
    function e(b) {
      b = d(b)
      b.length !== a.length && Xa('Mismatched type converter count')
      for (var e = 0; e < a.length; ++e) Q(a[e], b[e])
    }
    a.forEach(function (a) {
      Sa[a] = b
    })
    var f = Array(b.length),
      l = [],
      h = 0
    b.forEach(function (a, b) {
      M.hasOwnProperty(a)
        ? (f[b] = M[a])
        : (l.push(a),
          L.hasOwnProperty(a) || (L[a] = []),
          L[a].push(function () {
            f[b] = M[a]
            ++h
            h === l.length && e(f)
          }))
    })
    0 === l.length && e(f)
  }
  function Q(a, b, d) {
    d = d || {}
    if (!('argPackAdvance' in b))
      throw new TypeError(
        'registerType registeredInstance requires argPackAdvance',
      )
    var e = b.name
    a || P('type "' + e + '" must have a positive integer typeid pointer')
    if (M.hasOwnProperty(a)) {
      if (d.X) return
      P("Cannot register type '" + e + "' twice")
    }
    M[a] = b
    delete Sa[a]
    L.hasOwnProperty(a) &&
      ((b = L[a]),
      delete L[a],
      b.forEach(function (a) {
        a()
      }))
  }
  function Za(a) {
    P(a.a.f.b.name + ' instance already deleted')
  }
  var $a = void 0,
    ab = []
  function cb() {
    for (; ab.length; ) {
      var a = ab.pop()
      a.a.s = !1
      a['delete']()
    }
  }
  function R() {}
  var db = {}
  function eb(a, b, d) {
    if (void 0 === a[b].j) {
      var e = a[b]
      a[b] = function () {
        a[b].j.hasOwnProperty(arguments.length) ||
          P(
            "Function '" +
              d +
              "' called with an invalid number of arguments (" +
              arguments.length +
              ') - expects one of (' +
              a[b].j +
              ')!',
          )
        return a[b].j[arguments.length].apply(this, arguments)
      }
      a[b].j = []
      a[b].j[e.A] = e
    }
  }
  function fb(a, b) {
    c.hasOwnProperty(a)
      ? (P("Cannot register public name '" + a + "' twice"),
        eb(c, a, a),
        c.hasOwnProperty(void 0) &&
          P(
            'Cannot register multiple overloads of a function with the same number of arguments (undefined)!',
          ),
        (c[a].j[void 0] = b))
      : (c[a] = b)
  }
  function gb(a, b, d, e, f, l, h, k) {
    this.name = a
    this.constructor = b
    this.u = d
    this.o = e
    this.i = f
    this.T = l
    this.w = h
    this.S = k
    this.Z = []
  }
  function hb(a, b, d) {
    for (; b !== d; )
      b.w ||
        P(
          'Expected null or instance of ' +
            d.name +
            ', got an instance of ' +
            b.name,
        ),
        (a = b.w(a)),
        (b = b.i)
    return a
  }
  function ib(a, b) {
    if (null === b) return this.G && P('null is not a valid ' + this.name), 0
    b.a || P('Cannot pass "' + S(b) + '" as a ' + this.name)
    b.a.c || P('Cannot pass deleted object as a pointer of type ' + this.name)
    return hb(b.a.c, b.a.f.b, this.b)
  }
  function jb(a, b) {
    if (null === b) {
      this.G && P('null is not a valid ' + this.name)
      if (this.D) {
        var d = this.$()
        null !== a && a.push(this.o, d)
        return d
      }
      return 0
    }
    b.a || P('Cannot pass "' + S(b) + '" as a ' + this.name)
    b.a.c || P('Cannot pass deleted object as a pointer of type ' + this.name)
    !this.C &&
      b.a.f.C &&
      P(
        'Cannot convert argument of type ' +
          (b.a.h ? b.a.h.name : b.a.f.name) +
          ' to parameter type ' +
          this.name,
      )
    d = hb(b.a.c, b.a.f.b, this.b)
    if (this.D)
      switch (
        (void 0 === b.a.g &&
          P('Passing raw pointer to smart pointer is illegal'),
        this.ba)
      ) {
        case 0:
          b.a.h === this
            ? (d = b.a.g)
            : P(
                'Cannot convert argument of type ' +
                  (b.a.h ? b.a.h.name : b.a.f.name) +
                  ' to parameter type ' +
                  this.name,
              )
          break
        case 1:
          d = b.a.g
          break
        case 2:
          if (b.a.h === this) d = b.a.g
          else {
            var e = b.clone()
            d = this.aa(
              d,
              T(function () {
                e['delete']()
              }),
            )
            null !== a && a.push(this.o, d)
          }
          break
        default:
          P('Unsupporting sharing policy')
      }
    return d
  }
  function kb(a, b) {
    if (null === b) return this.G && P('null is not a valid ' + this.name), 0
    b.a || P('Cannot pass "' + S(b) + '" as a ' + this.name)
    b.a.c || P('Cannot pass deleted object as a pointer of type ' + this.name)
    b.a.f.C &&
      P(
        'Cannot convert argument of type ' +
          b.a.f.name +
          ' to parameter type ' +
          this.name,
      )
    return hb(b.a.c, b.a.f.b, this.b)
  }
  function lb(a) {
    return this.fromWireType(B[a >> 2])
  }
  function ob(a, b, d) {
    if (b === d) return a
    if (void 0 === d.i) return null
    a = ob(a, b, d.i)
    return null === a ? null : d.S(a)
  }
  var pb = {}
  function qb(a, b) {
    for (void 0 === b && P('ptr should not be undefined'); a.i; )
      (b = a.w(b)), (a = a.i)
    return pb[b]
  }
  function rb(a, b) {
    ;(b.f && b.c) || Xa('makeClassHandle requires ptr and ptrType')
    !!b.h !== !!b.g && Xa('Both smartPtrType and smartPtr must be specified')
    b.count = { value: 1 }
    return Object.create(a, { a: { value: b } })
  }
  function U(a, b, d, e, f, l, h, k, m, p, g) {
    this.name = a
    this.b = b
    this.G = d
    this.C = e
    this.D = f
    this.Y = l
    this.ba = h
    this.M = k
    this.$ = m
    this.aa = p
    this.o = g
    f || void 0 !== b.i
      ? (this.toWireType = jb)
      : ((this.toWireType = e ? ib : kb), (this.l = null))
  }
  function sb(a, b) {
    c.hasOwnProperty(a) || Xa('Replacing nonexistant public symbol')
    c[a] = b
    c[a].A = void 0
  }
  function V(a, b) {
    a = K(a)
    if (void 0 !== c['FUNCTION_TABLE_' + a]) var d = c['FUNCTION_TABLE_' + a][b]
    else if ('undefined' !== typeof FUNCTION_TABLE) d = FUNCTION_TABLE[b]
    else {
      d = c.asm['dynCall_' + a]
      void 0 === d &&
        ((d = c.asm['dynCall_' + a.replace(/f/g, 'd')]),
        void 0 === d && P('No dynCall invoker for signature: ' + a))
      for (var e = [], f = 1; f < a.length; ++f) e.push('a' + f)
      f =
        'return function ' +
        ('dynCall_' + a + '_' + b) +
        '(' +
        e.join(', ') +
        ') {\n'
      f +=
        '    return dynCall(rawFunction' +
        (e.length ? ', ' : '') +
        e.join(', ') +
        ');\n'
      d = new Function('dynCall', 'rawFunction', f + '};\n')(d, b)
    }
    'function' !== typeof d &&
      P('unknown function pointer with signature ' + a + ': ' + b)
    return d
  }
  var tb = void 0
  function ub(a) {
    a = wb(a)
    var b = K(a)
    X(a)
    return b
  }
  function xb(a, b) {
    function d(a) {
      f[a] || M[a] || (Sa[a] ? Sa[a].forEach(d) : (e.push(a), (f[a] = !0)))
    }
    var e = [],
      f = {}
    b.forEach(d)
    throw new tb(a + ': ' + e.map(ub).join([', ']))
  }
  function yb(a, b) {
    for (var d = [], e = 0; e < a; e++) d.push(A[(b >> 2) + e])
    return d
  }
  function zb(a) {
    for (; a.length; ) {
      var b = a.pop()
      a.pop()(b)
    }
  }
  function Ab(a) {
    var b = Function
    if (!(b instanceof Function))
      throw new TypeError(
        'new_ called with constructor type ' +
          typeof b +
          ' which is not a function',
      )
    var d = Ua(b.name || 'unknownFunctionName', function () {})
    d.prototype = b.prototype
    d = new d()
    a = b.apply(d, a)
    return a instanceof Object ? a : d
  }
  var Bb = [],
    Y = [{}, { value: void 0 }, { value: null }, { value: !0 }, { value: !1 }]
  function Cb(a) {
    4 < a && 0 === --Y[a].H && ((Y[a] = void 0), Bb.push(a))
  }
  function T(a) {
    switch (a) {
      case void 0:
        return 1
      case null:
        return 2
      case !0:
        return 3
      case !1:
        return 4
      default:
        var b = Bb.length ? Bb.pop() : Y.length
        Y[b] = { H: 1, value: a }
        return b
    }
  }
  function S(a) {
    if (null === a) return 'null'
    var b = typeof a
    return 'object' === b || 'array' === b || 'function' === b
      ? a.toString()
      : '' + a
  }
  function Db(a, b) {
    switch (b) {
      case 2:
        return function (a) {
          return this.fromWireType(pa[a >> 2])
        }
      case 3:
        return function (a) {
          return this.fromWireType(qa[a >> 3])
        }
      default:
        throw new TypeError('Unknown float type: ' + a)
    }
  }
  function Eb(a, b, d) {
    switch (b) {
      case 0:
        return d
          ? function (a) {
              return ma[a]
            }
          : function (a) {
              return z[a]
            }
      case 1:
        return d
          ? function (a) {
              return na[a >> 1]
            }
          : function (a) {
              return oa[a >> 1]
            }
      case 2:
        return d
          ? function (a) {
              return A[a >> 2]
            }
          : function (a) {
              return B[a >> 2]
            }
      default:
        throw new TypeError('Unknown integer type: ' + a)
    }
  }
  function Z(a) {
    a || P('Cannot use deleted val. handle = ' + a)
    return Y[a].value
  }
  function Fb(a, b) {
    var d = M[a]
    void 0 === d && P(b + ' has unknown type ' + ub(a))
    return d
  }
  for (var Gb = {}, Hb = Array(256), Ib = 0; 256 > Ib; ++Ib)
    Hb[Ib] = String.fromCharCode(Ib)
  Ra = Hb
  O = c.BindingError = Va('BindingError')
  Wa = c.InternalError = Va('InternalError')
  R.prototype.isAliasOf = function (a) {
    if (!(this instanceof R && a instanceof R)) return !1
    var b = this.a.f.b,
      d = this.a.c,
      e = a.a.f.b
    for (a = a.a.c; b.i; ) (d = b.w(d)), (b = b.i)
    for (; e.i; ) (a = e.w(a)), (e = e.i)
    return b === e && d === a
  }
  R.prototype.clone = function () {
    this.a.c || Za(this)
    if (this.a.v) return (this.a.count.value += 1), this
    var a = this.a
    a = Object.create(Object.getPrototypeOf(this), {
      a: {
        value: {
          count: a.count,
          s: a.s,
          v: a.v,
          c: a.c,
          f: a.f,
          g: a.g,
          h: a.h,
        },
      },
    })
    a.a.count.value += 1
    a.a.s = !1
    return a
  }
  R.prototype['delete'] = function () {
    this.a.c || Za(this)
    this.a.s && !this.a.v && P('Object already scheduled for deletion')
    --this.a.count.value
    if (0 === this.a.count.value) {
      var a = this.a
      a.g ? a.h.o(a.g) : a.f.b.o(a.c)
    }
    this.a.v || ((this.a.g = void 0), (this.a.c = void 0))
  }
  R.prototype.isDeleted = function () {
    return !this.a.c
  }
  R.prototype.deleteLater = function () {
    this.a.c || Za(this)
    this.a.s && !this.a.v && P('Object already scheduled for deletion')
    ab.push(this)
    1 === ab.length && $a && $a(cb)
    this.a.s = !0
    return this
  }
  U.prototype.U = function (a) {
    this.M && (a = this.M(a))
    return a
  }
  U.prototype.K = function (a) {
    this.o && this.o(a)
  }
  U.prototype.argPackAdvance = 8
  U.prototype.readValueFromPointer = lb
  U.prototype.deleteObject = function (a) {
    if (null !== a) a['delete']()
  }
  U.prototype.fromWireType = function (a) {
    function b() {
      return this.D
        ? rb(this.b.u, { f: this.Y, c: d, h: this, g: a })
        : rb(this.b.u, { f: this, c: a })
    }
    var d = this.U(a)
    if (!d) return this.K(a), null
    var e = qb(this.b, d)
    if (void 0 !== e) {
      if (0 === e.a.count.value) return (e.a.c = d), (e.a.g = a), e.clone()
      e = e.clone()
      this.K(a)
      return e
    }
    e = this.b.T(d)
    e = db[e]
    if (!e) return b.call(this)
    e = this.C ? e.R : e.pointerType
    var f = ob(d, this.b, e.b)
    return null === f
      ? b.call(this)
      : this.D
      ? rb(e.b.u, { f: e, c: f, h: this, g: a })
      : rb(e.b.u, { f: e, c: f })
  }
  c.getInheritedInstanceCount = function () {
    return Object.keys(pb).length
  }
  c.getLiveInheritedInstances = function () {
    var a = [],
      b
    for (b in pb) pb.hasOwnProperty(b) && a.push(pb[b])
    return a
  }
  c.flushPendingDeletes = cb
  c.setDelayFunction = function (a) {
    $a = a
    ab.length && $a && $a(cb)
  }
  tb = c.UnboundTypeError = Va('UnboundTypeError')
  c.count_emval_handles = function () {
    for (var a = 0, b = 5; b < Y.length; ++b) void 0 !== Y[b] && ++a
    return a
  }
  c.get_first_emval = function () {
    for (var a = 5; a < Y.length; ++a) if (void 0 !== Y[a]) return Y[a]
    return null
  }
  var Jb = C
  C = (C + 4 + 15) & -16
  xa = Jb
  ta = ua = ia(C)
  va = ta + za
  wa = ia(va)
  A[xa >> 2] = wa
  c.wasmTableSize = 83
  c.wasmMaxTableSize = 83
  c.N = {}
  c.O = {
    abort: y,
    enlargeMemory: function () {
      ya()
    },
    getTotalMemory: function () {
      return E
    },
    abortOnCannotGrowMemory: ya,
    ___setErrNo: function (a) {
      c.___errno_location && (A[c.___errno_location() >> 2] = a)
      return a
    },
    ___syscall140: function (a, b) {
      H = b
      try {
        var d = Pa.V()
        I()
        var e = I(),
          f = I(),
          l = I()
        FS.ea(d, e, l)
        A[f >> 2] = d.position
        d.W && 0 === e && 0 === l && (d.W = null)
        return 0
      } catch (h) {
        return ('undefined' !== typeof FS && h instanceof FS.I) || y(h), -h.L
      }
    },
    ___syscall146: J,
    ___syscall54: function (a, b) {
      H = b
      return 0
    },
    ___syscall6: function (a, b) {
      H = b
      try {
        var d = Pa.V()
        FS.close(d)
        return 0
      } catch (e) {
        return ('undefined' !== typeof FS && e instanceof FS.I) || y(e), -e.L
      }
    },
    __embind_register_bool: function (a, b, d, e, f) {
      var l = Qa(d)
      b = K(b)
      Q(a, {
        name: b,
        fromWireType: function (a) {
          return !!a
        },
        toWireType: function (a, b) {
          return b ? e : f
        },
        argPackAdvance: 8,
        readValueFromPointer: function (a) {
          if (1 === d) var e = ma
          else if (2 === d) e = na
          else if (4 === d) e = A
          else throw new TypeError('Unknown boolean type size: ' + b)
          return this.fromWireType(e[a >> l])
        },
        l: null,
      })
    },
    __embind_register_class: function (a, b, d, e, f, l, h, k, m, p, g, q, D) {
      g = K(g)
      l = V(f, l)
      k && (k = V(h, k))
      p && (p = V(m, p))
      D = V(q, D)
      var t = Ta(g)
      fb(t, function () {
        xb('Cannot construct ' + g + ' due to unbound types', [e])
      })
      Ya([a, b, d], e ? [e] : [], function (b) {
        b = b[0]
        if (e) {
          var d = b.b
          var f = d.u
        } else f = R.prototype
        b = Ua(t, function () {
          if (Object.getPrototypeOf(this) !== h)
            throw new O("Use 'new' to construct " + g)
          if (void 0 === m.m) throw new O(g + ' has no accessible constructor')
          var a = m.m[arguments.length]
          if (void 0 === a)
            throw new O(
              'Tried to invoke ctor of ' +
                g +
                ' with invalid number of parameters (' +
                arguments.length +
                ') - expected (' +
                Object.keys(m.m).toString() +
                ') parameters instead!',
            )
          return a.apply(this, arguments)
        })
        var h = Object.create(f, { constructor: { value: b } })
        b.prototype = h
        var m = new gb(g, b, h, D, d, l, k, p)
        d = new U(g, m, !0, !1, !1)
        f = new U(g + '*', m, !1, !1, !1)
        var q = new U(g + ' const*', m, !1, !0, !1)
        db[a] = { pointerType: f, R: q }
        sb(t, b)
        return [d, f, q]
      })
    },
    __embind_register_class_constructor: function (a, b, d, e, f, l) {
      var h = yb(b, d)
      f = V(e, f)
      Ya([], [a], function (a) {
        a = a[0]
        var d = 'constructor ' + a.name
        void 0 === a.b.m && (a.b.m = [])
        if (void 0 !== a.b.m[b - 1])
          throw new O(
            'Cannot register multiple constructors with identical number of parameters (' +
              (b - 1) +
              ") for class '" +
              a.name +
              "'! Overload resolution is currently only performed using the parameter count, not actual type info!",
          )
        a.b.m[b - 1] = function () {
          xb('Cannot construct ' + a.name + ' due to unbound types', h)
        }
        Ya([], h, function (e) {
          a.b.m[b - 1] = function () {
            arguments.length !== b - 1 &&
              P(
                d +
                  ' called with ' +
                  arguments.length +
                  ' arguments, expected ' +
                  (b - 1),
              )
            var a = [],
              h = Array(b)
            h[0] = l
            for (var k = 1; k < b; ++k)
              h[k] = e[k].toWireType(a, arguments[k - 1])
            h = f.apply(null, h)
            zb(a)
            return e[0].fromWireType(h)
          }
          return []
        })
        return []
      })
    },
    __embind_register_class_function: function (a, b, d, e, f, l, h, k) {
      var m = yb(d, e)
      b = K(b)
      l = V(f, l)
      Ya([], [a], function (a) {
        function e() {
          xb('Cannot call ' + f + ' due to unbound types', m)
        }
        a = a[0]
        var f = a.name + '.' + b
        k && a.b.Z.push(b)
        var p = a.b.u,
          t = p[b]
        void 0 === t ||
        (void 0 === t.j && t.className !== a.name && t.A === d - 2)
          ? ((e.A = d - 2), (e.className = a.name), (p[b] = e))
          : (eb(p, b, f), (p[b].j[d - 2] = e))
        Ya([], m, function (e) {
          var k = f,
            g = a,
            m = l,
            q = e.length
          2 > q &&
            P(
              "argTypes array size mismatch! Must at least get return value and 'this' types!",
            )
          var t = null !== e[1] && null !== g,
            D = !1
          for (g = 1; g < e.length; ++g)
            if (null !== e[g] && void 0 === e[g].l) {
              D = !0
              break
            }
          var mb = 'void' !== e[0].name,
            N = '',
            W = ''
          for (g = 0; g < q - 2; ++g)
            (N += (0 !== g ? ', ' : '') + 'arg' + g),
              (W += (0 !== g ? ', ' : '') + 'arg' + g + 'Wired')
          k =
            'return function ' +
            Ta(k) +
            '(' +
            N +
            ') {\nif (arguments.length !== ' +
            (q - 2) +
            ") {\nthrowBindingError('function " +
            k +
            " called with ' + arguments.length + ' arguments, expected " +
            (q - 2) +
            " args!');\n}\n"
          D && (k += 'var destructors = [];\n')
          var nb = D ? 'destructors' : 'null'
          N = 'throwBindingError invoker fn runDestructors retType classParam'.split(
            ' ',
          )
          m = [P, m, h, zb, e[0], e[1]]
          t &&
            (k += 'var thisWired = classParam.toWireType(' + nb + ', this);\n')
          for (g = 0; g < q - 2; ++g)
            (k +=
              'var arg' +
              g +
              'Wired = argType' +
              g +
              '.toWireType(' +
              nb +
              ', arg' +
              g +
              '); // ' +
              e[g + 2].name +
              '\n'),
              N.push('argType' + g),
              m.push(e[g + 2])
          t && (W = 'thisWired' + (0 < W.length ? ', ' : '') + W)
          k +=
            (mb ? 'var rv = ' : '') +
            'invoker(fn' +
            (0 < W.length ? ', ' : '') +
            W +
            ');\n'
          if (D) k += 'runDestructors(destructors);\n'
          else
            for (g = t ? 1 : 2; g < e.length; ++g)
              (q = 1 === g ? 'thisWired' : 'arg' + (g - 2) + 'Wired'),
                null !== e[g].l &&
                  ((k += q + '_dtor(' + q + '); // ' + e[g].name + '\n'),
                  N.push(q + '_dtor'),
                  m.push(e[g].l))
          mb && (k += 'var ret = retType.fromWireType(rv);\nreturn ret;\n')
          N.push(k + '}\n')
          e = Ab(N).apply(null, m)
          void 0 === p[b].j ? ((e.A = d - 2), (p[b] = e)) : (p[b].j[d - 2] = e)
          return []
        })
        return []
      })
    },
    __embind_register_emval: function (a, b) {
      b = K(b)
      Q(a, {
        name: b,
        fromWireType: function (a) {
          var b = Y[a].value
          Cb(a)
          return b
        },
        toWireType: function (a, b) {
          return T(b)
        },
        argPackAdvance: 8,
        readValueFromPointer: lb,
        l: null,
      })
    },
    __embind_register_float: function (a, b, d) {
      d = Qa(d)
      b = K(b)
      Q(a, {
        name: b,
        fromWireType: function (a) {
          return a
        },
        toWireType: function (a, b) {
          if ('number' !== typeof b && 'boolean' !== typeof b)
            throw new TypeError('Cannot convert "' + S(b) + '" to ' + this.name)
          return b
        },
        argPackAdvance: 8,
        readValueFromPointer: Db(b, d),
        l: null,
      })
    },
    __embind_register_integer: function (a, b, d, e, f) {
      function l(a) {
        return a
      }
      b = K(b)
      ;-1 === f && (f = 4294967295)
      var h = Qa(d)
      if (0 === e) {
        var k = 32 - 8 * d
        l = function (a) {
          return (a << k) >>> k
        }
      }
      var m = -1 != b.indexOf('unsigned')
      Q(a, {
        name: b,
        fromWireType: l,
        toWireType: function (a, d) {
          if ('number' !== typeof d && 'boolean' !== typeof d)
            throw new TypeError('Cannot convert "' + S(d) + '" to ' + this.name)
          if (d < e || d > f)
            throw new TypeError(
              'Passing a number "' +
                S(d) +
                '" from JS side to C/C++ side to an argument of type "' +
                b +
                '", which is outside the valid range [' +
                e +
                ', ' +
                f +
                ']!',
            )
          return m ? d >>> 0 : d | 0
        },
        argPackAdvance: 8,
        readValueFromPointer: Eb(b, h, 0 !== e),
        l: null,
      })
    },
    __embind_register_memory_view: function (a, b, d) {
      function e(a) {
        a >>= 2
        var b = B
        return new f(b.buffer, b[a + 1], b[a])
      }
      var f = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ][b]
      d = K(d)
      Q(
        a,
        {
          name: d,
          fromWireType: e,
          argPackAdvance: 8,
          readValueFromPointer: e,
        },
        { X: !0 },
      )
    },
    __embind_register_std_string: function (a, b) {
      b = K(b)
      Q(a, {
        name: b,
        fromWireType: function (a) {
          for (var b = B[a >> 2], d = Array(b), l = 0; l < b; ++l)
            d[l] = String.fromCharCode(z[a + 4 + l])
          X(a)
          return d.join('')
        },
        toWireType: function (a, b) {
          function d(a, b) {
            return a[b]
          }
          function e(a, b) {
            return a.charCodeAt(b)
          }
          b instanceof ArrayBuffer && (b = new Uint8Array(b))
          var h
          b instanceof Uint8Array
            ? (h = d)
            : b instanceof Uint8ClampedArray
            ? (h = d)
            : b instanceof Int8Array
            ? (h = d)
            : 'string' === typeof b
            ? (h = e)
            : P('Cannot pass non-string to std::string')
          var k = b.length,
            m = Kb(4 + k)
          B[m >> 2] = k
          for (var p = 0; p < k; ++p) {
            var g = h(b, p)
            255 < g &&
              (X(m),
              P('String has UTF-16 code units that do not fit in 8 bits'))
            z[m + 4 + p] = g
          }
          null !== a && a.push(X, m)
          return m
        },
        argPackAdvance: 8,
        readValueFromPointer: lb,
        l: function (a) {
          X(a)
        },
      })
    },
    __embind_register_std_wstring: function (a, b, d) {
      d = K(d)
      if (2 === b) {
        var e = function () {
          return oa
        }
        var f = 1
      } else
        4 === b &&
          ((e = function () {
            return B
          }),
          (f = 2))
      Q(a, {
        name: d,
        fromWireType: function (a) {
          for (
            var b = e(), d = B[a >> 2], l = Array(d), p = (a + 4) >> f, g = 0;
            g < d;
            ++g
          )
            l[g] = String.fromCharCode(b[p + g])
          X(a)
          return l.join('')
        },
        toWireType: function (a, d) {
          var k = e(),
            h = d.length,
            l = Kb(4 + h * b)
          B[l >> 2] = h
          for (var g = (l + 4) >> f, q = 0; q < h; ++q)
            k[g + q] = d.charCodeAt(q)
          null !== a && a.push(X, l)
          return l
        },
        argPackAdvance: 8,
        readValueFromPointer: lb,
        l: function (a) {
          X(a)
        },
      })
    },
    __embind_register_void: function (a, b) {
      b = K(b)
      Q(a, {
        da: !0,
        name: b,
        argPackAdvance: 0,
        fromWireType: function () {},
        toWireType: function () {},
      })
    },
    __emval_as: function (a, b, d) {
      a = Z(a)
      b = Fb(b, 'emval::as')
      var e = [],
        f = T(e)
      A[d >> 2] = f
      return b.toWireType(e, a)
    },
    __emval_decref: Cb,
    __emval_get_property: function (a, b) {
      a = Z(a)
      b = Z(b)
      return T(a[b])
    },
    __emval_incref: function (a) {
      4 < a && (Y[a].H += 1)
    },
    __emval_new_array: function () {
      return T([])
    },
    __emval_new_cstring: function (a) {
      var b = Gb[a]
      return T(void 0 === b ? K(a) : b)
    },
    __emval_new_object: function () {
      return T({})
    },
    __emval_run_destructors: function (a) {
      zb(Y[a].value)
      Cb(a)
    },
    __emval_set_property: function (a, b, d) {
      a = Z(a)
      b = Z(b)
      d = Z(d)
      a[b] = d
    },
    __emval_take_value: function (a, b) {
      a = Fb(a, '_emval_take_value')
      a = a.readValueFromPointer(b)
      return T(a)
    },
    _abort: function () {
      c.abort()
    },
    _emscripten_memcpy_big: function (a, b, d) {
      z.set(z.subarray(b, b + d), a)
      return a
    },
    _llvm_cos_f32: Ha,
    _llvm_log10_f32: function (a) {
      return Math.log(a) / Math.LN10
    },
    _llvm_sin_f32: Ia,
    DYNAMICTOP_PTR: xa,
    STACKTOP: ua,
  }
  var Lb = c.asm(c.N, c.O, buffer)
  c.asm = Lb
  var Oa = (c.__GLOBAL__sub_I_bind_cpp = function () {
      return c.asm.__GLOBAL__sub_I_bind_cpp.apply(null, arguments)
    }),
    La = (c.__GLOBAL__sub_I_fft_cc = function () {
      return c.asm.__GLOBAL__sub_I_fft_cc.apply(null, arguments)
    }),
    Na = (c.__GLOBAL__sub_I_pitch_cc = function () {
      return c.asm.__GLOBAL__sub_I_pitch_cc.apply(null, arguments)
    }),
    Ma = (c.__GLOBAL__sub_I_tempo_cc = function () {
      return c.asm.__GLOBAL__sub_I_tempo_cc.apply(null, arguments)
    }),
    wb = (c.___getTypeName = function () {
      return c.asm.___getTypeName.apply(null, arguments)
    }),
    X = (c._free = function () {
      return c.asm._free.apply(null, arguments)
    }),
    Kb = (c._malloc = function () {
      return c.asm._malloc.apply(null, arguments)
    })
  c.dynCall_ffii = function () {
    return c.asm.dynCall_ffii.apply(null, arguments)
  }
  c.dynCall_fi = function () {
    return c.asm.dynCall_fi.apply(null, arguments)
  }
  c.dynCall_fii = function () {
    return c.asm.dynCall_fii.apply(null, arguments)
  }
  c.dynCall_fiii = function () {
    return c.asm.dynCall_fiii.apply(null, arguments)
  }
  c.dynCall_ii = function () {
    return c.asm.dynCall_ii.apply(null, arguments)
  }
  c.dynCall_iii = function () {
    return c.asm.dynCall_iii.apply(null, arguments)
  }
  c.dynCall_iiii = function () {
    return c.asm.dynCall_iiii.apply(null, arguments)
  }
  c.dynCall_iiiii = function () {
    return c.asm.dynCall_iiiii.apply(null, arguments)
  }
  c.dynCall_iiiiii = function () {
    return c.asm.dynCall_iiiiii.apply(null, arguments)
  }
  c.dynCall_v = function () {
    return c.asm.dynCall_v.apply(null, arguments)
  }
  c.dynCall_vi = function () {
    return c.asm.dynCall_vi.apply(null, arguments)
  }
  c.dynCall_viii = function () {
    return c.asm.dynCall_viii.apply(null, arguments)
  }
  c.asm = Lb
  c.then = function (a) {
    if (c.calledRun) a(c)
    else {
      var b = c.onRuntimeInitialized
      c.onRuntimeInitialized = function () {
        b && b()
        a(c)
      }
    }
    return c
  }
  G = function Mb() {
    c.calledRun || Nb()
    c.calledRun || (G = Mb)
  }
  function Nb() {
    function a() {
      if (!c.calledRun && ((c.calledRun = !0), !ka)) {
        Fa || ((Fa = !0), Aa(Ca))
        Aa(Da)
        if (c.onRuntimeInitialized) c.onRuntimeInitialized()
        if (c.postRun)
          for (
            'function' == typeof c.postRun && (c.postRun = [c.postRun]);
            c.postRun.length;

          ) {
            var a = c.postRun.shift()
            Ea.unshift(a)
          }
        Aa(Ea)
      }
    }
    if (!(0 < F)) {
      if (c.preRun)
        for (
          'function' == typeof c.preRun && (c.preRun = [c.preRun]);
          c.preRun.length;

        )
          Ga()
      Aa(Ba)
      0 < F ||
        c.calledRun ||
        (c.setStatus
          ? (c.setStatus('Running...'),
            setTimeout(function () {
              setTimeout(function () {
                c.setStatus('')
              }, 1)
              a()
            }, 1))
          : a())
    }
  }
  c.run = Nb
  function y(a) {
    if (c.onAbort) c.onAbort(a)
    void 0 !== a ? (ha(a), x(a), (a = JSON.stringify(a))) : (a = '')
    ka = !0
    throw 'abort(' + a + '). Build with -s ASSERTIONS=1 for more info.'
  }
  c.abort = y
  if (c.preInit)
    for (
      'function' == typeof c.preInit && (c.preInit = [c.preInit]);
      0 < c.preInit.length;

    )
      c.preInit.pop()()
  c.noExitRuntime = !0
  Nb()

  return Aubio
}
export default Aubio.bind({
  _currentScript: {
    src: '/aubio.js',
  },
})
