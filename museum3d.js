/* Bảo tàng Chạm Đến Tương Lai — cảnh 3D cho từng khu (three.js r128) */
(function () {
  'use strict';
  var T = window.THREE;
  var M = {};
  /* chỉ dừng chuyển động khi người xem tự bấm nút "Tắt chuyển động" trên trang */
  function calm() { return document.documentElement.classList.contains('calm'); }

  /* ---------- tiện ích ---------- */
  function mat(c, o) {
    var p = { color: c, flatShading: true, roughness: 0.75, metalness: 0.05 };
    if (o) for (var k in o) p[k] = o[k];
    return new T.MeshStandardMaterial(p);
  }
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; return o; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function seedRand(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function base(g, r, top, side) {
    var grp = new T.Group();
    grp.add(mesh(new T.CylinderGeometry(r + 0.25, r + 0.45, 0.6, 48), mat(side || 0x1a2450), 0, -0.3, 0));
    var t = mesh(new T.CylinderGeometry(r, r, 0.12, 48), mat(top), 0, 0.06, 0); t.castShadow = false; grp.add(t);
    var ring = new T.Mesh(new T.TorusGeometry(r + 0.32, 0.04, 8, 96), new T.MeshBasicMaterial({ color: 0xf2c46d }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.02; grp.add(ring);
    g.add(grp); return grp;
  }
  function tree(h, c) {
    var g = new T.Group();
    g.add(mesh(new T.CylinderGeometry(0.06 * h, 0.09 * h, 0.5 * h, 6), mat(0x7a4b2a), 0, 0.25 * h, 0));
    g.add(mesh(new T.ConeGeometry(0.42 * h, 0.8 * h, 7), mat(c), 0, 0.75 * h, 0));
    g.add(mesh(new T.ConeGeometry(0.3 * h, 0.6 * h, 7), mat(c), 0, 1.12 * h, 0));
    return g;
  }
  function heartGeo(s, depth) {
    var sh = new T.Shape(), x = -0.25, y = -0.5;
    sh.moveTo(x + 0.25, y + 0.25); sh.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    sh.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35); sh.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    sh.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35); sh.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    sh.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    var g = new T.ExtrudeGeometry(sh, { depth: depth || 0.25, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.08, bevelThickness: 0.08, curveSegments: 18 });
    g.center(); g.rotateZ(Math.PI); g.scale(s, s, s); return g;
  }
  function person(c, h) {
    var g = new T.Group(); h = h || 1;
    g.add(mesh(new T.CylinderGeometry(0.16 * h, 0.24 * h, 0.7 * h, 10), mat(c), 0, 0.35 * h, 0));
    g.add(mesh(new T.SphereGeometry(0.17 * h, 16, 12), mat(0xf3c9a3, { flatShading: false }), 0, 0.88 * h, 0));
    g.add(mesh(new T.SphereGeometry(0.175 * h, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x3a2a20, { flatShading: false }), 0, 0.9 * h, -0.01));
    return g;
  }
  function canvasTex(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function globe(r) {
    var tex = canvasTex(1024, 512, function (x, w, h) {
      var gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a6fd0'); gr.addColorStop(.5, '#3f90ea'); gr.addColorStop(1, '#2a6fd0');
      x.fillStyle = gr; x.fillRect(0, 0, w, h);
      var R = seedRand(7);
      var lands = [[.2, .3, .09, .13], [.25, .62, .05, .16], [.5, .28, .06, .08], [.53, .55, .07, .15], [.7, .3, .14, .1], [.82, .65, .06, .05], [.5, .9, .3, .05]];
      lands.forEach(function (L) {
        for (var i = 0; i < 26; i++) {
          x.fillStyle = R() > .3 ? '#4fbf7a' : '#7fd38a';
          x.beginPath(); x.ellipse((L[0] + (R() - .5) * L[2] * 1.6) * w, (L[1] + (R() - .5) * L[3] * 1.6) * h, L[2] * w * (0.25 + R() * 0.35), L[3] * h * (0.25 + R() * 0.35), R() * 3, 0, 7); x.fill();
        }
      });
      x.fillStyle = 'rgba(255,255,255,.9)'; x.fillRect(0, 0, w, 14); x.fillRect(0, h - 18, w, 18);
    });
    var g = new T.Group();
    g.add(new T.Mesh(new T.SphereGeometry(r, 64, 48), new T.MeshStandardMaterial({ map: tex, roughness: .55, metalness: .05 })));
    var atm = new T.Mesh(new T.SphereGeometry(r * 1.06, 48, 32), new T.MeshBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: .16, side: T.BackSide }));
    g.add(atm); return g;
  }
  function turbine(h) {
    var g = new T.Group(), white = mat(0xf2f5ff, { flatShading: false });
    g.add(mesh(new T.CylinderGeometry(0.05 * h, 0.09 * h, 2 * h, 10), white, 0, h, 0));
    var rotor = new T.Group(); rotor.position.set(0, 2 * h, 0.12 * h);
    rotor.add(mesh(new T.SphereGeometry(0.1 * h, 12, 10), white));
    for (var i = 0; i < 3; i++) { var b = mesh(new T.BoxGeometry(0.09 * h, 0.95 * h, 0.03 * h), white, 0, 0.48 * h, 0); var p = new T.Group(); p.add(b); p.rotation.z = i * Math.PI * 2 / 3; rotor.add(p); }
    g.add(rotor); g.userData.rotor = rotor; return g;
  }
  function clock(h) {
    var g = new T.Group(), wood = mat(0x6b3d1f);
    g.add(mesh(new T.BoxGeometry(0.8 * h, 2.4 * h, 0.4 * h), wood, 0, 1.2 * h, 0));
    g.add(mesh(new T.BoxGeometry(0.95 * h, 0.2 * h, 0.5 * h), wood, 0, 2.45 * h, 0));
    var face = mesh(new T.CylinderGeometry(0.32 * h, 0.32 * h, 0.05 * h, 40), mat(0xfff4d6, { flatShading: false }), 0, 1.95 * h, 0.21 * h); face.rotation.x = Math.PI / 2; g.add(face);
    var hands = new T.Group(); hands.position.set(0, 1.95 * h, 0.25 * h);
    var hh = mesh(new T.BoxGeometry(0.03 * h, 0.2 * h, 0.01), mat(0x222222), 0, 0.1 * h, 0); var mh = mesh(new T.BoxGeometry(0.02 * h, 0.28 * h, 0.01), mat(0x222222), 0, 0.14 * h, 0);
    var hg = new T.Group(); hg.add(hh); var mg = new T.Group(); mg.add(mh); hands.add(hg); hands.add(mg); g.add(hands);
    var glass = mesh(new T.BoxGeometry(0.55 * h, 1.2 * h, 0.02), new T.MeshStandardMaterial({ color: 0x2a1a0e, roughness: .3 }), 0, 0.85 * h, 0.21 * h); g.add(glass);
    var pend = new T.Group(); pend.position.set(0, 1.55 * h, 0.24 * h);
    pend.add(mesh(new T.BoxGeometry(0.02 * h, 0.75 * h, 0.02), mat(0xd6a640, { metalness: .7, roughness: .3 }), 0, -0.38 * h, 0));
    var disc = mesh(new T.CylinderGeometry(0.11 * h, 0.11 * h, 0.03, 24), mat(0xf2c46d, { metalness: .8, roughness: .25, flatShading: false }), 0, -0.8 * h, 0); disc.rotation.x = Math.PI / 2; pend.add(disc);
    g.add(pend);
    g.userData = { pend: pend, hour: hg, min: mg }; return g;
  }

  /* ---------- các cảnh ---------- */

  function smooth(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }
  function diskPoint(r) { var a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r; return [Math.cos(a) * d, Math.sin(a) * d]; }
  /* sao băng */
  function shooting(w, n) {
    var list = [];
    for (var i = 0; i < n; i++) {
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
      var l = new T.Line(g, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: false }));
      l.userData = { ph: i * 3.7 + Math.random() * 3, per: 7 + Math.random() * 5 }; w.add(l); list.push(l);
    }
    return function (t) {
      list.forEach(function (l) {
        var u = ((t + l.userData.ph) % l.userData.per) / 1.1;
        if (u > 1) { l.material.opacity = 0; return; }
        if (!l.userData.a || u < .05) { l.userData.a = Math.random() * Math.PI * 2; l.userData.h = 6 + Math.random() * 3; }
        var a = l.userData.a, r = 9 - u * 7, x = Math.cos(a) * r, z = Math.sin(a) * r, y = l.userData.h - u * 3;
        var pos = l.geometry.attributes.position;
        pos.setXYZ(0, x, y, z); pos.setXYZ(1, x + Math.cos(a) * 1.4, y + .6, z + Math.sin(a) * 1.4); pos.needsUpdate = true;
        l.material.opacity = Math.sin(u * Math.PI) * .9;
      });
    };
  }
  /* chim bay */
  function bird(col) {
    var g = new T.Group(), m = new T.MeshBasicMaterial({ color: col || 0x22313a, side: T.DoubleSide });
    var wg = new T.BufferGeometry(); wg.setAttribute('position', new T.Float32BufferAttribute([0, 0, .06, .32, 0, -.06, 0, 0, -.12], 3));
    var L = new T.Mesh(wg, m), R = new T.Mesh(wg, m); R.scale.x = -1;
    g.add(L); g.add(R); g.add(new T.Mesh(new T.SphereGeometry(.035, 6, 4), m));
    g.userData = { L: L, R: R }; return g;
  }
  function spriteTex(ch, col) {
    var tex = canvasTex(128, 128, function (x, W, H) { x.fillStyle = col; x.font = 'bold 96px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, W / 2, H / 2 + 6); });
    return tex;
  }

  var BUILD = {};

  BUILD.k1 = function (w, add) {
    base(w, 5, 0x58b874, 0x2c4a2e);
    var R = seedRand(11);
    // núi
    [[-2.6, -2.6, 2.6, 1.5], [-0.6, -3.2, 3.3, 1.8], [1.8, -2.8, 2.4, 1.4], [3.2, -1.6, 1.8, 1.1]].forEach(function (m) {
      w.add(mesh(new T.ConeGeometry(m[3], m[2], 6), mat(0x5d7a6a), m[0], m[2] / 2 + .1, m[1]));
      w.add(mesh(new T.ConeGeometry(m[3] * .34, m[2] * .34, 6), mat(0xf4f7ff), m[0], m[2] * .84 + .1, m[1]));
    });
    // sông
    var curve = new T.CatmullRomCurve3([new T.Vector3(-0.4, .14, -3.2), new T.Vector3(.6, .14, -1.6), new T.Vector3(-.4, .14, .2), new T.Vector3(.9, .14, 1.9), new T.Vector3(.2, .14, 4.6)]);
    var river = new T.Mesh(new T.TubeGeometry(curve, 80, .42, 8, false), new T.MeshStandardMaterial({ color: 0x3fa6ff, emissive: 0x0d4a8a, roughness: .2, metalness: .1 }));
    river.scale.y = .25; river.position.y = .1; w.add(river);
    var sparks = [];
    for (var i = 0; i < 26; i++) { var s = mesh(new T.SphereGeometry(.05, 8, 6), new T.MeshBasicMaterial({ color: 0xe8f6ff })); s.userData.t = i / 26; w.add(s); sparks.push(s); }
    // cây
    var trees = [];
    for (i = 0; i < 46; i++) {
      var a = R() * Math.PI * 2, r = 1 + R() * 3.7, x = Math.cos(a) * r, z = Math.sin(a) * r, ok = true;
      for (var k = 0; k <= 20; k++) { var p = curve.getPoint(k / 20); if (Math.hypot(p.x - x, p.z - z) < .85) ok = false; }
      if (!ok || (z < -1.8 && Math.abs(x) < 3.6)) continue;
      var t = tree(.55 + R() * .55, [0x2f9a55, 0x3cb565, 0x27804a, 0x56c46f][Math.floor(R() * 4)]);
      t.position.set(x, .1, z); t.rotation.y = R() * 6; t.userData.ph = R() * 6; w.add(t); trees.push(t);
    }
    // biển báo
    var sign = new T.Group(); sign.position.set(-2.4, .1, 2.6); sign.rotation.y = .5;
    sign.add(mesh(new T.CylinderGeometry(.05, .05, 1.1, 8), mat(0x7a4b2a), 0, .55, 0));
    var board = mesh(new T.BoxGeometry(1.3, .65, .06), new T.MeshStandardMaterial({ map: canvasTex(512, 256, function (x, W, H) { x.fillStyle = '#fbf3df'; x.fillRect(0, 0, W, H); x.fillStyle = '#2f6b3f'; x.font = 'bold 44px "Pangolin","Baloo 2",sans-serif'; x.textAlign = 'center'; x.fillText('Bảo vệ thiên nhiên', W / 2, 110); x.fillText('là bảo vệ tương lai', W / 2, 175); }), roughness: .8 }), 0, 1.2, 0);
    sign.add(board); w.add(sign);
    // mây
    var clouds = new T.Group(); w.add(clouds);
    for (i = 0; i < 4; i++) {
      var c = new T.Group(), cm = mat(0xffffff, { flatShading: false, roughness: 1 });
      for (k = 0; k < 4; k++) c.add(mesh(new T.SphereGeometry(.35 + R() * .25, 14, 10), cm, k * .38 - .6, R() * .2, R() * .3));
      var ca = i * Math.PI / 2; c.position.set(Math.cos(ca) * 3.6, 4.2 + R() * .6, Math.sin(ca) * 3.6); clouds.add(c);
    }
    // lá rơi
    var leaves = [];
    for (i = 0; i < 24; i++) { var l = mesh(new T.PlaneGeometry(.14, .08), new T.MeshStandardMaterial({ color: [0x7fd38a, 0xf5b642, 0x5fd38d][i % 3], side: T.DoubleSide })); l.position.set(rnd(-4, 4), rnd(0, 6), rnd(-4, 4)); l.userData.s = rnd(.3, .7); w.add(l); leaves.push(l); }
    add.update = function (t, dt) {
      sparks.forEach(function (s) { var u = ((s.userData.t + t * .05) % 1 + 1) % 1; var p = curve.getPoint(u); s.position.set(p.x + Math.sin(u * 40) * .15, .2, p.z); });
      trees.forEach(function (tr) { tr.rotation.z = Math.sin(t * 1.2 + tr.userData.ph) * .03; });
      clouds.rotation.y = t * .04;
      leaves.forEach(function (l) { l.position.y -= dt * l.userData.s; l.position.x += Math.sin(t + l.userData.s * 9) * dt * .3; l.rotation.x += dt * 2; l.rotation.y += dt; if (l.position.y < .1) l.position.y = 6; });
    };

    /* mưa – cầu vồng – chim */
    try {
    var RN = 420, rp = new Float32Array(RN * 6), rg = new T.BufferGeometry();
    for (i = 0; i < RN; i++) { var d = diskPoint(4.6), ry = rnd(.2, 5.2); rp.set([d[0], ry, d[1], d[0] - .03, ry - .32, d[1]], i * 6); }
    rg.setAttribute('position', new T.BufferAttribute(rp, 3));
    var rain = new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0 })); w.add(rain);
    var bow = new T.Group(); bow.position.set(0, 0, -4.2); w.add(bow);
    [0xff4d4d, 0xff9a3c, 0xffe14d, 0x5fd38d, 0x4da6ff, 0x5b5bd6, 0xa15bd6].forEach(function (c, k) {
      var tr = new T.Mesh(new T.TorusGeometry(4.4 - k * .14, .07, 6, 64, Math.PI), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, fog: false })); bow.add(tr);
    });
    var birds = [];
    for (i = 0; i < 6; i++) { var bd = bird(); bd.userData.ph = i * 1.05; bd.userData.r = 3.2 + (i % 3) * .6; bd.userData.y = 3.6 + (i % 2) * .5; w.add(bd); birds.push(bd); }
    var cloudMats = []; clouds.traverse(function (ob) { if (ob.material && cloudMats.indexOf(ob.material) < 0) cloudMats.push(ob.material); });
    var cloudBase = null, cloudDark = new T.Color(0x6a7686).convertSRGBToLinear();
    var _u1 = add.update;
    add.update = function (t, dt) {
      _u1(t, dt);
      var cyc = t % 28, rainK = smooth(8, 10, cyc) * (1 - smooth(16, 18, cyc)), bowK = smooth(16.5, 18.5, cyc) * (1 - smooth(24, 27, cyc));
      rain.material.opacity = rainK * .75; rain.visible = rainK > .01;
      if (rain.visible) { for (var j = 0; j < RN; j++) { var o2 = j * 6 + 1; rp[o2] -= dt * 7; rp[o2 + 3] -= dt * 7; if (rp[o2] < .15) { rp[o2] += 5; rp[o2 + 3] += 5; } } rg.attributes.position.needsUpdate = true; }
      if (!cloudBase) cloudBase = cloudMats.map(function (m) { return m.color.clone(); });
      cloudMats.forEach(function (m, j) { m.color.copy(cloudBase[j]).lerp(cloudDark, rainK * .8); });
      bow.children.forEach(function (tr) { tr.material.opacity = bowK * .55; }); bow.visible = bowK > .01;
      birds.forEach(function (bd) { var th = bd.userData.ph + t * .35; bd.position.set(Math.cos(th) * bd.userData.r, bd.userData.y + Math.sin(t * 1.3 + bd.userData.ph) * .15, Math.sin(th) * bd.userData.r); bd.rotation.y = -th; var f = Math.sin(t * 11 + bd.userData.ph * 3) * .6; bd.userData.L.rotation.z = f; bd.userData.R.rotation.z = -f; });
    };
    } catch (err) { if (window.console) console.warn('Hiệu ứng phụ lỗi, bỏ qua:', err); }
    add.spots = [new T.Vector3(-.6, 1.9, -2.2), new T.Vector3(.4, .3, 1.4), new T.Vector3(-2.4, 1.4, 2.6)];
    add.bg = 0x0f2a24;
  };

  BUILD.k2 = function (w, add) {
    add.limit = 0.9;
    var floor = mesh(new T.BoxGeometry(9, .3, 7), mat(0x8a5a32), 0, -.15, 0); w.add(floor);
    for (var i = 0; i < 9; i++) { var plank = mesh(new T.BoxGeometry(.02, .01, 7), mat(0x5e3a1d), -4.5 + i + .5, .01, 0); w.add(plank); }
    var wallM = mat(0xc89a5c, { flatShading: false });
    w.add(mesh(new T.BoxGeometry(9, 4.6, .25), wallM, 0, 2.3, -3.5));
    w.add(mesh(new T.BoxGeometry(.25, 4.6, 7), wallM, -4.5, 2.3, 0));
    w.add(mesh(new T.BoxGeometry(9, .25, .3), mat(0x6b3d1f), 0, .12, -3.35));
    // tường ảnh
    var sepia = ['#7a5a3a', '#5e4630', '#8c6a46', '#4a3828', '#9a7a54'];
    var R = seedRand(23);
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
      var fx = -3 + c * 1.05, fy = 2.2 + r * .9;
      var fr = mesh(new T.BoxGeometry(.78, .66, .06), mat(0x2b1a0e), fx, fy, -3.33);
      var face = new T.Mesh(new T.PlaneGeometry(.62, .5), new T.MeshStandardMaterial({ map: canvasTex(128, 104, function (x, W, H) {
        x.fillStyle = sepia[Math.floor(R() * 5)]; x.fillRect(0, 0, W, H); x.fillStyle = 'rgba(255,240,210,.35)'; x.fillRect(0, H * .7, W, H * .3);
        x.fillStyle = 'rgba(30,20,10,.75)'; var n = 1 + Math.floor(R() * 3);
        for (var k = 0; k < n; k++) { var cx = W * (k + 1) / (n + 1); x.beginPath(); x.arc(cx, H * .38, 11, 0, 7); x.fill(); x.fillRect(cx - 15, H * .52, 30, 40); }
      }) }));
      face.position.set(fx, fy, -3.29); w.add(fr); w.add(face);
    }
    // đồng hồ
    var ck = clock(1.1); ck.position.set(3.2, 0, -2.9); w.add(ck);
    // bàn và thư
    var desk = new T.Group(); desk.position.set(-1.6, 0, .6); desk.rotation.y = .25;
    desk.add(mesh(new T.BoxGeometry(2.2, .1, 1.1), mat(0x9b6a3c), 0, 1, 0));
    [[-1, -.45], [1, -.45], [-1, .45], [1, .45]].forEach(function (p) { desk.add(mesh(new T.BoxGeometry(.1, 1, .1), mat(0x6b3d1f), p[0], .5, p[1])); });
    for (i = 0; i < 4; i++) { var lt = mesh(new T.BoxGeometry(.42, .012, .3), mat(0xfbf3df, { flatShading: false }), -.5 + i * .25, 1.06 + i * .013, rnd(-.2, .2)); lt.rotation.y = rnd(-.4, .4); desk.add(lt); }
    var env = mesh(new T.BoxGeometry(.5, .02, .32), mat(0xe9d7ae), .6, 1.07, .1); env.rotation.y = -.3; desk.add(env);
    var lampG = new T.Group(); lampG.position.set(.8, 1.05, -.3);
    lampG.add(mesh(new T.CylinderGeometry(.03, .03, .55, 8), mat(0x333333), 0, .28, 0));
    lampG.add(mesh(new T.ConeGeometry(.22, .25, 16, 1, true), mat(0x2f6b3f, { side: T.DoubleSide }), 0, .6, 0));
    var bulb = mesh(new T.SphereGeometry(.07, 12, 8), new T.MeshBasicMaterial({ color: 0xffe2a0 }), 0, .52, 0); lampG.add(bulb);
    var lamp = new T.PointLight(0xffc670, 1.4, 6, 2); lamp.position.set(0, .5, 0); lampG.add(lamp);
    desk.add(lampG); w.add(desk);
    var chair = new T.Group(); chair.position.set(-1.4, 0, 1.6); chair.rotation.y = .25;
    chair.add(mesh(new T.BoxGeometry(.6, .08, .6), mat(0x6b3d1f), 0, .6, 0)); chair.add(mesh(new T.BoxGeometry(.6, .7, .08), mat(0x6b3d1f), 0, .95, .28));
    [[-.25, -.25], [.25, -.25], [-.25, .25], [.25, .25]].forEach(function (p) { chair.add(mesh(new T.BoxGeometry(.06, .6, .06), mat(0x5e3a1d), p[0], .3, p[1])); });
    w.add(chair);
    // ảnh bay
    var pols = [];
    for (i = 0; i < 7; i++) {
      var pg = new T.Group(), pb = mesh(new T.BoxGeometry(.42, .5, .01), mat(0xfaf6ec, { flatShading: false }));
      var pi = new T.Mesh(new T.PlaneGeometry(.34, .32), new T.MeshBasicMaterial({ color: new T.Color(sepia[i % 5]) })); pi.position.set(0, .04, .006);
      pg.add(pb); pg.add(pi); pg.position.set(rnd(-3, 3.5), rnd(.5, 4.5), rnd(-1.5, 2.5)); pg.userData = { s: rnd(.15, .3), ph: rnd(0, 6) }; w.add(pg); pols.push(pg);
    }
    // bụi thời gian
    var pts = new T.BufferGeometry(), arr = [];
    for (i = 0; i < 260; i++) arr.push(rnd(-4, 4), rnd(0, 4.5), rnd(-3, 3));
    pts.setAttribute('position', new T.Float32BufferAttribute(arr, 3));
    var dust = new T.Points(pts, new T.PointsMaterial({ color: 0xffd98a, size: .045, transparent: true, opacity: .75 })); w.add(dust);
    add.update = function (t, dt) {
      ck.userData.pend.rotation.z = Math.sin(t * 2.2) * .28;
      ck.userData.min.rotation.z = -t * .5; ck.userData.hour.rotation.z = -t * .04;
      pols.forEach(function (p) { p.position.y += dt * p.userData.s; p.rotation.y = Math.sin(t * .6 + p.userData.ph) * .7; p.rotation.z = Math.sin(t * .4 + p.userData.ph) * .2; if (p.position.y > 5) p.position.y = .3; });
      dust.rotation.y = t * .02; lamp.intensity = 1.3 + Math.sin(t * 9) * .05;
    };

    /* cửa sổ mưa đêm – máy hát – nốt nhạc */
    try {
    var winG = new T.Group(); winG.position.set(1.55, 2.85, -3.37); w.add(winG);
    var sky = new T.Mesh(new T.PlaneGeometry(1.5, 1.3), new T.MeshBasicMaterial({ map: canvasTex(256, 224, function (x, W, H) {
      var gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0d1a3a'); gr.addColorStop(1, '#2b3f6e'); x.fillStyle = gr; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fff6d8'; x.beginPath(); x.arc(190, 52, 22, 0, 7); x.fill(); x.fillStyle = '#0d1a3a'; x.beginPath(); x.arc(200, 46, 20, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.8)'; for (var k = 0; k < 40; k++) x.fillRect(Math.random() * W, Math.random() * H * .6, 1.5, 1.5);
      x.fillStyle = '#1a2440'; x.fillRect(0, H - 50, W, 50); x.fillStyle = '#ffd98a'; for (k = 0; k < 14; k++) x.fillRect(10 + k * 17, H - 40 + (k % 3) * 9, 5, 5);
    }) }));
    winG.add(sky);
    var fm = mat(0x5e3a1d);
    [[0, .69, 1.66, .1], [0, -.69, 1.66, .1], [-.79, 0, .1, 1.4], [.79, 0, .1, 1.4], [0, 0, .05, 1.3], [0, 0, 1.5, .05]].forEach(function (b) { winG.add(mesh(new T.BoxGeometry(b[2], b[3], .08), fm, b[0], b[1], .03)); });
    winG.add(mesh(new T.BoxGeometry(1.8, .08, .25), fm, 0, -.76, .1));
    var WN = 70, wp = new Float32Array(WN * 6), wgeo = new T.BufferGeometry();
    for (i = 0; i < WN; i++) { var wx = rnd(-.72, .72), wy = rnd(-.62, .62); wp.set([wx, wy, .015, wx - .02, wy - .12, .015], i * 6); }
    wgeo.setAttribute('position', new T.BufferAttribute(wp, 3));
    winG.add(new T.LineSegments(wgeo, new T.LineBasicMaterial({ color: 0xbcd6ff, transparent: true, opacity: .7 })));
    var rec = new T.Group(); rec.position.set(-.85, 1.075, .32); desk.add(rec);
    rec.add(mesh(new T.BoxGeometry(.5, .08, .5), mat(0x4a2a14), 0, 0, 0));
    var disc2 = new T.Group(); disc2.position.y = .05; rec.add(disc2);
    disc2.add(mesh(new T.CylinderGeometry(.2, .2, .012, 32), mat(0x161616, { flatShading: false, roughness: .3 })));
    disc2.add(mesh(new T.CylinderGeometry(.07, .07, .014, 20), mat(0xd94a3a, { flatShading: false })));
    disc2.add(mesh(new T.BoxGeometry(.02, .016, .16), mat(0xf2c46d), 0, .002, .1));
    var arm = mesh(new T.BoxGeometry(.03, .03, .3), mat(0xc9c9c9, { metalness: .6 }), .18, .09, -.05); arm.rotation.y = .5; rec.add(arm);
    var noteTex = [spriteTex('♪', '#ffd98a'), spriteTex('♫', '#ffe9c2')], notes = [];
    for (i = 0; i < 6; i++) { var sp = new T.Sprite(new T.SpriteMaterial({ map: noteTex[i % 2], transparent: true, opacity: 0, depthWrite: false })); sp.scale.set(.32, .32, .32); sp.userData.ph = i / 6; w.add(sp); notes.push(sp); }
    var recWorld = new T.Vector3();
    var _u2 = add.update;
    add.update = function (t, dt) {
      _u2(t, dt);
      for (var j = 0; j < WN; j++) { var o2 = j * 6 + 1; wp[o2] -= dt * 2.2; wp[o2 + 3] -= dt * 2.2; if (wp[o2 + 3] < -.62) { wp[o2] += 1.24; wp[o2 + 3] += 1.24; } }
      wgeo.attributes.position.needsUpdate = true;
      disc2.rotation.y = -t * 3.5;
      rec.getWorldPosition(recWorld); w.worldToLocal(recWorld);
      notes.forEach(function (sp) { var u = (sp.userData.ph + t * .18) % 1; sp.position.set(recWorld.x + Math.sin(u * 9 + sp.userData.ph * 6) * .35, recWorld.y + .15 + u * 2.4, recWorld.z + Math.cos(u * 7) * .2); sp.material.opacity = Math.sin(u * Math.PI) * .95; });
    };
    } catch (err) { if (window.console) console.warn('Hiệu ứng phụ lỗi, bỏ qua:', err); }
    add.spots = [new T.Vector3(-1.4, 3.1, -3.2), new T.Vector3(3.2, 2.1, -2.6), new T.Vector3(-1.6, 1.3, .6)];
    add.bg = 0x2a1a0c; add.warm = true;
  };

  BUILD.k3 = function (w, add) {
    base(w, 5, 0xc44a7a, 0x3a1630);
    var heart = new T.Mesh(heartGeo(2.2, .45), new T.MeshStandardMaterial({ color: 0xff2d55, emissive: 0x8a0022, roughness: .3, metalness: .2 }));
    heart.position.set(0, 3, -.6); heart.castShadow = true; w.add(heart);
    var glow = new T.PointLight(0xff4f7a, 2, 9, 2); glow.position.set(0, 3, .4); w.add(glow);
    var orb = new T.Group(); orb.position.copy(heart.position); w.add(orb);
    for (var i = 0; i < 8; i++) { var h = new T.Mesh(heartGeo(.3, .2), mat([0xff6fa3, 0xffb3cc, 0xf2c46d][i % 3], { flatShading: false })); var a = i / 8 * Math.PI * 2; h.position.set(Math.cos(a) * 2.1, Math.sin(a * 2) * .3, Math.sin(a) * 2.1); orb.add(h); }
    // bàn tròn gia đình
    var table = new T.Group(); table.position.set(-2, 0, 1.5);
    table.add(mesh(new T.CylinderGeometry(.8, .8, .1, 32), mat(0x9b6a3c), 0, .75, 0));
    table.add(mesh(new T.CylinderGeometry(.08, .12, .75, 10), mat(0x6b3d1f), 0, .37, 0));
    table.add(mesh(new T.CylinderGeometry(.22, .18, .14, 16), mat(0xfaf6ec, { flatShading: false }), 0, .87, 0));
    [[0x2f6b9a, 1.1], [0xd94a6a, 1], [0xf5b642, .75], [0x5fd38d, .7]].forEach(function (p, k) { var a = k / 4 * Math.PI * 2 + .4; var f = person(p[0], p[1]); f.position.set(Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2); f.lookAt(table.position.x, 0, table.position.z); f.position.x += 0; table.add(f); f.rotation.y = -a - Math.PI / 2; });
    w.add(table);
    // bàn tay giúp đỡ
    var help = new T.Group(); help.position.set(2.3, 0, 1.2);
    var p1 = person(0x5cb3ff, 1), p2 = person(0xff6fa3, .85); p1.position.x = -.4; p2.position.x = .4; p1.rotation.y = 1.2; p2.rotation.y = -1.2; help.add(p1); help.add(p2);
    var box = mesh(new T.BoxGeometry(.4, .3, .3), mat(0xf2c46d), 0, .55, .05); help.add(box);
    box.add(mesh(new T.BoxGeometry(.42, .05, .32), mat(0xff2d55), 0, 0, 0)); box.add(mesh(new T.BoxGeometry(.06, .32, .32), mat(0xff2d55), 0, 0, 0));
    var small = new T.Mesh(heartGeo(.35, .15), mat(0xff2d55, { flatShading: false })); small.position.set(0, 1.4, 0); help.add(small);
    w.add(help);
    // cây & tim bay lên
    [[-3.6, -2], [3.5, -2.2], [-.5, 3.8], [3.8, 2.6]].forEach(function (p) { var t = tree(.8, 0x3cb565); t.position.set(p[0], .1, p[1]); w.add(t); });
    var rise = [];
    for (i = 0; i < 16; i++) { var r = new T.Mesh(heartGeo(.18, .1), new T.MeshStandardMaterial({ color: 0xff6fa3, emissive: 0x80203f, transparent: true, opacity: .9 })); r.position.set(rnd(-4, 4), rnd(0, 6), rnd(-4, 4)); r.userData.s = rnd(.25, .6); w.add(r); rise.push(r); }
    add.update = function (t, dt) {
      var b = 1 + Math.pow(Math.max(0, Math.sin(t * 2.6)), 8) * .14; heart.scale.set(b, b, b); heart.rotation.y = Math.sin(t * .5) * .35;
      glow.intensity = 1.6 + (b - 1) * 8; orb.rotation.y = t * .5;
      small.position.y = 1.4 + Math.sin(t * 2) * .12; small.rotation.y = t;
      rise.forEach(function (r) { r.position.y += dt * r.userData.s; r.rotation.y += dt; r.material.opacity = Math.max(0, 1 - r.position.y / 6); if (r.position.y > 6) r.position.y = 0; });
    };

    /* đom đóm – sóng nhịp tim – địa cầu nhỏ */
    try {
    var FN = 60, fp = new Float32Array(FN * 3), fs = [], fg = new T.BufferGeometry();
    for (i = 0; i < FN; i++) { var d = diskPoint(4.4); fs.push([d[0], rnd(.4, 4.5), d[1], rnd(0, 6)]); }
    fg.setAttribute('position', new T.BufferAttribute(fp, 3));
    var flies = new T.Points(fg, new T.PointsMaterial({ color: 0xffe08a, size: .12, transparent: true, opacity: .9, blending: T.AdditiveBlending, depthWrite: false, map: canvasTex(64, 64, function (x, W, H) { var gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.3, 'rgba(255,230,150,.8)'); gr.addColorStop(1, 'rgba(255,200,100,0)'); x.fillStyle = gr; x.fillRect(0, 0, W, H); }) }));
    w.add(flies);
    var waves = [];
    for (i = 0; i < 3; i++) { var wv = new T.Mesh(new T.TorusGeometry(1, .03, 6, 64), new T.MeshBasicMaterial({ color: 0xff8fb3, transparent: true, opacity: 0 })); wv.position.copy(heart.position); wv.userData.ph = i / 3; w.add(wv); waves.push(wv); }
    var mini = globe(.32); mini.position.set(-2, 1.25, 1.5); w.add(mini);
    var hold = new T.Mesh(new T.TorusGeometry(.42, .025, 6, 40), mat(0xf2c46d, { flatShading: false, metalness: .5 })); hold.rotation.x = Math.PI / 2; hold.position.set(-2, 1.0, 1.5); w.add(hold);
    var _u3 = add.update;
    add.update = function (t, dt) {
      _u3(t, dt);
      fs.forEach(function (f, j) { fp[j * 3] = f[0] + Math.sin(t * .6 + f[3]) * .4; fp[j * 3 + 1] = f[1] + Math.sin(t * .9 + f[3] * 2) * .3; fp[j * 3 + 2] = f[2] + Math.cos(t * .5 + f[3]) * .4; });
      fg.attributes.position.needsUpdate = true; flies.material.opacity = .6 + Math.sin(t * 3) * .3;
      waves.forEach(function (wv) { var u = (t * .38 + wv.userData.ph) % 1; var sc = 1.2 + u * 3.2; wv.scale.set(sc, sc, sc); wv.material.opacity = (1 - u) * .55; wv.rotation.y = heart.rotation.y; });
      mini.rotation.y = t * .8; mini.position.y = 1.25 + Math.sin(t * 1.5) * .06;
    };
    } catch (err) { if (window.console) console.warn('Hiệu ứng phụ lỗi, bỏ qua:', err); }
    add.spots = [new T.Vector3(0, 3.1, -.4), new T.Vector3(-2, 1.75, 1.5), new T.Vector3(2.3, 1.2, 1.2)];
    add.bg = 0x2a0f22;
  };

  BUILD.k4 = function (w, add) {
    base(w, 5, 0x22356b, 0x111a3e);
    var R = seedRand(41);
    function winTex(col) {
      return canvasTex(64, 128, function (x, W, H) {
        x.fillStyle = '#1b2a55'; x.fillRect(0, 0, W, H);
        for (var yy = 6; yy < H - 4; yy += 10) for (var xx = 5; xx < W - 4; xx += 11) { x.fillStyle = R() > .35 ? col : '#24346a'; x.fillRect(xx, yy, 6, 6); }
      });
    }
    var cols = ['#ffe28a', '#9fe0ff', '#b9ffcf', '#ffd0ef'];
    var towers = [];
    for (var i = 0; i < 14; i++) {
      var a = Math.PI * (1.05 + i / 14 * .95), r = 3.1 + R() * 1.2, h = 1.2 + R() * 3.2, wd = .5 + R() * .4;
      var tex = winTex(cols[i % 4]); tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(1, h / 1.6);
      var tw = mesh(new T.BoxGeometry(wd, h, wd), new T.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: .55, roughness: .5 }), Math.cos(a) * r, h / 2 + .1, Math.sin(a) * r);
      tw.rotation.y = -a; w.add(tw); towers.push(tw);
      if (R() > .5) w.add(mesh(new T.ConeGeometry(.08, .5, 6), mat(0xdfe8ff), tw.position.x, h + .35, tw.position.z));
    }
    var turbs = [];
    [[3.5, -.2, 1.1], [3.9, 1.5, .9], [-3.8, .8, 1]].forEach(function (p) { var tb = turbine(p[2]); tb.position.set(p[0], .1, p[1]); tb.rotation.y = Math.atan2(-p[0], 4 - p[1]) * .4; w.add(tb); turbs.push(tb); });
    // địa cầu trung tâm
    var ped = mesh(new T.CylinderGeometry(.9, 1.1, .5, 40), mat(0xc9d3f0, { metalness: .5, roughness: .3, flatShading: false }), 0, .35, .6); w.add(ped);
    var ring = new T.Mesh(new T.TorusGeometry(1, .04, 8, 80), new T.MeshBasicMaterial({ color: 0x5cb3ff })); ring.rotation.x = Math.PI / 2; ring.position.set(0, .62, .6); w.add(ring);
    var gl = globe(1); gl.position.set(0, 2, .6); w.add(gl);
    var orbit = new T.Group(); orbit.position.copy(gl.position); orbit.rotation.x = .4; w.add(orbit);
    var sat = mesh(new T.BoxGeometry(.16, .16, .16), mat(0xf2c46d, { metalness: .6 }), 1.6, 0, 0); orbit.add(sat);
    var panel = mesh(new T.BoxGeometry(.5, .02, .14), mat(0x3f7bd8), 1.6, 0, 0); orbit.add(panel);
    var trail = new T.Mesh(new T.TorusGeometry(1.6, .008, 4, 120), new T.MeshBasicMaterial({ color: 0x9fd4ff, transparent: true, opacity: .45 })); trail.rotation.x = Math.PI / 2; orbit.add(trail);
    [[-1.8, 2.6], [1.6, 3], [-3, 2.8], [2.6, 3.4]].forEach(function (p) { var t = tree(.6, 0x3cb565); t.position.set(p[0], .1, p[1]); w.add(t); });
    var light = new T.PointLight(0x5cb3ff, 1.5, 8, 2); light.position.set(0, 2, 2.4); w.add(light);
    add.update = function (t) {
      turbs.forEach(function (tb, k) { tb.userData.rotor.rotation.z = t * (1.6 + k * .3); });
      gl.rotation.y = t * .35; orbit.rotation.y = t * .6; ring.material.color.setHSL(.58, .9, .55 + Math.sin(t * 3) * .1);
    };

    /* tên lửa – xe bay – sao băng */
    try {
    var padP = new T.Vector3(-2.7, .1, 1.9);
    w.add(mesh(new T.CylinderGeometry(.45, .55, .12, 24), mat(0x8090b8, { metalness: .4 }), padP.x, .16, padP.z));
    var rocket = new T.Group(); w.add(rocket);
    rocket.add(mesh(new T.CylinderGeometry(.13, .15, .8, 16), mat(0xf4f6ff, { flatShading: false }), 0, .4, 0));
    rocket.add(mesh(new T.ConeGeometry(.13, .3, 16), mat(0xff4d5e, { flatShading: false }), 0, .95, 0));
    var win = mesh(new T.CylinderGeometry(.05, .05, .02, 16), mat(0x5cb3ff, { emissive: 0x5cb3ff, emissiveIntensity: .8 }), 0, .55, .14); win.rotation.x = Math.PI / 2; rocket.add(win);
    for (i = 0; i < 3; i++) { var fin = mesh(new T.BoxGeometry(.02, .22, .16), mat(0xff4d5e), 0, .1, 0); fin.position.set(Math.sin(i * 2.09) * .15, .1, Math.cos(i * 2.09) * .15); fin.rotation.y = i * 2.09; rocket.add(fin); }
    var flame = new T.Mesh(new T.ConeGeometry(.11, .45, 12), new T.MeshBasicMaterial({ color: 0xffa23a, transparent: true, opacity: .9 })); flame.rotation.x = Math.PI; flame.position.y = -.22; rocket.add(flame);
    var core = new T.Mesh(new T.ConeGeometry(.06, .3, 10), new T.MeshBasicMaterial({ color: 0xfff2b0 })); core.rotation.x = Math.PI; core.position.y = -.15; rocket.add(core);
    var smoke = [];
    for (i = 0; i < 18; i++) { var sm = new T.Mesh(new T.SphereGeometry(.12, 8, 6), new T.MeshStandardMaterial({ color: 0xdfe4f2, transparent: true, opacity: 0, roughness: 1 })); sm.userData.ph = i / 18; w.add(sm); smoke.push(sm); }
    var cars = [];
    for (i = 0; i < 4; i++) {
      var car = new T.Group(); car.add(mesh(new T.BoxGeometry(.3, .1, .16), mat([0xff6fa3, 0x5fd38d, 0xf5b642, 0xffffff][i], { flatShading: false })));
      car.add(mesh(new T.SphereGeometry(.07, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x9fe0ff, { emissive: 0x2a6fd0 }), 0, .05, 0));
      var trailM = new T.Mesh(new T.BoxGeometry(.5, .02, .02), new T.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: .5 })); trailM.position.x = -.4; car.add(trailM);
      car.userData = { ph: i * 1.57, r: 4.4 + (i % 2) * .3, y: 2 + (i % 3) * .5, sp: .35 + (i % 2) * .12 }; w.add(car); cars.push(car);
    }
    var shoot4 = shooting(w, 3);
    var _u4 = add.update;
    add.update = function (t, dt) {
      _u4(t, dt);
      var c = t % 16, lift = (c < 4 || c > 15) ? 0 : Math.pow(c - 4, 2) * .55;
      rocket.position.set(padP.x, .22 + lift, padP.z); rocket.visible = c < 9.5 || c > 15;
      var fire = c > 3 && c < 9.5; flame.visible = core.visible = fire; var fl = 1 + Math.sin(t * 40) * .15; flame.scale.set(fl, fl * (c < 4 ? .5 : 1.4), fl);
      rocket.rotation.y = c > 4 ? (c - 4) * .4 : 0;
      smoke.forEach(function (sm) { var u = (sm.userData.ph + t * .7) % 1; var on = fire; sm.visible = on; if (!on) return; sm.position.set(padP.x + Math.sin(sm.userData.ph * 20) * u * .9, .2 + Math.max(0, lift * (1 - u) - .2), padP.z + Math.cos(sm.userData.ph * 20) * u * .9); var sc = .5 + u * 1.6; sm.scale.set(sc, sc, sc); sm.material.opacity = (1 - u) * .55; });
      cars.forEach(function (car) { var th = car.userData.ph + t * car.userData.sp; car.position.set(Math.cos(th) * car.userData.r, car.userData.y + Math.sin(t * 2 + car.userData.ph) * .08, Math.sin(th) * car.userData.r); car.rotation.y = -th - Math.PI / 2; });
      shoot4(t);
    };
    } catch (err) { if (window.console) console.warn('Hiệu ứng phụ lỗi, bỏ qua:', err); }
    add.spots = [new T.Vector3(-1.6, 2.6, -3.2), new T.Vector3(3.5, 2.4, -.2), new T.Vector3(0, 2.2, .6)];
    add.bg = 0x0a1438; add.stars = true;
  };

  BUILD.lobby = function (w, add) {
    base(w, 5.2, 0x1f2b5e, 0x0e1638);
    var ped = mesh(new T.CylinderGeometry(1, 1.25, .6, 48), mat(0xd7ddf2, { metalness: .5, roughness: .3, flatShading: false }), 0, .4, 0); w.add(ped);
    var ring = new T.Mesh(new T.TorusGeometry(1.15, .05, 8, 80), new T.MeshBasicMaterial({ color: 0x5cb3ff })); ring.rotation.x = Math.PI / 2; ring.position.y = .72; w.add(ring);
    var gl = globe(1.05); gl.position.y = 2.1; w.add(gl);
    var beam = new T.Mesh(new T.CylinderGeometry(1.1, 1.1, 2.8, 40, 1, true), new T.MeshBasicMaterial({ color: 0x5cb3ff, transparent: true, opacity: .07, side: T.DoubleSide })); beam.position.y = 2.1; w.add(beam);
    var Z = [[0x5fd38d, 'tree'], [0xf5b642, 'clock'], [0xff6fa3, 'heart'], [0x5cb3ff, 'turbine']];
    var props = [];
    Z.forEach(function (z, k) {
      var a = Math.PI * (-.75 + k * .5);
      var pv = new T.Group(); pv.position.set(Math.sin(a) * 3.6, 0, Math.cos(a) * 3.6); pv.rotation.y = a + Math.PI; w.add(pv);
      var panel = mesh(new T.CylinderGeometry(2, 2, 1.3, 32, 1, true, -.55, 1.1), mat(z[0], { side: T.DoubleSide, emissive: z[0], emissiveIntensity: .3, flatShading: false }), 0, .75, -.5); pv.add(panel);
      var trim = new T.Mesh(new T.TorusGeometry(2, .03, 6, 40, 1.1), new T.MeshBasicMaterial({ color: 0xf2c46d })); trim.rotation.set(Math.PI / 2, 0, Math.PI / 2 - .55); trim.position.set(0, 1.4, -.5); pv.add(trim);
      var floor = mesh(new T.CylinderGeometry(2, 2, .08, 32, 1, false, -.55, 1.1), mat(z[0], { emissive: z[0], emissiveIntensity: .35 }), 0, .14, -.5); pv.add(floor);
      var o;
      if (z[1] === 'tree') { o = new T.Group(); [[-.4, 0, .6], [.3, .2, .8], [0, -.3, 1]].forEach(function (p) { var t = tree(p[2], 0x3cb565); t.position.set(p[0], .18, p[1]); o.add(t); }); }
      else if (z[1] === 'clock') { o = clock(.65); o.position.y = .18; }
      else if (z[1] === 'heart') { o = new T.Mesh(heartGeo(1, .3), new T.MeshStandardMaterial({ color: 0xff2d55, emissive: 0x8a0022 })); o.position.y = 1.3; }
      else { o = turbine(.8); o.position.y = .18; }
      o.position.z = -.1; pv.add(o); props.push(o);
      var pl = new T.PointLight(z[0], .9, 4, 2); pl.position.set(0, 1.8, .4); pv.add(pl);
    });
    add.update = function (t) {
      gl.rotation.y = t * .3; beam.material.opacity = .06 + Math.sin(t * 2) * .02;
      props[1].userData.pend.rotation.z = Math.sin(t * 2.2) * .28;
      var b = 1 + Math.pow(Math.max(0, Math.sin(t * 2.6)), 8) * .15; props[2].scale.set(b, b, b); props[2].rotation.y = Math.sin(t) * .4;
      props[3].userData.rotor.rotation.z = t * 1.8;
      props[0].rotation.y = Math.sin(t * .8) * .1;
    };

    /* mặt trăng – hạt sáng – sao băng */
    try {
    var moonOrb = new T.Group(); moonOrb.position.y = 2.1; moonOrb.rotation.z = .35; w.add(moonOrb);
    var moon = mesh(new T.SphereGeometry(.22, 24, 16), mat(0xe6e8f0, { flatShading: false, roughness: 1 }), 1.75, 0, 0); moonOrb.add(moon);
    var path = new T.Mesh(new T.TorusGeometry(1.75, .006, 4, 120), new T.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: .35 })); path.rotation.x = Math.PI / 2; moonOrb.add(path);
    var PN = 90, pp = new Float32Array(PN * 3), ps = [], pg2 = new T.BufferGeometry();
    for (var i2 = 0; i2 < PN; i2++) ps.push([Math.random() * Math.PI * 2, .4 + Math.random() * .7, Math.random()]);
    pg2.setAttribute('position', new T.BufferAttribute(pp, 3));
    var motes = new T.Points(pg2, new T.PointsMaterial({ color: 0x9fd4ff, size: .07, transparent: true, opacity: .85, blending: T.AdditiveBlending, depthWrite: false })); w.add(motes);
    var shootL = shooting(w, 3);
    var _uL = add.update;
    add.update = function (t, dt) {
      _uL(t, dt);
      moonOrb.rotation.y = t * .45; moon.rotation.y = t * .2;
      ps.forEach(function (q, j) { var u = (q[2] + t * .12) % 1; pp[j * 3] = Math.cos(q[0] + t * .3) * q[1]; pp[j * 3 + 1] = .7 + u * 3; pp[j * 3 + 2] = Math.sin(q[0] + t * .3) * q[1]; });
      pg2.attributes.position.needsUpdate = true;
      shootL(t);
    };
    } catch (err) { if (window.console) console.warn('Hiệu ứng phụ lỗi, bỏ qua:', err); }
    add.spots = [0, 1, 2, 3].map(function (k) { var a = Math.PI * (-.75 + k * .5); return new T.Vector3(Math.sin(a) * 3.3, 1.9, Math.cos(a) * 3.3); });
    add.spots.push(new T.Vector3(0, 2.1, 0));
    add.bg = 0x0c1430; add.stars = true;
  };

  /* ---------- engine ---------- */
  M.init = function (o) {
    var stage = o.stage, canvas = stage.querySelector('canvas');
    if (!T) { stage.classList.add('no3d'); return null; }
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { stage.classList.add('no3d'); return null; }
    if (!renderer.getContext()) { stage.classList.add('no3d'); return null; }
    var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2));
    renderer.outputEncoding = T.sRGBEncoding; renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
    var scene = new T.Scene(), cam = new T.PerspectiveCamera(42, 1, .1, 200);
    var world = new T.Group(); scene.add(world);
    var cfg = {};
    try { BUILD[o.scene](world, cfg); } catch (err) { if (window.console) console.error('Không dựng được cảnh 3D:', err); renderer.dispose(); stage.classList.add('no3d'); return null; }
    var done = new Set();
    world.traverse(function (ob) {
      var ms = ob.material ? (Array.isArray(ob.material) ? ob.material : [ob.material]) : [];
      ms.forEach(function (m) { if (done.has(m)) return; done.add(m); if (m.color) m.color.convertSRGBToLinear(); if (m.emissive) m.emissive.convertSRGBToLinear(); });
    });
    scene.fog = new T.Fog(new T.Color(cfg.bg).convertSRGBToLinear(), 16, 34);
    scene.add(new T.HemisphereLight(cfg.warm ? 0xffe2b0 : 0xcfe0ff, cfg.bg, cfg.warm ? 1.0 : 1.1));
    var sun = new T.DirectionalLight(cfg.warm ? 0xffd39a : 0xffffff, cfg.warm ? 1.1 : 1.25); sun.position.set(5, 9, 6); sun.castShadow = true;
    sun.shadow.mapSize.set(coarse ? 512 : 1024, coarse ? 512 : 1024); var sc = sun.shadow.camera; sc.left = sc.bottom = -7; sc.right = sc.top = 7; sun.shadow.bias = -.0008; scene.add(sun);
    if (cfg.stars || true) {
      var sg = new T.BufferGeometry(), sa = [];
      for (var i = 0; i < 600; i++) { var v = new T.Vector3(rnd(-1, 1), rnd(-.2, 1), rnd(-1, 1)).normalize().multiplyScalar(rnd(30, 60)); sa.push(v.x, v.y, v.z); }
      sg.setAttribute('position', new T.Float32BufferAttribute(sa, 3));
      var stars = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: .25, transparent: true, opacity: cfg.warm ? .25 : .8, fog: false })); scene.add(stars);
    }
    // camera state
    var HOME = { tx: 0, ty: 1.5, tz: 0, dist: o.dist || 13, h: o.height || 5.2 };
    var cur = { rot: o.startRot || .5, tx: 0, ty: 1.5, tz: 0, dist: HOME.dist + 6, h: HOME.h + 3, off: 0 };
    var goal = { rot: o.startRot || .3, tx: HOME.tx, ty: HOME.ty, tz: HOME.tz, dist: HOME.dist, h: HOME.h, off: 0 };
    var focus = -1, dragging = false, hovering = false, touched = false, moved = 0, lastX = 0, lastInteract = 0;
    // pins
    var pinsWrap = stage.querySelector('.pins'), pins = [];
    cfg.spots.forEach(function (p, k) {
      var b = pinsWrap.children[k]; if (!b) return;
      b.addEventListener('click', function (ev) { ev.stopPropagation(); if (focus === k && o.onActiveClick) { o.onActiveClick(k); return; } go(k); });
      pins.push({ el: b, p: p });
    });
    function wrapNear(target, curv) { var d = target - curv; d = ((d + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return curv + d; }
    function go(k) {
      focus = k; touched = true; lastInteract = performance.now();
      var p = cfg.spots[k];
      var phi = Math.atan2(p.x, p.z), rot = -phi;
      if (Math.hypot(p.x, p.z) < .8) rot = goal.rot; // điểm ở giữa: giữ góc
      if (cfg.limit) rot = Math.max(-cfg.limit, Math.min(cfg.limit, -p.x * .1));
      goal.rot = cfg.limit ? rot : wrapNear(rot, cur.rot);
      var c = Math.cos(goal.rot), s = Math.sin(goal.rot);
      goal.tx = p.x * c + p.z * s; goal.tz = -p.x * s + p.z * c; goal.ty = p.y;
      goal.dist = o.focusDist || 5.2; goal.h = 1.4; goal.off = (o.focusDist || 5.2) * .1;
      stage.classList.add('focused');
      pins.forEach(function (q, j) { q.el.classList.toggle('active', j === k); q.el.setAttribute('aria-pressed', j === k ? 'true' : 'false'); });
      if (o.onFocus) o.onFocus(k);
    }
    function home() {
      focus = -1; goal.tx = HOME.tx; goal.ty = HOME.ty; goal.tz = HOME.tz; goal.dist = HOME.dist; goal.h = HOME.h; goal.off = 0;
      stage.classList.remove('focused');
      pins.forEach(function (q) { q.el.classList.remove('active'); q.el.setAttribute('aria-pressed', 'false'); });
      if (o.onFocus) o.onFocus(-1);
    }
    // drag
    stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovering = true; });
    stage.addEventListener('pointerleave', function () { hovering = false; });
    stage.addEventListener('keydown', function (e) { if (e.key === 'Escape' && focus >= 0) home(); });
    canvas.addEventListener('pointerdown', function (e) { dragging = true; touched = true; moved = 0; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); stage.classList.add('dragging'); lastInteract = performance.now(); });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return; var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); goal.rot += dx * .008;
      if (cfg.limit) goal.rot = Math.max(-cfg.limit, Math.min(cfg.limit, goal.rot));
      if (focus >= 0 && moved > 12) home();
      lastInteract = performance.now(); stage.classList.add('used');
    });
    function up() { dragging = false; stage.classList.remove('dragging'); }
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    // resize
    function size() {
      var w = stage.clientWidth, h = stage.clientHeight, a = w / Math.max(h, 1);
      renderer.setSize(w, h, false);
      cam.fov = a < 1 ? 50 : 42; cam.aspect = a; cam.updateProjectionMatrix();
      /* màn hình dọc (điện thoại): lùi camera vừa đủ để thấy trọn mô hình */
      var half = Math.tan(cam.fov * Math.PI / 360) * Math.min(a, 1);
      HOME.dist = a < 1.2 ? Math.max(o.dist || 13, (o.radius || 5.6) / half) : (o.dist || 13);
      if (focus < 0) goal.dist = HOME.dist;
    }
    size(); if (window.ResizeObserver) new ResizeObserver(size).observe(stage); else addEventListener('resize', size);
    // loop
    var updErr = false, visible = true, clock0 = performance.now(), last = clock0, tmp = new T.Vector3();
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(stage);
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      var dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now; var t = Math.max(0, (now - clock0) / 1000);
      var still = calm();
      if (!still && !touched && focus < 0 && !dragging && !hovering) {
        if (cfg.limit) goal.rot = Math.sin(t * .15) * cfg.limit * .7; else goal.rot += dt * .12;
      }
      var k = 1 - Math.pow(.0025, dt);
      for (var key in goal) cur[key] += (goal[key] - cur[key]) * k;
      world.rotation.y = cur.rot;
      cam.position.set(cur.tx, cur.ty + cur.h - cur.off, cur.tz + cur.dist);
      cam.lookAt(cur.tx, cur.ty - cur.off, cur.tz);
      if (!updErr && (!still || t < .2)) { try { cfg.update(t, dt); } catch (err) { updErr = true; if (window.console) console.warn('Lỗi chuyển động, dừng hiệu ứng:', err); } }
      try { renderer.render(scene, cam); } catch (err) { if (!updErr && window.console) console.warn('Lỗi vẽ 3D:', err); updErr = true; }
      var W = stage.clientWidth, H = stage.clientHeight;
      pins.forEach(function (q) {
        tmp.copy(q.p); world.localToWorld(tmp); var depth = tmp.z;
        tmp.project(cam);
        var x = (tmp.x * .5 + .5) * W, y = (-tmp.y * .5 + .5) * H;
        q.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        q.el.classList.toggle('back', depth < -1.2 && focus < 0);
        q.el.style.zIndex = String(Math.round(100 + depth * 10));
        q.el.style.visibility = tmp.z > 1 ? 'hidden' : 'visible';
      });
    }
    requestAnimationFrame(frame);
    stage.classList.add('ready');
    if (o.onReady) o.onReady();
    return { go: go, home: home, get focus() { return focus; }, count: cfg.spots.length };
  };
  window.Museum3D = M;
})();
