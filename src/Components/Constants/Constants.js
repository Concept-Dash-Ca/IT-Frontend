export const HOST = 'https://it-api.conceptdash.ca'
// export const HOST = 'http://localhost:8080'

//get
export const GET_TIMESHEET = '/api/get/timesheet:id'
export const GET_TASKS = '/api/get/tasks:id'

// login
export const LOGIN = '/api/login'

// add and update
export const ADD_PROJECT = '/api/add/project'
export const ADD_EMPLOYEE = '/api/add/employee'
export const UPDATE_PROJECT = '/api/update/project'
export const UPDATE_EMPLOYEE = '/api/update/project'
export const ADD_TASK = '/api/add/task'
export const UPDATE_TASK = '/api/update/task'
export const ADD_MEET = '/api/add/meetToTimesheet'
export const ADD_TIMESHEET = '/api/add/timesheet'


// Pagination and search and filtering
export const PROJECTS = '/api/get/projects'
export const EMPLOYEES = '/api/get/employees'
export const COUNT_PROJECTS = '/api/get/count/projects'
export const COUNT_EMPLOYEES = '/api/get/count/employees'
export const SEACRH_PROJECTS = '/api/get/search/projects'
export const SEARCH_EMPLOYEES = '/api/get/search/employees'
export const EMPLOYEE_NAMES = '/api/list/employees'
export const PROJECT_NAMES = '/api/list/projects'

//charts and graphs
export const TASKS_COUNT = '/api/dashboard/count/tasks'
export const PROJECTS_COUNT = '/api/dashboard/count/project'
export const WEEKLY_ANALYSIS = '/api/dashboard/chart/timesheet'