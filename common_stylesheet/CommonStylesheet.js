import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const mainCardHeader = Math.min(width, height) * 0.03;//jyotsana
const secondaryCardHeader = Math.min(width, height) * 0.04;
const regularCardText = Math.min(width, height) * 0.02;

//fonts_for_tablet_and_mobile
//jyo
const regularFontSize = width < 600 ? 14 : 16;
const primaryFontSize = width < 600 ? 18 : 20;


const CommonStylesheet = StyleSheet.create({
  parentConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain'
  },
  backgroundimage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular'
  },
  //jyo
  ButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular'
  },


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'pink',
    padding: 5
  },
  //jyotsana
  containerHomeScreen: {
    flex: 1,
    backgroundColor: '#f2f8ff',
  },

  iconstylediscover:
  {
    color: '#2196f3',
    fontSize: 20,

  },
  iconstyledashboard:
  {
    color: '#2196f3',
    fontSize: 40,
    marginBottom:10

  },
  containerDashboardScreen: {

    backgroundColor: '#f2f8ff',
  },
  //   headerText: {
  //     fontSize: 18,
  //     color: '#fff',
  //     marginTop: 10

  //   },
  headerTextForgotScreen: {
    fontSize: 16,
    color: '#005699',
    marginTop: 50,
    fontFamily: 'Poppins-Bold'

  },
  headerTxtsecondary: {
    fontSize: regularFontSize,
    color: 'black',
    marginRight: 2,
    fontFamily: 'Poppins-Bold'

  },
  Splashlogo: {
    width: '50%',
    height: '50%',
    fontWeight: 'bold'
  },

  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  //jyo
  Text: {
    fontSize: 14,
    color: '#5f6067',
    fontFamily: 'Poppins-Regular',
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
textAlign:'center'
  },
   // ujwala
   textPatientList: {
    fontSize: 14,
    //fontWeight:'bold',
    color: '#576067',
    fontFamily: 'Poppins-Regular',// ujwala10
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed

  },
 //ujwala
 dashboardText:
 {
   fontSize: 16  ,
   color: '#000',
 
   fontFamily: 'Poppins-SemiBold',
   // lineHeight: Math.min(width, height) * 0.05, 
 },


  TextForgotScreen: {
    fontSize: regularFontSize,
    color: '#5f6067',
    fontFamily: 'Poppins-Bold',
    // justifyContent:'center',
    textAlign: 'center',


  },

  iconsmanage:
  {
    color: '#fff',
    fontSize: 30,

  },

  headertext16: {
    fontSize: 16,
    color: '#2196f3',
    //color: '#000',
    fontFamily: 'Poppins-SemiBold',
    // lineHeight: Math.min(width, height) * 0.05, 
  },
  headertext14: {
    fontSize: 14,
    color: '#5f6067',
    fontFamily: 'Poppins-Medium',
  },
  cardImage: {
    width: 180,
    height: 70,
  },
  borderforcardatHomeScreen: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#2196f3',
    height: height * 0.07,
    width: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,

  },
  imageatPatientScreen: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 90,
    width: 90,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    marginLeft: 15
  },
  borderforcardatPatientListScreen: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#2196f3',
    height: 'auto',
    width: '100%',
    backgroundColor: '#ffff',
    //marginTop: 8,
    // height:hp('22%'),
    // width: wp('98%'),
    // marginTop:5,
    // marginBottom:5,
    // padding:10
  },
  borderforcardatAppointmentListScreen: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#2196f3',
    height: height * 0.25,//ujwala
    width: width - 20,
    backgroundColor: '#ffff',
    alignSelf: 'center'
  },
  imageatDetailsScreen: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // borderWidth: 1,
    width: 60,
    height: 60,
    borderRadius: 15,
    // marginTop: 20
    
  },
  borderforcardPatientListScreen: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#005599',
    height: 80,
    width: width - 11,
    backgroundColor: '#ffff',
    marginTop: 5,
    marginLeft: 4
  },
  imageatAddPatientScreen1: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 55,
    marginTop: 10,
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  iconstylePicture:
  {
    color: '#576067',
    fontSize: 25,
    marginTop: 5,

  },
  textPatientList1:
  {
    fontSize: 14,
    color: '#576067',
    fontFamily: 'Poppins-Regular',
  },
   //jyotsana
   eventInsideCard1: {
    height: height*0.15,
    width: '48%',
    backgroundColor: '#ffff',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#2196f3'
  },


//jyotsana
imageatQualification: {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  // borderWidth: 1,
  width: 70,
  height: 70,
  borderRadius: 50,
  marginTop: 20
  
},

  imageofwatchatappointment: {
    // borderWidth: 1,
    width: width * 0.04, // Adjust width based on screen width
    height: height * 0.04, // Adjust height based on screen height
    resizeMode: 'contain', // You can adjust the resizeMode as needed

  },
  popup: {
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 45,
    right: 0

  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomColor: '#ccc'

  },
  imageatHomeScreen: {
    margin: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 100,
    width: 120,
    borderWidth: 1,
    borderColor: '#808080',
  },
  borderforcardatdatewise: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#3399ff',
    height: 60,
    width: width - 10,
    backgroundColor: 'white',
    marginTop: 10,
    justifyContent: 'center'
  },
  Hometitle: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#2196f3',
    height: 30,
    backgroundColor: '#50AEF8',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 15
  },
  shadow: {

    shadowColor: '#000',
    shadowOffset: {
    width: 1,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  //ujwala
  formContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
    backgroundColor:'#f2f8ff'
},

  eventInsideCard: {
    height: height * 0.2,
    width: '48%',
    backgroundColor: '#ffff',
    borderRadius: 10,
    shadowColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#2196f3'
  },
  imageHomeScreen: {
    //margin:8,
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1,
    width: width * 0.13, // Adjust width based on screen width
    height: height * 0.13, // Adjust height based on screen height
    resizeMode: 'contain', // You can adjust the resizeMode as needed
    // borderRadius: 50,
  },

  imageDashbordScreen: {
    height: 10,
    width: 10,

  },
  //jyotsana
  cardTextHomeScreen:
  {
    color: '#2196F3',
    alignItems: "center",
    fontFamily: 'Poppins-SemiBold',
    fontSize:  width < 600 ? 16 : 20,
    alignSelf: 'center',
    // paddingBottom:10,
    // marginBottom:10,
    

  },
  iconView:
  {
    flexdirection: 'row',
    alignItems: 'center',

  },
  popheader: {
    backgroundColor: '#2196f3'  
  },
  CloseButton: {
    backgroundColor:'#da251d',   
    
 },
  iconatSettingScreen: {
    margin: 10,
    marginTop: 10
  },

  cardtextSettingScreen: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    // marginTop: 30,
    marginLeft: 10
  },
  careticonatSettingScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  headertextTreatmentScreen: {
    fontSize: regularFontSize,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
  },
  countatTreatmentList: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
    marginTop: 10
  },
  //jyo
  cardatClinicLicstScreen: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#3399ff',
    height: 'auto',
    width: '100%', // Adjusted width based on the screen size
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginVertical: 5,
  },
  //jyo
  headertextClinicLicstScreen: {
    fontSize: primaryFontSize,//mainCardHeader,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
  },

  cardtextClinicListScreen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    marginLeft: 10
  },
  //jyo
  headertextClinicLicst: {
    fontSize: regularFontSize,//secondaryCardHeader,
    // color: '#2196f3',
    color: '#484848',
    fontFamily: 'Poppins-Regular',
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
  },
  //jyo
  subheadertextClinicLicst: {
    fontSize: regularFontSize,//secondaryCardHeader,
    // color: '#2196f3',
    color: '#00bc00',
    fontFamily: 'Poppins-Regular',
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
  },
  //jyo
  subheadertextClinicLicst1: {
    fontSize: regularFontSize,//secondaryCardHeader,
    // color: '#2196f3',
    color: 'red',
    fontFamily: 'Poppins-Regular',
    lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
  },

  //Spinner
  Spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250,
  },

  TextDailyCollection: {
    fontSize: 12,
    color: '#595959',
    // fontWeight:'400',
    fontFamily: 'Poppins-Medium'
  },
  cardatDailyCollectionScreen: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'white',
    height: 150,
    width: width - 11,
    backgroundColor: '#ffff',
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 15
  },
  headertextDailyCollectionScreen: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Poppins-Bold',
    marginLeft: 15

 },
  hdertextDailyCollectionScreen: {
    fontSize: 12,
    color: '#2196f3',
    fontFamily: 'Poppins-SemiBold',
  },
  hdertxtatDailyCollectionScreen: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 10
  },
  imageatPatientDetailsScreen: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 55,

  },
  textatPatientDetailsScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  borderforcardatPatientDetailsScreen: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#fff',
    height: 100,
    width: width - 11,
    backgroundColor: '#ffff',
    marginBottom: 100
  },
  headertextatPatientDetails: {
    // fontSize: mainCardHeader,
    fontSize:16,//Ujwala1
    color: '#2196f3',
    fontFamily: 'Poppins-SemiBold',
    textAlign:'center',
    alignContent:'flex-start'
   },
   headertextatPatientDetails1: {
    // fontSize: mainCardHeader,
    fontSize:16,//Ujwala1
    color: '#2196f3',
    fontFamily: 'Poppins-SemiBold',
   alignContent:'flex-start'
   },
   imageatPatient: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height:80,
    width:80,  
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    marginTop:10,
    marginLeft:10
  
  },
  textPatientDetailsScreen: {
    fontSize: 14,
    //fontWeight:'bold',
    color: '#576067',
    fontFamily: 'Poppins-Regular',
    marginLeft: 10
  },
  cardTextatPatientDetailsScreen:
  {
    color: '#000',
    alignItems: "center",
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    alignSelf: 'center',
    marginTop:10

  },
  imageatDenteeforDoctors: {
    //margin:8,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 55,
    marginTop: 10
  },
  //jyotsana
  buttonContainerdelete: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
     width: 150,
    height: 40,
    backgroundColor: '#da251d',
    borderColor: '#da251d',
    borderRadius: 5,
  },
   //jyotsana31
   buttonContainersave: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 150,
    height: 40,
    backgroundColor: '#2196f3',
    borderColor: '#1c80cf',
    borderRadius: 5,
  },

   //jyotsana
   buttonContainersaveatForm: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 150,
    height: 40,
    backgroundColor: '#2196f3',
    borderColor: '#1c80cf',//ujwala
    borderRadius: 5,
  },
  buttonContainerdelete1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 100,
    height: 40,
    backgroundColor: '#da251d',
    borderColor: '#da251d',
    borderRadius: 5,
  },//ujwala10
  buttonContainersave1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 100,
    height: 40,
    backgroundColor: '#2196f3',
    borderColor: '#1c80cf',
    borderRadius: 5,
  },

  

});
export default CommonStylesheet;