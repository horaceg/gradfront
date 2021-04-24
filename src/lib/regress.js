import * as tf from '@tensorflow/tfjs';
tf.setBackend("cpu")
console.log(tf.getBackend())


function applyLinear(params, xt) {
    let [w, b] = params;
    return xt.dot(w).add(b)
}

function applyWave(params, xt) {
    return applyLinear(params, xt).cos()
}

function makeRegression(apply, n, p) {
    Math.seedrandom(8)
    let xt = tf.randomUniform([n, p], -3, 3.)
    let w = tf.randomNormal([p]).mul(2.)
    let b = tf.randomNormal([1]).squeeze()
    let noise = tf.randomNormal([n]).mul(0.2)
    let yt = apply([w, b], xt).add(noise)
    let reg = { xt: xt, yt: yt, w: w, b: b }
    return reg
}

function make_mse(apply, xt, yt) {
    return (...params) => {
        let pred = apply(params, xt)
        return pred.sub(yt).square().mean([0])
    }
}

function optimize(gradLoss, epochs, lr, momentum, init_params) {
    let params = init_params;
    let z = params.map(_ => 0);
    let memo = { loss: [], params: [] };
    for (let i = 0; i < epochs; i++) {
        let { value, grads } = gradLoss(params);
        memo["loss"].push(value);
        memo["params"].push(params);
        z = grads.map((g, i) => tf.add(g, tf.mul(momentum, z[i])))
        params = params.map((w, i) => tf.sub(w, z[i].mul(lr)));
    }
    let { value, _ } = gradLoss(params);
    memo["loss"].push(value);
    memo["params"].push(params);
    return memo
}


function setup(apply, n) {
    let reg = makeRegression(apply, n, 1)
    let yt = reg["yt"]
    let xt = reg["xt"]
    let loss = make_mse(apply, xt, yt)

    let gradLoss = tf.valueAndGrads(loss)
    return { xt: xt, yt: yt, gradLoss: gradLoss }

}

function regress(problem, init_key, lr, momentum) {
    let apply = problem === "wave" ? applyWave : applyLinear
    let { xt, yt, gradLoss } = setup(apply, 100)
    let n_train = 30
    Math.seedrandom(init_key)
    let init_params = [
        tf.randomNormal([1]),
        tf.randomNormal([1]).squeeze(),
    ]

    let res = optimize(gradLoss, n_train, lr, momentum, init_params)

    res = {
        loss: res.loss.map(l => l.arraySync()),
        params: res.params.map(p => p.map(el => el.arraySync())),
        x: xt.arraySync(),
        y: yt.arraySync(),
        predictions: res.params.map(p => apply(p, xt).arraySync())
    }
    return res
}
export { regress };
