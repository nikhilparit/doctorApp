import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice';
import clinicSlice from '../features/clinicSlice';
import dashboardSlice from '../features/dashboardSlice';
import patientsSlice from '../features/patientsSlice';
import appointmentSlice from '../features/appointmentSlice';
import commonSlice from '../features/commonSlice';
import patientprofileSlice from '../features/patientprofileSlice';
import examinationSlice from '../features/examinationSlice';
import filesSlice from '../features/filesSlice';


const store = configureStore({
  reducer: {
    auth: authSlice,
    clinic: clinicSlice,
    dashboard: dashboardSlice,
    patient: patientsSlice,
    appointment: appointmentSlice,
    common: commonSlice,
    patientprofile:patientprofileSlice,
    examination:examinationSlice,
    fileData:filesSlice
  },
});

export default store;
