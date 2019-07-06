import * as  express from 'express';
import * as  bodyParser from 'body-parser';
import * as  cookieParser from 'cookie-parser';
import * as  appconfig from "../../../appconfig";

export class ExpressServer {

  private _server: any;
  private app: any;
  private tasks: any;

  get server() {
    return this._server;
  }

  constructor() {
    this._server = null;
    this.app = null;
    this.tasks = [];
  }

  private initRouts() {
    this.app = express();
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-user-key, Content-Type, Accept");
      res.header("Access-Control-Expose-Headers", "x-session-id");
      next();
    });
    this.app.use(bodyParser.json({ limit: '50mb', extended: true }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    this.app.use(cookieParser());

    this.tasks.forEach((task) => {
      let handler = null;
      if (Array.isArray(task.handler)) {
        handler = task.handler.map((th, index) => this.initHandler(task, th, index));
      } else {
        handler = this.initHandler(task, task.handler)
      }

      const verify = async (req, res, next) => {
        // const sessionId = req.headers["x-user-key"];
        // console.log(`Request to ${task.event} : [${JSON.stringify({
        //   headers: {...req.headers},
        //   body: {...req.body}
        // })}]`);
        //
        // try {
        //   await this.checkPermission(sessionId, task.permissions, req);
        //   next();
        // } catch (err) {
        //   res.status(400);
        //   res.json({error: err.message});
        // }
        next();
      };

      this.app[task.type](task.event, verify, handler);
    });

    return this.app;
  }

  private initHandler(task, handler, index = null) {
    console.log(`Registered handler : [${task.event}]`);
    return async (req, res, next) => {
      try {
        const data = await handler(req, res, next);
        req.prevResult = data;

        if (index !== null && index !== task.handler.length - 1) {
          next();
        } else {
          res.status(200);
          res.json({ data });
        }
      } catch (err) {
        res.status(400);
        res.json({ error: err.message });
      }
    };
  }

  private async checkPermission(sessionId, permissions, req) {
    const user = await sessionHelper.getSessionUser(sessionId);

    if (!permissions.isLogin) {
      if (user && req) {
        req.user = user;
      }
      return;
    } else {
      const user = await sessionHelper.getSessionUser(sessionId);

      if (user.permissions.isAdmin) {
        req.user = user;
      } else {
        if (permissions.isAdmin) {
          throw new Error("You don't have permissions.");
        } else {
          req.user = user;
        }
      }
    }
  }

  public createAdditionalHandlers(type, route, handler) {
    this.app[type](route, handler);
  }

  public start() {
    this._server = this.initRouts().listen(appconfig.server.port, () => {
      console.log(`ExpressServer listening on ${appconfig.server.port}`);
    });
  }
};
