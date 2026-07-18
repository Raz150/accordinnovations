import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPlace: null,
  searchHistory: [],
  status: 'idle',
  error: null,
  favoriteStatus: 'idle',
};

export const selectPlaceAsync = createAsyncThunk('places/selectPlace', async (place, { rejectWithValue }) => {
  try {
    const location = place.geometry?.location;
    return {
      placeId: place.place_id,
      name: place.name || place.formatted_address || 'Unknown place',
      address: place.formatted_address || place.vicinity || 'Address unavailable',
      lat: location?.lat ? location.lat() : null,
      lng: location?.lng ? location.lng() : null,
      types: place.types || [],
      selectedAt: new Date().toISOString(),
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to read place details');
  }
});

export const saveFavoriteAsync = createAsyncThunk('places/saveFavorite', async (place, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:8081/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: place.name,
        address: place.address,
        latitude: place.lat,
        longitude: place.lng,
      }),
    });

    if (!response.ok) {
      throw new Error('Could not save favorite');
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to save favorite');
  }
});

const placeSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectPlaceAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(selectPlaceAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPlace = action.payload;
        const existing = state.searchHistory.find((item) => item.placeId === action.payload.placeId);
        if (!existing) {
          state.searchHistory = [action.payload, ...state.searchHistory].slice(0, 8);
        }
      })
      .addCase(selectPlaceAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load place';
      })
      .addCase(saveFavoriteAsync.pending, (state) => {
        state.favoriteStatus = 'loading';
      })
      .addCase(saveFavoriteAsync.fulfilled, (state) => {
        state.favoriteStatus = 'succeeded';
      })
      .addCase(saveFavoriteAsync.rejected, (state, action) => {
        state.favoriteStatus = 'failed';
        state.error = action.payload || 'Unable to save favorite';
      });
  },
});

export const { clearError } = placeSlice.actions;
export default placeSlice.reducer;
