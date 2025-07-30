import express, { Router, Request, Response } from 'express';
import { auth } from '../lib/auth';
import { ControllerFunction, AuthenticatedRequest } from '../types/controllers/base.types';
import { protect } from '../middleware/authMiddleware';

class ApiRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  private authMiddleware(auth: 'secure' | 'public') {
    return auth === 'secure' ? protect : (req: Request, res: Response, next: Function) => next();
  }

  private async execute(req: Request, res: Response, controller: ControllerFunction) {
    try {
      const response = await controller(req, res);
      res.status(response.status).json(response);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        type: 'error'
      });
    }
  }

  get(route: string) {
    return {
      authSecure: (controller: ControllerFunction) => {
        return this.router.get(route, this.authMiddleware('secure'), (req, res) => {
          this.execute(req, res, controller);
        });
      },
      noAuth: (controller: ControllerFunction) => {
        return this.router.get(route, this.authMiddleware('public'), (req, res) => {
          this.execute(req, res, controller);
        });
      }
    };
  }

  post(route: string) {
    return {
      authSecure: (controller: ControllerFunction) => {
        return this.router.post(route, this.authMiddleware('secure'), (req, res) => {
          this.execute(req, res, controller);
        });
      },
      noAuth: (controller: ControllerFunction) => {
        return this.router.post(route, this.authMiddleware('public'), (req, res) => {
          this.execute(req, res, controller);
        });
      }
    };
  }

  put(route: string) {
    return {
      authSecure: (controller: ControllerFunction) => {
        return this.router.put(route, this.authMiddleware('secure'), (req, res) => {
          this.execute(req, res, controller);
        });
      },
      noAuth: (controller: ControllerFunction) => {
        return this.router.put(route, this.authMiddleware('public'), (req, res) => {
          this.execute(req, res, controller);
        });
      }
    };
  }

  delete(route: string) {
    return {
      authSecure: (controller: ControllerFunction) => {
        return this.router.delete(route, this.authMiddleware('secure'), (req, res) => {
          this.execute(req, res, controller);
        });
      },
      noAuth: (controller: ControllerFunction) => {
        return this.router.delete(route, this.authMiddleware('public'), (req, res) => {
          this.execute(req, res, controller);
        });
      }
    };
  }

  getRouter(): Router {
    return this.router;
  }
}

const apiRouterInstance = new ApiRouter();
export const createApi = () => apiRouterInstance;
export const routes = apiRouterInstance.getRouter();