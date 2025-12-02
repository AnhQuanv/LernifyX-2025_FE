import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, {
  logout,
  setAccessToken,
} from "@/redux/features/auth/authSlice";
import categoryReducer from "@/redux/features/category/categorySlice";
import wishlistReducer from "@/redux/features/wishlist/wishListSlice";
import courseReducer from "@/redux/features/course/courseSlice";
import cartReducer from "@/redux/features/cart/cartSlice";
import commentReducer from "@/redux/features/comment/commentSlice";
import paymentReducer from "@/redux/features/payment/paymentSlice";

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
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {
  setLogoutCallback,
  setTokenGetter,
  setUpdateTokenCallback,
} from "@/lib/axios";

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// --- Reducers ---
const appReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  course: courseReducer,
  comment: commentReducer,
  payment: paymentReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === logout.type) {
    // ✅ Reset toàn bộ state
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "wishlist", "cart", "course"],
};

// --- Persisted reducer ---
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- Store ---
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// --- Persistor ---
export const persistor = persistStore(store);

persistor.subscribe(() => {
  console.log("Persistor state:", persistor.getState());
});

setTokenGetter(() => store.getState().auth.token);

setUpdateTokenCallback((token) => store.dispatch(setAccessToken(token)));

setLogoutCallback(() => {
  store.dispatch(logout());
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
});

// --- Types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
