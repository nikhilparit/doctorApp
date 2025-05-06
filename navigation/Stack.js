import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import HomeButton from '../components/HomeButton';
import FilterFileButton from '../components/FilterFileButton';

const Stack = createNativeStackNavigator();
//importing drawer navigator
import MyDrawer from './Drawer';
//importing stack screens
import Splash from '../mobile_screens/authentication/Splash';
import Login from '../mobile_screens/authentication/Login';
import Signup from '../mobile_screens/authentication/Signup';
import Otp from '../mobile_screens/authentication/Otp';
import AddAppointments from '../mobile_screens/appointment/AddAppointments';
import ClinicList from '../mobile_screens/clinic/ClinicList';
import AddClinic from '../mobile_screens/clinic/AddClinic';
import AddPatientViaAppointment from '../mobile_screens/appointment/AddPatientViaAppointment';
import SelectPatientViaAppointment from '../mobile_screens/appointment/SelectPatientViaAppointment';
import PatientProfile from '../mobile_screens/patient/Profile/PatientProfile';
import PatientDetails from '../mobile_screens/patient/PatientDetails';
import PatientMoreDetails from '../mobile_screens/patient/Profile/PatientMoreDetails';
import AddPatient from '../mobile_screens/patient/AddPatient';
import Dashboard from '../mobile_screens/Dashboard/Dashboard';
import MyProfile from '../mobile_screens/Setting/MyProfile/MyProfile';
import Examinations from '../mobile_screens/patient/Examination/Examinations';
import AddExamination from '../mobile_screens/patient/Examination/AddExamination';
import EditExamination from '../mobile_screens/patient/Examination/EditExamination';
import DoctorList from '../mobile_screens/Setting/DoctorList/DoctorList';
import MasterData from '../mobile_screens/Setting/MasterData/MasterData';
import AddCategory from '../mobile_screens/Setting/MasterData/Manage Master/AddCategory';
import SelectCategory from '../mobile_screens/Setting/MasterData/Manage Master/SelectCategory';
import CategoryList from '../mobile_screens/Setting/MasterData/Manage Master/CategoryList';
import AddTreatment from '../mobile_screens/patient/Treatment/AddTreatment';
import Treatment from '../mobile_screens/patient/Treatment/Treatment';
import AddPatientNotes from '../mobile_screens/patient/Notes/AddPatientNotes';
import EditPatientNotes from '../mobile_screens/patient/Notes/EditPatientNotes';
import Notes from '../mobile_screens/patient/Notes/Notes';
import PatientAppointment from '../mobile_screens/patient/Appointment/PatientAppointment';
import EditTreatment from '../mobile_screens/patient/Treatment/EditTreatment';
import Reports from '../mobile_screens/Report/Reports';
import BirthdayReport from '../mobile_screens/Report/BirthdayReport';
import DailyCollection from '../mobile_screens/Report/DailyCollection';
import OutstandingReport from '../mobile_screens/Report/OutstandingReport';
import SMSReport from '../mobile_screens/Report/SMSReport';
import Prescription from '../mobile_screens/patient/Prescription/Prescription';
import AddPrescription from '../mobile_screens/patient/Prescription/AddPrescription';
import EditPrescription from '../mobile_screens/patient/Prescription/EditPrescription';
import Print from '../mobile_screens/Print';
import ClinicDetails from '../mobile_screens/Setting/ClinicDetails/ClinicDetails';
import MedicineList from '../mobile_screens/Setting/MasterData/Medicine/MedicineList';
import AddMedicine from '../mobile_screens/Setting/MasterData/Medicine/AddMedicine';
import EditMedicine from '../mobile_screens/Setting/MasterData/Medicine/EditMedicine';
import TreatmentList from '../mobile_screens/Setting/MasterData/Treatment/TreatmentList';
import EditTreatmentAtSettings from '../mobile_screens/Setting/MasterData/Treatment/EditTreatmentAtSettings';
import AddTreatmentAtSettings from '../mobile_screens/Setting/MasterData/Treatment/AddTreatmentAtSettings';
import EditCategory from '../mobile_screens/Setting/MasterData/Manage Master/EditCategory';
import Bill from '../mobile_screens/patient/Billings/Bill';
import Files from '../mobile_screens/patient/Documents/Files';
import Document from '../mobile_screens/patient/Documents/Document';
//import FileList from '../mobile_screens/patient/Documents/FileList';
import AddBill from '../mobile_screens/patient/Billings/AddBill';
import AddPayment from '../mobile_screens/patient/Billings/AddPayment';
import TreatmentType from '../mobile_screens/patient/Billings/TreatmentType';
import QRCode from '../mobile_screens/qrcode/qrcode';
import FileList from '../mobile_screens/Files/FileList';
import UploadFile from '../mobile_screens/Files/UploadFile';
import FilterFile from '../mobile_screens/Files/FilterFile';
import Assignto from '../mobile_screens/Files/AssignTo';
import FileInfo from '../mobile_screens/Files/FileInfo';
import UploadPatientFile from '../mobile_screens/patient/Documents/UploadPatientFile';
import AI_Document from '../mobile_screens/patient/Documents/AI_Document';
import ForgotPassword from '../mobile_screens/authentication/ForgotPassword';
import ResetPassword from '../mobile_screens/authentication/ResetPassword';
import PasswordOTP from '../mobile_screens/authentication/PasswordOTP';
import AddDoctor from '../mobile_screens/Setting/DoctorList/AddDoctor';
import AccessLevel from '../mobile_screens/Setting/DoctorList/AccessLevel';
const myFontfamily = 'Poppins-Bold';
const myFontSize = 18

function StackScreens() {
  return (
    <Stack.Navigator initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196f3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleStyle: {
          fontFamily: myFontfamily,
          fontSize: myFontSize
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyDrawer"
        component={MyDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddAppointments"
        component={AddAppointments}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add / Edit Appointments',
          headerRight: () => (

            <View style={{ flexDirection: 'row', marginRight: 20 }}>

              <HomeButton />

            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ClinicList"
        component={ClinicList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: '  Clinic List',
          headerBackVisible: false,  // Disable the default back button
          headerLeft: () => null,    // Remove the back button
        }}
      />
      <Stack.Screen
        name="AddClinic"
        component={AddClinic}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Clinic',
        }}
      />
      <Stack.Screen
        name="AddPatientViaAppointment"
        component={AddPatientViaAppointment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add New Patient',
        }}
      />
      <Stack.Screen
        name="SelectPatientViaAppointment"
        component={SelectPatientViaAppointment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Patient List',
        }}
      />
      <Stack.Screen
        name="PatientProfile"
        component={PatientProfile}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Patient Profile',
        }}
      />
      <Stack.Screen
        name="PatientDetails"
        component={PatientDetails}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Patient Details',
        }}
      />
      <Stack.Screen
        name="PatientMoreDetails"
        component={PatientMoreDetails}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Patient Contact Details',
        }}
      />
      <Stack.Screen
        name="AddPatient"
        component={AddPatient}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Patient',
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Dashboard',
          headerRight: () => (

            <View style={{ flexDirection: 'row', marginRight: 20 }}>

              <HomeButton />

            </View>
          ),
        }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'My Profile',
        }}
      />
      <Stack.Screen
        name="Examinations"
        component={Examinations}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Examinations',
        }}
      />
      <Stack.Screen
        name="AddExamination"
        component={AddExamination}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Examination',
        }}
      />
      <Stack.Screen
        name="EditExamination"
        component={EditExamination}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Examination',
        }}
      />
      <Stack.Screen
        name="DoctorList"
        component={DoctorList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Doctor List',
        }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Category',
        }}
      />
      <Stack.Screen
        name="MasterData"
        component={MasterData}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Master Data',
          headerRight: () => (

            <View style={{ flexDirection: 'row', marginRight: 20 }}>

              <HomeButton />

            </View>
          ),
        }}
      />
      <Stack.Screen
        name="SelectCategory"
        component={SelectCategory}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Select Category',
        }}
      />
      <Stack.Screen
        name="CategoryList"
        component={CategoryList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Category List',
        }}
      />
      <Stack.Screen
        name="AddTreatment"
        component={AddTreatment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Treatment',
        }}
      />
      <Stack.Screen
        name="Treatment"
        component={Treatment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Treatment',
        }}
      />
      <Stack.Screen
        name="AddPatientNotes"
        component={AddPatientNotes}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Patient Notes',
        }}
      />
      <Stack.Screen
        name="EditPatientNotes"
        component={EditPatientNotes}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Patient Notes',
        }}
      />
      <Stack.Screen
        name="Notes"
        component={Notes}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Notes',
        }}
      />
      <Stack.Screen
        name="PatientAppointment"
        component={PatientAppointment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Patient Appointments',
        }}
      />
      <Stack.Screen
        name="EditTreatment"
        component={EditTreatment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Treatment',
        }}
      />
      <Stack.Screen
        name="Reports"
        component={Reports}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Reports',
        }}
      />
      <Stack.Screen
        name="BirthdayReport"
        component={BirthdayReport}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Birthday Report',
        }}
      />
      <Stack.Screen
        name="DailyCollection"
        component={DailyCollection}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Daily Collection',
        }}
      />
      <Stack.Screen
        name="OutstandingReport"
        component={OutstandingReport}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Outstanding Report',
        }}
      />
      <Stack.Screen
        name="SMSReport"
        component={SMSReport}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'SMS Report',
        }}
      />
      <Stack.Screen
        name="Prescription"
        component={Prescription}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Prescription',
        }}
      />
      <Stack.Screen
        name="AddPrescription"
        component={AddPrescription}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Prescription',
        }}
      />
      <Stack.Screen
        name="EditPrescription"
        component={EditPrescription}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Prescription',
        }}
      />
      <Stack.Screen
        name="Print"
        component={Print}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Print',
        }}
      />
      <Stack.Screen
        name="ClinicDetails"
        component={ClinicDetails}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Clinic Details',
        }}
      />
      <Stack.Screen
        name="MedicineList"
        component={MedicineList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Medicine List',
        }}
      />
      <Stack.Screen
        name="AddMedicine"
        component={AddMedicine}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Medicine',
        }}
      />
      <Stack.Screen
        name="EditMedicine"
        component={EditMedicine}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Medicine',
        }}
      />
      <Stack.Screen
        name="TreatmentList"
        component={TreatmentList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Treatment List',
        }}
      />
      <Stack.Screen
        name="EditTreatmentAtSettings"
        component={EditTreatmentAtSettings}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Treatment',
        }}
      />
      <Stack.Screen
        name="AddTreatmentAtSettings"
        component={AddTreatmentAtSettings}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Treatment At Settings',
        }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategory}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Edit Category',
        }}
      />
      <Stack.Screen
        name="Bill"
        component={Bill}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Billing',
        }}
      />
      <Stack.Screen
        name="Files"
        component={Files}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Files',
        }}
      />
      <Stack.Screen
        name="Document"
        component={Document}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Document',
        }}
      />
      {/* <Stack.Screen
        name="FileList"
        component={FileList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Files', 
        }}
      /> */}
      <Stack.Screen
        name="AddBill"
        component={AddBill}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Bill',
        }}
      />
      <Stack.Screen
        name="AddPayment"
        component={AddPayment}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Payment',
        }}
      />
      <Stack.Screen
        name="TreatmentType"
        component={TreatmentType}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Treatment Type',
        }}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCode}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'QR-Code Generator',
        }}
      />
      {/* <Stack.Screen
        name="FileList"
        component={FileList}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Files',
          headerRight: () => (

            <View style={{ flexDirection: 'row', marginRight: 20 }}>

              <FilterFileButton />

            </View>
          ),
        }}
      /> */}
      <Stack.Screen
        name="UploadFile"
        component={UploadFile}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Files',

        }}
      />
      <Stack.Screen
        name="FilterFile"
        component={FilterFile}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Filter File',

        }}
      />
      <Stack.Screen
        name="AssignTo"
        component={Assignto}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Assign To',

        }}
      />
      <Stack.Screen
        name="FileInfo"
        component={FileInfo}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'File Info',

        }}
      />
      <Stack.Screen
        name="UploadPatientFile"
        component={UploadPatientFile}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Upload File',
        }}
      />
      <Stack.Screen
        name="AI_Document"
        component={AI_Document}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'AI Document',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Forgot Password',
        }}
      />
      <Stack.Screen
        name="PasswordOTP"
        component={PasswordOTP}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'OTP',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Reset Password',
        }}
      />
       <Stack.Screen
        name="AddDoctor"
        component={AddDoctor}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Add Doctor',
        }}
      />
      <Stack.Screen
        name="AccessLevel"
        component={AccessLevel}
        options={{
          headerTintColor: 'white',
          headerShown: true,
          title: 'Access Level',
        }}
      />
    </Stack.Navigator>
  );
}

export default StackScreens;
