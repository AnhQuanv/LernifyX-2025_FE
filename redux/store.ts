import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import categoryReducer from "@/redux/features/category/categorySlice";
import wishlistReducer from "@/redux/features/wishlist/wishListSlice";
import courseReducer from "@/redux/features/course/courseSlice";
import cartReducer from "@/redux/features/cart/cartSlice";
import commentReducer from "@/redux/features/comment/commentSlice";
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

// ✅ Fix lỗi SSR (no localStorage khi render server)
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
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  course: courseReducer,
  comment: commentReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "wishlist", "cart"],
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

// --- Types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
