import { BadRequestException } from '@nestjs/common';


export enum SERVER_TYPE {
  LOCAL = 'local-server',
  DEV = 'dev-server',
  PROD = 'prod-server',
}


export class BadRequest {
  static readonly VALIDATION = (field, message?: string) =>
    new BadRequestException({
      code: 0,
      message: message ?? 'invalid value',
      field,
    });

  static readonly INVALID_LOGIN = (message?: string) =>
    new BadRequestException({
      code: 1,
      message: message ?? 'wrong credentials provided',
    });

  static readonly NOT_EXIST = (fields: string[], message?: string) =>
    new BadRequestException({
      code: 2,
      message: message ?? 'resource(s) not exist',
      fields,
    });
  static readonly UNIQUE_VIOLATION = (detail: any, message?: string) =>
    new BadRequestException({
      code: 3,
      message: message ?? 'already exist',
      detail,
    });

  static readonly FK_VIOLATION = (
    detail: any,
    relation: string,
    message?: string,
  ) =>
    new BadRequestException({
      code: 4,
      message: message ?? 'resource referenced from a relation',
      relation,
      detail,
    });

  static readonly NOT_NUL_VIOLATION = (field, message?: string) =>
    new BadRequestException({
      code: 5,
      message: message ?? 'required field',
      field,
    });

  static readonly REJECTED_FILE = (
    supportedTypes?: string[],
    message?: string,
  ) =>
    new BadRequestException({
      code: 6,
      message: message ?? 'file type not supported',
      supportedTypes,
    });

  static readonly EMPTY_CART = (message?: string) =>
    new BadRequestException({
      code: 7,
      message: message ?? 'empty shopping cart',
    });

  static readonly INVALID_COUPON = (message?: string) =>
    new BadRequestException({
      code: 8,
      message: message ?? 'invalid coupon',
    });

  static readonly NO_SALES_REP = (message?: string) =>
    new BadRequestException({
      code: 9,
      message: message ?? 'order not assigned to a sales representative',
    });

  static readonly LOW_CREDIT = (message?: string) =>
    new BadRequestException({
      code: 10,
      message: message ?? 'no enough credit',
    });

  static readonly ORDER_NOT_PAID = (message?: string) =>
    new BadRequestException({
      code: 11,
      message: message ?? 'order not paid',
    });

  static readonly NO_DELIVERY_DAY = (message?: string) =>
    new BadRequestException({
      code: 12,
      message: message ?? 'merchant does not have a delivery day',
    });

  static readonly POINT_ALREADY_EXISTS = (message?: string) =>
    new BadRequestException({
      code: 13,
      message: message ?? 'the branch already assigned to this route',
    });

  static readonly ORDER_REJECTED = (message?: string) =>
    new BadRequestException({
      code: 14,
      message: message ?? 'order rejected',
    });

  static readonly ALREADY_EXISTS = (message?: string) =>
    new BadRequestException({
      code: 15,
      message: message ?? 'already exists',
    });
}



export class BadRequestResponseBody {
  static readonly UNIQUE_VIOLATION = (detail: any) => ({
    code: 3,
    message: 'already exist',
    detail,
  });
  static readonly FK_VIOLATION = (detail: any, relation: string) => ({
    code: 4,
    message: 'resource referenced from a relation',
    relation,
    detail,
  });
  static readonly DATABASE_ERROR = 'Database error occurred';

}

// export class Notification {
//   static readonly ORDER_CREATED = (title?: string, body?: string) => ({
//     title: title ?? 'Order Created',
//     body: body ?? 'تم انشاء الطلب',
//     topic: NotificationType.NEW_ORDER,
//   });
//   static readonly ORDER_ASSIGNED = (title?: string, body?: string) => ({
//     title: title ?? 'Order Assigned',
//     body: body ?? 'لديك طلب جديد',
//     topic: NotificationType.NEW_ORDER,
//   });
//   static readonly ORDER_PAID = (title?: string, body?: string) => ({
//     title: title ?? 'Order Paid',
//     body: body ?? 'تم الدفع',
//     topic: NotificationType.ORDER_PAID,
//   });
//   static readonly ORDER_DELIVERED = (title?: string, body?: string) => ({
//     title: title ?? 'Order delivered',
//     body: body ?? 'تم توصيل الطلب',
//     topic: NotificationType.ORDER_DELIVERED,
//   });
//   static readonly CREDIT_INCREASED = (title?: string, body?: string) => ({
//     title: title ?? 'Credit Increased',
//     body: body ?? 'credit increased',
//     topic: NotificationType.CREDIT_INCREASED,
//   });

//   static readonly NEW_MESSAGE = (
//     message?: string,
//     title?: string,
//     body?: string,
//   ) => ({
//     title: title ?? 'رسالة جديدة',
//     body: message ?? body ?? 'رسالة جديدة',
//     topic: NotificationType.CHAT,
//   });
// }
