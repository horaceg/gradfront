import * as tf from "@tensorflow/tfjs";

function applyLinear(params, xt) {
  let [w, b] = params;
  return xt.dot(w).add(b);
}

function applyWave(params, xt) {
  return applyLinear(params, xt).cos();
}

function applyNN(params, xt) {
  let running = xt;
  for (let i = 0; i < params.length / 2 - 1; i++) {
    running = running
      .dot(params[2 * i])
      .add(params[2 * i + 1])
      .tanh();
  }
  let final = applyLinear([params[params.length - 2], params[params.length - 1]], running).squeeze();
//   console.log(final.arraySync())
  return final
}

function makeRegression(apply, n, p) {
  Math.seedrandom(8);
  let xt = tf.randomUniform([n, p], -3, 3);
  let w = tf.randomNormal([p]);
  let b = tf.randomNormal([1]).squeeze();
  let noise = tf.randomNormal([n]).mul(0.2);
  let yt = apply([w, b], xt).add(noise);
  let reg = { xt: xt, yt: yt, w: w, b: b };
  return reg;
}

function make_mse(apply, xt, yt) {
  return (...params) => {
    let pred = apply(params, xt);
    return pred.sub(yt).square().mean([0]);
  };
}

function optimize(gradLoss, epochs, lr, momentum, init_params) {
  let params = init_params;
  let z = params.map((_) => 0);
  let memo = { loss: [], params: [] };
  for (let i = 0; i < epochs; i++) {
    let { value, grads } = gradLoss(params);
    memo["loss"].push(value);
    memo["params"].push(params);
    z = grads.map((g, i) => tf.add(g, tf.mul(momentum, z[i])));
    params = params.map((w, i) => tf.sub(w, z[i].mul(lr)));
  }
  let { value, _ } = gradLoss(params);
  memo["loss"].push(value);
  memo["params"].push(params);
  return memo;
}

function setup(applyMake, applyTrain, n) {
  let reg = makeRegression(applyMake, n, 1);
  let yt = reg["yt"];
  let xt = reg["xt"];
  let loss = make_mse(applyTrain, xt, yt);
  let gradLoss = tf.valueAndGrads(loss);
  return { xt: xt, yt: yt, gradLoss: gradLoss };
}

function initialize(init_key) {
  Math.seedrandom(init_key);
  let init_params = [tf.randomUniform([1], -4, 4), tf.randomUniform([1], -4, 4).squeeze()];
  return init_params;
}

function initNN(init_key, n_features, shapes) {
  Math.seedrandom(init_key);
  let a = [n_features, ...shapes];
//   console.log(a);
  let middle = a
    .map((shp, i) =>
      i < shapes.length ? [tf.randomNormal([shp, shapes[i]]), tf.randomNormal([shapes[i]])] : []
    )
    .flat();

//   console.log(middle.map((t) => t.arraySync()));

  let init_params = [
    ...middle,
    tf.randomNormal([shapes[shapes.length - 1], 1]),
    tf.randomNormal([1])
  ];

//   console.log(init_params.map((t) => t.arraySync()));
  return init_params;
}

function regress(apply, gradLoss, xt, init_params, lr, momentum, n_train, n) {
  let res = optimize(gradLoss, n_train, lr, momentum, init_params);

  res = {
    loss: res.loss.map((l) => l.arraySync()),
    params: res.params.map((p) => p.map((el) => el.arraySync())),
    predictions: res.params.map((p) => apply(p, xt).arraySync())
  };
  return res;
}
export { regress, make_mse, setup, applyWave, applyLinear, initialize, initNN, applyNN };
