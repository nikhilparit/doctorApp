import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../api/Api';
import moment from 'moment';
import { getHeaders } from '../utils/apiHeaders';
//import { navigationRef } from '../../navigation/navigationRef';

// Async Thunk for fetching data
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (params, { getState, rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const clinicID = user.clinicID || params.clinicID;
      const { myclinicID, pageindex, pagesize, StartDate, EndDate, Description, searchData, isCheckboxChecked } = params;
      const token = await AsyncStorage.getItem('token');
      const formData = {
        pageindex,
        pagesize,
        StartDate: moment(StartDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        EndDate: moment(EndDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        Description: Description || 'All',
        clinicID: user.clinicID,
        searchData,
        patientID: '00000000-0000-0000-0000-000000000000'
        //isUnassigned: isCheckboxChecked,
      };

      const response = await Axios.post(
        `${Api}Document/GetDocumentsByClinicIDWithPagingformobileweb`, formData,{ headers }
      );

      if (response.data && response.data.length > 0) {
        const base64Images = await Promise.all(
          response.data.map(async (image) => {
            const newResponse = await Axios.post(
              `${Api}Image/GetImage?imgSrc=${encodeURIComponent(image.physicalFilePath)}&type=patientfiles`,
              {},
              { headers}
            );
            return `data:image/jpeg;base64,${newResponse.data}`;
          })
        );
     //   console.log('response', response.data);


        return {
          files: response.data,
          base64Images,
          nextPageIndex: pageindex + 1,
          hasMoreFiles: true,
        };
      } else {
        return {
          files: [],
          base64Images: [],
          nextPageIndex: pageindex,
          hasMoreFiles: false,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Async Thunk for deleting a file
export const deleteFile = createAsyncThunk(
  'files/deleteFile',

  async ({ FileID, userName, token }, { dispatch, rejectWithValue }) => {
    //console.log('FileID',FileID);
    const formData = {
      fileIds: FileID.toString(),
      lastUpdatedBy: userName,
    };

    try {
      const headers = await getHeaders();
      await Axios.post(
        `${Api}Document/DeleteDocumentFile`,
        formData,
        {
         headers
        }
      );

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateFilesformobile = createAsyncThunk(
  'files/updateFilesformobile',
  async ({ formData }, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const response = await Axios.post(`${Api}Document/UpdateFilesformobile`, formData, { headers });
      return response.data; // Ensure this matches your API structure
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update files');
    }
  }
);
// export const uploadFiles = createAsyncThunk(
//   'files/uploadFiles',
//   async ({ selectedImages, ClinicID, selectedFolder, PatientID, all, token, userName}, { rejectWithValue }) => {
//       try {
//           const formData = new FormData();
//           for (const image of selectedImages) {
//               const base64Data = image.uri.split(',')[1];

//               if (!base64Data) {
//                   console.error("Invalid Base64 Data for image:", image);
//                   continue;
//               }

//               const byteCharacters = atob(base64Data);
//               const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
//               const byteArray = new Uint8Array(byteNumbers);
//               const blob = new Blob([byteArray], { type: image.mimeType });

//               const originalFileName = image.fileName || `image_${Date.now()}.png`;
//               formData.append('cliniLogofile', blob, originalFileName);
//           }

//           // First API call: Upload files
//           const response = await Axios.post(
//               `${Api}Document/UploadFiles?ClinicID=${ClinicID}`,
//               formData,
//               {
//                   headers: {
//                       "Content-Type": "multipart/form-data",
//                       'AT': 'MobileApp',
//                       'Authorization': token,
//                   },
//               }
//           );
//           const formDataSecondCall = {
//               clinicID: ClinicID,
//               description: all,
//               folderId: selectedFolder,
//               patientID: PatientID || '00000000-0000-0000-0000-000000000000',
//               documentsFileDTOListDTO: response.data.map(imageData => ({
//                   documentsFileDTO: {
//                       clinicID: ClinicID,
//                       id: 0,
//                       pageSize: 0,
//                       pageIndex: 0,
//                       documentID: 0,
//                       versionNumber: 0,
//                       relatedVersionID: 0,
//                       relatedVersionNumber: 0,
//                       folderId: selectedFolder,
//                       statusID: 0,
//                       patientID: "00000000-0000-0000-0000-000000000000",
//                       fileName: imageData.fileName,
//                       fileSize: imageData.fileSize,
//                       fileType: imageData.fileType,
//                       virtualFilePath: imageData.virtualFilePath,
//                       physicalFilePath: imageData.physicalFilePath,
//                       publishedOn: new Date().toISOString(),
//                       lastUpdatedDTO: {
//                           createdBy: userName,
//                           createdOn: new Date().toISOString(),
//                           lastUpdatedBy: userName,
//                           lastUpdatedOn: new Date().toISOString()
//                       },
//                       imageBase64: imageData.imageBase64
//                   }
//               }))
//           };
//           const response1 = await Axios.post(
//               `${Api}Document/SaveMultipleDocumentFiles`,
//               formDataSecondCall,
//               {
//                   headers: {
//                       "Content-Type": "application/json",
//                       'AT': 'MobileApp',
//                       'Authorization': token
//                   }
//               }
//           );
//            console.log('response1',response1.config.data);

//          // return response1.data; // Return the response data
//          if (response1.data === 3) {
//           console.log('Navigating to FileList...');
//           navigationRef.current?.navigate('FileList');
//           return {
//             success: true,
//             data: response1.data,
//             configData: JSON.parse(response1.config.data), // Parse config.data
//         };
//           }
//         else {
//               return rejectWithValue(error.response1?.data || error.message);
//             }
          
//       } catch (error) {
//           return rejectWithValue(error.response.data); // Handle error response
//       }
//   }
// );

// slice.js

export const uploadFiles = createAsyncThunk(
  'upload/uploadFiles',
  async ({ formData, ClinicID }, { rejectWithValue }) => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const response = await Axios.post(
        `${Api}Document/UploadFiles?ClinicID=${ClinicID}`,
        formData,
        { headers:{
          Accept: 'application/json',
          AT: 'MobileApp',
          Authorization: user?.token,
      } }
      );

      //console.log('response.data:', response.data);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
     // console.error("Error during API call:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

// export const saveMultipleDocumentFiles = createAsyncThunk(
//   'upload/saveMultipleDocumentFiles',
//   async ({ formDataSecondCall, token }, { rejectWithValue }) => {
//       try {
//           const response = await Axios.post(
//               `${Api}Document/SaveMultipleDocumentFiles`,
//               formDataSecondCall,
//               {
//                   headers: {
//                       "Content-Type": "application/json",
//                       'AT': 'MobileApp',
//                       'Authorization': token,
//                   }
//               }
//           );
//           console.log('response.data;',response.data)
//           return response.data;
//           //return Array.isArray(response.data) ? response.data : [response.data];
//       } catch (error) {
//           return rejectWithValue(error.response.data);
//       }
//   }
// );
export const saveMultipleDocumentFiles = createAsyncThunk(
  'upload/saveMultipleDocumentFiles',
  async ({ formDataSecondCall, token }, { rejectWithValue }) => {
    try {
      const headers =await getHeaders();
      const response = await Axios.post(
        `${Api}Document/SaveMultipleDocumentFiles`,
        formDataSecondCall,
        {
          headers
        }
      );

      //console.log('response.data;', response.data);
      return response.data;
      
      // Ensure the response contains imageBase64 or return an empty array if not
      // if (Array.isArray(response.data)) {
      //   return response.data.map(item => ({
      //     ...item,
      //     imageBase64: item.imageBase64 || "" // Ensure imageBase64 is present
      //   }));
      // } else {
      //   return [];
      // }

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error uploading documents');
    }
  }
);


const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files:  [],
    base64Images: [],
    currentPage: 0,
    hasMoreFiles: true,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetFiles: (state) => {
      state.files = [];
      state.base64Images = [];
      state.currentPage = 0;
      state.hasMoreFiles = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchFiles.pending, (state) => {
        state.status = 'loading';
      }) 
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const newFiles = action.payload.files.filter(file =>
          !state.files.some(existingFile => existingFile.id === file.id)
        );
        // Associate each base64 image with a fileId and filter out existing images
          const newBase64Images = action.payload.base64Images
          .map((image, index) => ({
            uri: image,  
            fileId: action.payload.files[index]?.id  
          }))
          .filter((image, index) => 
            !state.base64Images.some(existingImage => existingImage.fileId === image.fileId)
          );
        state.files = [...state.files, ...newFiles];
        state.base64Images = [...state.base64Images, ...newBase64Images];
      
        state.currentPage = action.payload.nextPageIndex;
        state.hasMoreFiles = action.payload.hasMoreFiles;
      })
      
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

     // Delete Files
      .addCase(deleteFile.fulfilled, (state, action) => {
        const deletedFileID = action.meta.arg.FileID;
        state.files = state.files.filter((file) => file.id !== deletedFileID);
        state.base64Images = state.base64Images.filter((image) => image.fileId !== deletedFileID);
       
      })
      .addCase(deleteFile.rejected, (state, action) => {
        console.error(`Delete file failed: ${action.payload}`);
        state.error = action.payload || 'Failed to delete file';
      })
      //update files
      .addCase(updateFilesformobile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateFilesformobile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.files = action.payload.files || []; // Update state based on payload structure
        } else {
          console.error('Payload is undefined. API might not have returned the expected data.');
          state.files = []; // Fallback to an empty array
        }
      })
      .addCase(updateFilesformobile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      //upload files
.addCase(uploadFiles.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(uploadFiles.fulfilled, (state, action) => {
  state.loading = false;
  // Ensure response is initialized
  if (!state.response) {
      state.response = { data: [] };
  }
  // Check if action.payload is an array
  if (Array.isArray(action.payload)) {
      state.response.data = action.payload;
  } else {
      console.error("Expected an array, got:", action.payload);
      //state.files = [];
  }
})

.addCase(uploadFiles.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(saveMultipleDocumentFiles.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(saveMultipleDocumentFiles.fulfilled, (state, action) => {
  state.loading = false;
  try {
    if (!state.response.data) {
      state.response.data = { data: [] };
  }
      //if (Array.isArray(action.payload)) {
          //state.imageBase64 = action.payload.map((file) => file.imageBase64);
          state.response.data = action.payload;
      //}
      //  else {
      //     throw new Error('Payload is not an array');
      // }
  } catch (error) {
      console.error('Error processing payload:', error.message);
      //state.imageBase64 = []; // Default to empty
  }
})
// .addCase(saveMultipleDocumentFiles.fulfilled, (state, action) => {
//   state.loading = false;
//   try {
//     // Ensure data is set in the state if not already present
//     if (!state.response.data) {
//       state.response.data = { data: [] };
//     }

//     // Check if the payload is an array and update state
//     if (Array.isArray(action.payload)) {
//       // Map through the payload to update imageBase64 if present
//       state.response.data = action.payload.map((file) => ({
//         ...file,
//         imageBase64: file.imageBase64 || "", // Ensure imageBase64 is present
//       }));
//     } else {
//       throw new Error('Payload is not an array');
//     }
//   } catch (error) {
//     console.error('Error processing payload:', error.message);
//     // Handle error case, possibly by resetting imageBase64 or setting to default
//     state.response.data = []; // Reset the data on error
//   }
// })


.addCase(saveMultipleDocumentFiles.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
},

});

export const { resetFiles } = filesSlice.actions;
export default filesSlice.reducer;
