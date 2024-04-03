export interface PreLoginResponse {
  lookup: Lookup;
  status_code: number;
  code: string;
  resource_name: string;
  message: string;
}

export interface Lookup {
  identifier: string;
  loginid: string;
  modes: Modes;
  doc_link: string;
  digest: string;
  admin: string;
  href: string;
}

export interface Modes {
  federated: Federated;
  allowed_modes: string[];
  email: Email;
}

export interface Federated {
  data: Daum[];
  count: number;
}

export interface Daum {
  idp: string;
  redirect_uri: string;
}

export interface Email {
  data: Daum2[];
  count: number;
}

export interface Daum2 {
  e_email: string;
  email: string;
}

export interface LoginResponse {
  passwordauth: Passwordauth;
  status_code: number;
  code: string;
  resource_name: string;
  message: string;
}

export interface Passwordauth {
  code: string;
  redirect_uri: string;
  href: string;
}

export interface TokenCheck {
  isSuccess?: boolean;
  error?: string;
}

export interface AttendanceMonthlyReport {
  isPermissionConfigured: boolean;
  showOverDevTime: number;
  weekDetails: WeekDetails;
}

export interface WeekDetails {
  empId1: string;
  totalPaidOffDaysInSecs: number;
  workingHrs: string;
  exp_workingDaysInSecs: number;
  nonStatWeekend_ot: number;
  totalPaidBreakHours: string;
  totalPaidDays_count: number;
  holiday_ot: number;
  pp_PaidOffDaysInsecs: number;
  holiday_count: number;
  empStat: number;
  custStatWknd_Name: string;
  totalPaidOffDays_count: number;
  totalStatWkndHrs: number;
  zp_nonStatWkndSecs: number;
  totalWeekendCount: number;
  totalUnPaidBreakHours: string;
  nonStatWeekend_lateNight_ot: number;
  workingHours_tsecs: number;
  tsecs: number;
  exp_workingDays_count: number;
  regWeekendHours: number;
  absent_count: number;
  totalPermissionHours: string;
  leave_count: number;
  isLateNightTrackingEnabled: boolean;
  totalHolidayDaysInSecs: number;
  statWeekend_reg_ot: number;
  nonWkndHoliday_lateNight_ot: number;
  totalPermissionInSecs: number;
  zp_weekendSecs: number;
  totalWorkedDays_count: number;
  totalNonStatWkndHrs: number;
  lop_leave_count: number;
  locationId: number;
  tdays: number;
  holiday_reg_ot: number;
  onduty_count: number;
  totalPaidBreakInSecs: number;
  totalWorkedDaysInSecs: number;
  weekend_count: number;
  zp_statwkndSecs: number;
  pp_PaidOffDays: number;
  leavesecs: number;
  regularWorkingHours: number;
  noEnName: string;
  statWknd: string;
  totalWeekendDaysInSecs: number;
  weekend_ot: number;
  fullPayforHalfWorkingDay: number;
  statWkndCnt: number;
  pp_expectedPaidDays: number;
  emailId: string;
  zp_HolidaySecs: number;
  leave_hours: string;
  totalUnPaidOffDaysInSecs: number;
  cumulativeOvertime: number;
  zuId: number;
  lateNightWorkingHours: number;
  lop_leave_hours: string;
  totalUnPaidBreakInSecs: number;
  nonStatWkndCnt: number;
  isStatWeekendConfig: boolean;
  tHrs: string;
  totalUnPaidOffDays_count: number;
  onduty_hours: string;
  overTime_tsecs: number;
  zp_nonStatWkndCnt: number;
  pp_expectedPaidDaysInSecs: number;
  zp_weekendCount: number;
  nonStatWeekend_reg_ot: number;
  name: string;
  totalAbsentDaysInSecs: number;
  mailId: string;
  holiday_lateNight_ot: number;
  weekend_lateNight_ot: number;
  statWeekend_ot: number;
  fullPayForHalfDayCount: number;
  empId: string;
  nonWkndHoliday_ot: number;
  ondutysecs: number;
  nonWkndHoliday_reg_ot: number;
  weekend_reg_ot: number;
  lop_leave_secs: number;
  zp_HolidayCount: number;
  totalPayDaysInSecs: number;
  statWeekend_lateNight_ot: number;
  zp_statwkndCnt: number;
  custNonStatWknd_Name: string;
  total_count: number;
  eno: string;
  present_count: number;
  devTime_tsecs: number;
}

declare global {
  interface ReadableStream {}
}

export interface CheckInResponse {
  msg: Msg;
  curDayBreakDetails: CurDayBreakDetails;
}

export interface Msg {
  currentPunchinAttenId: string;
  inputType_in: number;
  dateFormat: string;
  attenId: string;
  tempTsecs: number;
  latitude: number;
  fdate: string;
  dayList: DayList;
  tsecs: string;
  punchIn: string;
  longitude: number;
}

export interface DayList {
  "0": N0;
  fromRowAttId: string;
  toRowAttId: string;
}

export interface N0 {
  totalPermissionHours: string;
  tHrs: string;
  totalUnPaidBreakHours: string;
  orgdate: string;
  attenid: string;
  shift: Shift;
  totalPaidBreakInSecs: number;
  totalPaidBreakHours: string;
  isToday: boolean;
  totalPermissionInSecs: number;
  filo: Filo;
  overTime_tsecs: number;
  lateNight_overtTime_tsecs: number;
  tsecs: number;
  userTimeZone: string;
  totalUnPaidBreakInSecs: number;
  ldate: string;
  wsecs: number;
  day: number;
  attDate: string;
  showAllowanceColumn: boolean;
  status: string;
}

export interface Shift {
  shiftId: string;
  shiftName: string;
  select: number;
  fTime: number;
  sName: string;
  nonWorkingMins: number;
  colorCode: number;
  from: string;
  tTime: number;
  allowanceEnabled: number;
}

export interface Filo {
  ftime: string;
  intime: number;
  outime: number;
  roundedOffFirstIn: string;
  deviationIn: number;
  longitude_out: number;
  expectedFromtime: string;
  latitude_out: number;
  tdate: string;
  checkin: string;
  roundedOffLastOut: string;
  expectedIn: number;
  geoLocation_in: string;
  fdate: string;
  ttime: string;
  geoLocation_out: string;
  checkout: string;
  earlyLateCheckIn: string;
}

export interface CurDayBreakDetails {}

export interface CheckOutResponse {
  punchOut: PunchOut
}

export interface PunchOut {
  inputType_out: number
  tdate: string
  dateFormat: string
  latitude: number
  fdate: string
  dayList: DayList
  tsecs: number
  longitude: number
}

export interface DayList {
  "0": N0
  fromRowAttId: string
  toRowAttId: string
}

export interface N0 {
  totalPermissionHours: string
  tHrs: string
  totalUnPaidBreakHours: string
  orgdate: string
  attenid: string
  shift: Shift
  totalPaidBreakInSecs: number
  totalPaidBreakHours: string
  isToday: boolean
  totalPermissionInSecs: number
  filo: Filo
  overTime_tsecs: number
  lateNight_overtTime_tsecs: number
  tsecs: number
  userTimeZone: string
  totalUnPaidBreakInSecs: number
  ldate: string
  wsecs: number
  day: number
  attDate: string
  showAllowanceColumn: boolean
  status: string
}

export interface Shift {
  shiftId: string
  shiftName: string
  select: number
  fTime: number
  sName: string
  nonWorkingMins: number
  colorCode: number
  from: string
  tTime: number
  allowanceEnabled: number
}

export interface Filo {
  ftime: string
  intime: number
  outime: number
  roundedOffFirstIn: string
  deviationIn: number
  longitude_out: number
  expectedFromtime: string
  latitude_out: number
  tdate: string
  checkin: string
  roundedOffLastOut: string
  expectedIn: number
  geoLocation_in: string
  fdate: string
  ttime: string
  geoLocation_out: string
  checkout: string
  earlyLateCheckIn: string
}
