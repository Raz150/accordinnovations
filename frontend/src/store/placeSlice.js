import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  currentPlace: null,
  searchHistory: [],
  favorites: [],
  status: 'idle',
  error: null,
  favoriteStatus: 'idle',
  favoritesStatus: 'idle',
  isFavorited: false,
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
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId: place.placeId,
        name: place.name,
        address: place.address,
        latitude: place.lat,
        longitude: place.lng,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Could not save favorite');
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to save favorite');
  }
});

export const removeFavoriteAsync = createAsyncThunk('places/removeFavorite', async (placeId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${placeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Could not remove favorite');
    }

    return placeId;
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to remove favorite');
  }
});

export const fetchAllFavoritesAsync = createAsyncThunk('places/fetchAllFavorites', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites`);

    if (!response.ok) {
      throw new Error('Could not fetch favorites');
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to fetch favorites');
  }
});

export const checkFavoriteStatusAsync = createAsyncThunk('places/checkFavoriteStatus', async (placeId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites/check/${placeId}`);

    if (!response.ok) {
      return { placeId, isFavorited: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to check favorite status');
  }
});

const placeSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setIsFavorited: (state, action) => {
      state.isFavorited = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Select Place
      .addCase(selectPlaceAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(selectPlaceAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPlace = action.payload;
        state.isFavorited = false; // Reset favorite status when selecting new place
        const existing = state.searchHistory.find((item) => item.placeId === action.payload.placeId);
        if (!existing) {
          state.searchHistory = [action.payload, ...state.searchHistory].slice(0, 8);
        }
      })
      .addCase(selectPlaceAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load place';
      })

      // Save Favorite
      .addCase(saveFavoriteAsync.pending, (state) => {
        state.favoriteStatus = 'loading';
      })
      .addCase(saveFavoriteAsync.fulfilled, (state) => {
        state.favoriteStatus = 'succeeded';
        state.isFavorited = true;
      })
      .addCase(saveFavoriteAsync.rejected, (state, action) => {
        state.favoriteStatus = 'failed';
        state.error = action.payload || 'Unable to save favorite';
      })

      // Remove Favorite
      .addCase(removeFavoriteAsync.pending, (state) => {
        state.favoriteStatus = 'loading';
      })
      .addCase(removeFavoriteAsync.fulfilled, (state) => {
        state.favoriteStatus = 'succeeded';
        state.isFavorited = false;
      })
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.favoriteStatus = 'failed';
        state.error = action.payload || 'Unable to remove favorite';
      })

      // Fetch All Favorites
      .addCase(fetchAllFavoritesAsync.pending, (state) => {
        state.favoritesStatus = 'loading';
      })
      .addCase(fetchAllFavoritesAsync.fulfilled, (state, action) => {
        state.favoritesStatus = 'succeeded';
        state.favorites = action.payload;
      })
      .addCase(fetchAllFavoritesAsync.rejected, (state, action) => {
        state.favoritesStatus = 'failed';
        state.error = action.payload || 'Unable to fetch favorites';
      })

      // Check Favorite Status
      .addCase(checkFavoriteStatusAsync.fulfilled, (state, action) => {
        state.isFavorited = action.payload.isFavorited;
      });
  },
});

export const { clearError, setIsFavorited } = placeSlice.actions;
export default placeSlice.reducer;
