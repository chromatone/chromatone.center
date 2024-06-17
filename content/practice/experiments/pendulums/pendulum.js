import { lusolve, add } from 'mathjs'

export class Pendulum {
  constructor(
    n = 5,
    thetas = Array(n).fill(0.5 * Math.PI),
    thetaDots = Array(n).fill(0),
    g = -9.8
  ) {
    this.n = n;
    this.thetas = thetas;
    this.thetaDots = thetaDots;
    this.g = g;
  }

  A(thetas) {
    let M = [];
    for (let i = 0; i < this.n; i++) {
      let row = [];
      for (let j = 0; j < this.n; j++) {
        row.push((this.n - Math.max(i, j)) * Math.cos(thetas[i] - thetas[j]));
      }
      M.push(row)
    }
    return M;
  }

  b(thetas, thetaDots) {
    let v = [];
    for (let i = 0; i < this.n; i++) {
      let b_i = 0;
      for (let j = 0; j < this.n; j++) {
        b_i -= (this.n - Math.max(i, j)) * Math.sin(thetas[i] - thetas[j]) * thetaDots[j] ** 2;
      }
      b_i -= this.g * (this.n - i) * Math.sin(thetas[i]);
      v.push(b_i);
    }
    return v;
  }

  f(thetas, thetaDots) {
    let A = this.A(thetas);
    let b = this.b(thetas, thetaDots);
    return [thetaDots, lusolve(A, b).map(x => x[0])];
  }

  RK4(dt, thetas, thetaDots) {
    let k1 = this.f(thetas, thetaDots);
    let k2 = this.f(add(thetas, k1[0].map(x => 0.5 * dt * x)), add(thetaDots, k1[1].map(x => 0.5 * dt * x)));
    let k3 = this.f(add(thetas, k2[0].map(x => 0.5 * dt * x)), add(thetaDots, k2[1].map(x => 0.5 * dt * x)));
    let k4 = this.f(add(thetas, k3[0].map(x => 1.0 * dt * x)), add(thetaDots, k3[1].map(x => 1.0 * dt * x)));

    let thetaDeltas = add(k1[0], k2[0].map(x => 2 * x), k3[0].map(x => 2 * x), k4[0]).map(x => x * dt / 6);
    let thetaDotDeltas = add(k1[1], k2[1].map(x => 2 * x), k3[1].map(x => 2 * x), k4[1]).map(x => x * dt / 6);

    return [add(thetas, thetaDeltas), thetaDots = add(thetaDots, thetaDotDeltas)]
  }

  tick(dt) {
    let newState = this.RK4(dt, this.thetas, this.thetaDots);
    this.thetas = newState[0];
    this.thetaDots = newState[1];
  }

  get coordinates() {
    let x = 0;
    let y = 0;
    let coords = [];
    for (let i = 0; i < this.thetas.length; i++) {
      let theta = this.thetas[i]
      x += Math.sin(theta);
      y += Math.cos(theta);
      coords.push({ x: x, y: y })
    }
    return coords;
  }
}