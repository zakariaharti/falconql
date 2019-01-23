// RUNNER script
// ------------------------------------------------------

// IMPORTS

/** NPM */
import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import * as koa from 'koa';
import * as koaSend from 'koa-send';
import * as koaCors from '@koa/cors';
import * as koaRouter from 'koa-router';
import ora from 'ora';

/** LOCAL */
import clientConfig from "../webpack/client";
import serverConfig from "../webpack/server";
import staticConfig from "../webpack/static";

// -----------------------------------------------------

/**
 * static middleware for serving static files
 */
const staticMiddleware = (root: string, immutable = true): koa.Middleware => {
  return async (ctx, next) => {
    try {
      if(ctx.path !== '/'){
        koaSend(ctx, ctx.path, {
          immutable,
          root
        });
      }
    } catch (e) {

    }

    return next();
  }
}

/**
 * types interface of runner
 */
interface IBuildInfo {
  stats: {
    clientStats?: string;
    server?: string;
    serverStats?: string;
  };
  dist: string;
  spinner: ora.Ora;
  isProdMode: boolean;
  port: string | number;
}

/**
 * types interface of runner
 */
interface IRunner {
  build: (buildStatic: boolean) => Promise<any>;
  compiler: webpack.MultiCompiler;
  staticCompiler: webpack.MultiCompiler;
}

// dist folder
const dist = path.resolve(__dirname, "..", "..", "dist");

/**
 * buuld info
 */
export const buildInfo: IBuildInfo = {
  stats: {
    clientStats: path.resolve(dist, "client.stats.json"),
    server: path.resolve(dist, "server.js"),
    serverStats: path.resolve(dist, "server.stats.json")
  },
  dist,
  isProdMode: process.env.NODE_ENV == 'production',
  port: process.env.PORT || 3000,
  spinner: ora()
}

/**
 * runner function
 */
export const runner = (): IRunner => {
  const compiler = webpack([serverConfig, clientConfig]);
  const staticCompiler = webpack([staticConfig]);

  const build = (buildStatic = false) => {
    const buildCompiler = buildStatic ? staticCompiler : compiler;

    return new Promise(resolve => {
      buildCompiler.run((e, fullStats) => {
        if (e) {
          buildInfo.spinner.fail(e.message);
          process.exit(1);
        }

        const stats = fullStats.toJson();

        if (stats.errors.length) {
          buildInfo.spinner.fail(stats.errors.join("\n"));
          process.exit(1);
        }

       if (!buildStatic) {
         [buildInfo.stats.serverStats, buildInfo.stats.clientStats].forEach(
           (file, i) => {
             fs.writeFileSync(file, JSON.stringify(stats.children[i]), {
               encoding: "utf8"
             });
           }
         );
       }

      resolve();
     });
    });
  };

  return {
    compiler,
    staticCompiler,
    build
  };
};

/** koa router */
const router = new koaRouter()
  .get('/hello', async ctx => {
    ctx.body = 'hello world';
  })
  .get("/favicon.ico", async ctx => {
    ctx.status = 204;
  });

/** koa instance */
export const app = new koa();

app.use(koaCors());
app.use(async (ctx, next) => {
  try{
    await next();
  } catch(e){
    console.log("Error:", e.message);
    ctx.status = 500;
    ctx.body = "There was an error. Please try again later.";
  };
});

if (buildInfo.isProdMode) {
  app.use(staticMiddleware(path.resolve(buildInfo.dist, "public")));
}

app.use(staticMiddleware(path.resolve(buildInfo.dist, "..", "public"), false));
