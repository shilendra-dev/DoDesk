import { ApiResponse } from '../types/controllers/base.types';

export const respondOk = <T = any>(data: T, message: string): ApiResponse<T> => {
  return {
    status: 200,
    data,
    message,
    type: 'success'
  };
};

export const respondError = (status: number, message: string): ApiResponse => {
  return {
    status,
    message,
    type: 'error'
  };
}; 