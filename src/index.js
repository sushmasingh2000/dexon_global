import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store/store";
import { SocketProvider } from "./Shared/socket/SocketContext";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 1000,
              style: {
                background: "#000",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
                padding: "10px 16px",
              },
              icon: null,
            }}
            containerStyle={{
              bottom: "20px",
            }}
          />
        </QueryClientProvider>
      </SocketProvider>
    </PersistGate>
  </Provider>
);
