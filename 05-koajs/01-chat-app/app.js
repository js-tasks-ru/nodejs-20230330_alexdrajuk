const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscriptions = [];

router.get('/subscribe', async (ctx, next) => {
  const response = await new Promise((resolve) => subscriptions.push(resolve));
  ctx.body = response;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    return;
  }

  subscriptions.forEach((subscription) => subscription(message));
  subscriptions = [];

  ctx.res.statusCode = 201;
});

app.use(router.routes());

module.exports = app;
