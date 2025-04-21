import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Sử dụng IP của máy tính thay vì localhost
const API_URL = "http://192.168.1.203:3000/XeMay"; // Thay 192.168.1.1 bằng IP thật của máy bạn

export const fetchXeMay = createAsyncThunk("XeMay/fetchXeMay", async () => {
  try {
    console.log("Fetching data from:", API_URL);
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
});

export const addXeMay = createAsyncThunk("XeMay/addXeMay", async (xeMay) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(xeMay),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
});

export const updateXeMay = createAsyncThunk(
  "XeMay/updateXeMay",
  async (xeMay) => {
    try {
      const response = await fetch(`${API_URL}/${xeMay.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(xeMay),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }
);

export const deleteXeMay = createAsyncThunk("XeMay/deleteXeMay", async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return id;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
});

const xeMaySlice = createSlice({
  name: "XeMay",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchXeMay.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchXeMay.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchXeMay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addXeMay.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(updateXeMay.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(deleteXeMay.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      });
  },
});

export default xeMaySlice.reducer;
