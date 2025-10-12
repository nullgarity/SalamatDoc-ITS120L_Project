/**
 * @typedef {Object} User
 * @property {string} user_ID - Firestore document ID (matches Auth UID)
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} [password]
 * @property {string} contact_number
 * @property {"admin" | "doctor" | "patient"} role
 */

/**
 * @typedef {Object} Patient
 * @property {string} patient_ID
 * @property {string} user_ID
 * @property {string} [insurance_provider]
 * @property {boolean} senior_citizen_status
 * @property {boolean} pwd_status
 * @property {string[]} [chronic_illness]
 */

/**
 * @typedef {Object} Doctor
 * @property {string} doctor_ID
 * @property {string} user_ID
 * @property {string} place_employment
 * @property {string} address
 * @property {string} office_room_no
 * @property {string} office_contact_no
 * @property {string} healthcare_credentials
 * @property {string} medical_field
 * @property {number} years_experience
 */

/**
 * @typedef {Object} Admin
 * @property {string} admin_ID
 * @property {string} user_ID
 */

/**
 * @typedef {Object} Prescription
 * @property {string} prescription_ID
 * @property {string} patient_ID
 * @property {string} doctor_ID
 * @property {Date} date_issued
 * @property {string} med_information
 */

/**
 * @typedef {Object} Appointment
 * @property {string} appointment_ID
 * @property {string} patient_ID
 * @property {string} doctor_ID
 * @property {Date} date_time
 * @property {string} type
 * @property {string} location
 * @property {string} reason
 * @property {string} [notes]
 */

/**
 * @typedef {Object} PersonalHealthCalendar
 * @property {string} calendar_ID
 * @property {string} patient_ID
 * @property {Date} date
 * @property {string} event
 * @property {string} [description]
 */

/**
 * @typedef {Object} DailyMealsChecklist
 * @property {string} meal_ID
 * @property {string} patient_ID
 * @property {string} doctor_ID
 * @property {Date} date_time
 * @property {string} meal_description
 * @property {"Pending" | "Completed" | "Missed"} status
 */

/**
 * @typedef {Object} DailyIntakeMonitor
 * @property {string} intake_ID
 * @property {string} patient_ID
 * @property {string} doctor_ID
 * @property {Date} dateTime
 * @property {string} medication
 * @property {string} dosage
 * @property {"Pending" | "Completed" | "Missed"} status
 */

/**
 * @typedef {Object} RecommendedDiet
 * @property {string} diet_ID
 * @property {string} patient_ID
 * @property {string} doctor_ID
 * @property {string} diet_description
 * @property {string} [notes]
 */

export {};
