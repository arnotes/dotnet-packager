import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers:{
    update: (state, action) => action.payload ?? ''
  }
})