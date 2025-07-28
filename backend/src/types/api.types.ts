import { Request, Response } from 'express';
import { AuthenticatedRequest, ApiResponse, ControllerFunction } from './controllers/base.types';

export interface RouteConfig {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  controller: ControllerFunction;
  authRequired: boolean;
}