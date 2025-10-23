import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import categoryReducer from "@/redux/features/category/categorySlice";
import wishlistReducer from "@/redux/features/wishlist/wishListSlice";
import courseReducer from "@/redux/features/course/courseSlice";
import cartReducer from "@/redux/features/cart/cartSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  course: courseReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "wishlist", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

persistor.subscribe(() => {
  console.log("Persistor state:", persistor.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
