// x-c - create
// x-r - read
// x-u - update
// x-d - delete
// x-cr - create/read
// x-crud - all operations

// 1 - users
// 1-crud-A
// 1-crud
// 1-A
// 1

export enum RoleEnum {
  MASTER = 'master',
  ADMIN = '0',
  USER = '1',
  COMPANY = '2',
  EPI = '3',
  CONTRACTS = '4.1',
  ACTION_PLAN = '5',
  CLINICS = '6',
  EXAM = '6.1',
  SCHEDULE_EXAM = '7',
  RISK = '8',
  DOCTOR = '10',
  NOTIFICATION = '11',
  SECURITY = '12',
  MEDICINE = '13',
  DOCUMENTS = '14',
  EMPLOYEE = '15',
  ESOCIAL = '16',

  DATABASE = '99',
  CHECKLIST = '98',
}

export enum PermissionEnum {
  MASTER = 'master',
  USER = '1',
  ACCESS_GROUP = '1.1',
  PROFESSIONALS = '1.2',
  COMPANY = '2',
  EMPLOYEE = '2.1',
  EMPLOYEE_HISTORY = '2.2', //*new
  COMPANY_SCHEDULE = '2.3', //*new
  EMPLOYEE_HISTORY_FILE = '2.4', //*new
  EPI = '3',
  RISK = '4.0',
  GS = '4.1',
  REC_MED = '4.2',
  RISK_DATA = '4.3',
  PGR = '4.4',
  ACTION_PLAN = '4.5',
  CHARACTERIZATION = '4.6',
  PCMSO = '4.7',
  EXAM_RISK = '4.8',
  EXAM_CLINIC = '4.9',
  CLINIC_SCHEDULE = '5', //*new
  HOMO_GROUP = '6', //*new
  EXAM = '7',
  RISK_DOC_INFO = '8', //*new
  COMPANY_GROUPS = '9', //*new
  DOCUMENTS = '10', //* new
  CONTRACTS = '11', //* new
  CLINIC = '12',
  PROTOCOL = '13',
  ESOCIAL = '14',
  PROF_RESP = '15',
}
