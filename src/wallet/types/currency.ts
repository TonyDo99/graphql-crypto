import { registerEnumType } from '@nestjs/graphql';

export enum CURRENCY {
  USD = 'USD',
  VND = 'VND',
  JPY = 'JPY',
  CNY = 'CNY',
  SGD = 'SGD',
  KPW = 'KPW',
  THB = 'THB',
  RUB = 'RUB',
  GBP = 'GBP',
  AUD = 'AUD',
  AFN = 'AFN',
  INR = 'INR',
  EUR = 'EUR',
}

registerEnumType(CURRENCY, { name: 'Currency' });
