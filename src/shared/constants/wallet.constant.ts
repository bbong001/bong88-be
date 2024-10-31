export enum WALLET_TYPE {
  MAIN = 'MAIN',
}

export enum WALLET_STATUS {
  ACTIVE = 'ACTIVE', // Ví đang hoạt động bình thường
  INACTIVE = 'INACTIVE', // Ví không hoạt động
  SUSPENDED = 'SUSPENDED', // Ví bị tạm ngưng do vi phạm hoặc điều tra
  PENDING = 'PENDING', // Ví đang trong trạng thái chờ kích hoạt hoặc chờ phê duyệt
  CLOSED = 'CLOSED', // Ví đã bị đóng
  FROZEN = 'FROZEN', // Ví bị đóng băng, không thể thực hiện giao dịch
  VERIFIED = 'VERIFIED', // Ví đã xác minh danh tính
  UNVERIFIED = 'UNVERIFIED', // Ví chưa xác minh danh tính
  LIMITED = 'LIMITED', // Ví bị giới hạn chức năng
  BLOCKED = 'BLOCKED', // Ví bị khóa do phát hiện hành vi bất thường
}

export enum WALLET_ACTION {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}
