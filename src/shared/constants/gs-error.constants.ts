// shared/constants/gs-error.constants.ts

export const GSErrorCodes = {
  SUCCESS: { code: '0', message: 'Request successful / 请求成功' },
  CURRENCY_NOT_SUPPORT: { code: '61', message: 'Currency not supported / 货币不兼容' },
  INSUFFICIENT_KIOSK_BALANCE: { code: '70', message: 'Insufficient kiosk balance / 集成系统余额不足' },
  INVALID_REFERENCE_ID: { code: '71', message: 'Invalid reference ID / 单据号不正确' },
  INSUFFICIENT_BALANCE: { code: '72', message: 'Insufficient balance / 余额不足' },
  INVALID_TRANSFER_AMOUNT: { code: '73', message: 'Invalid transfer amount / 转账金额不正确' },
  INVALID_TRANSFER_AMOUNT_TWO_DECIMAL_ONLY: {
    code: '74',
    message: 'Transfer amount can have only two decimal places / 转账金额不能多过两个小数点 0.00',
  },
  NOT_ALLOW_TO_MAKE_TRANSFER_WHILE_IN_GAME: {
    code: '75',
    message: 'Transfer not allowed while in game / 不允许在游戏中进行转移',
  },
  MEMBER_NOT_FOUND: { code: '81', message: 'Member not found / 会员账号不存在' },
  MEMBER_EXISTED: { code: '82', message: 'Member already exists / 会员账号已存在' },
  OPERATOR_EXISTED: { code: '83', message: 'Operator already exists / 代理号已存在' },
  INVALID_PARAMETER: { code: '90', message: 'Invalid parameter / 请求参数不正确' },
  INVALID_OPERATOR: { code: '91', message: 'Invalid operator code / 代理号不正确' },
  INVALID_PROVIDERCODE: { code: '92', message: 'Invalid provider code / 供应商代号不正确' },
  INVALID_PARAMETER_TYPE: { code: '93', message: 'Invalid parameter type / 请求参数类型不正确' },
  INVALID_PARAMETER_USERNAME: { code: '94', message: 'Invalid username / 账号不正确' },
  INVALID_PARAMETER_PASSWORD: { code: '95', message: 'Invalid password / 密码不正确' },
  INVALID_PARAMETER_OPASSWORD: { code: '96', message: 'Invalid old password /旧密码不正确' },
  INVALID_PARAMETER_EMPTY_DOMAINNAME: { code: '97', message: 'Invalid domain name or URL / 请求链接/域名不正确' },
  INVALID_USERNAME_OR_PASSWORD: { code: '98', message: 'Invalid username or password / 账号/密码错误' },
  INVALID_SIGNATURE: { code: '99', message: 'Invalid signature / 加密错误' },
  // Thêm các mã lỗi khác nếu cần
};
