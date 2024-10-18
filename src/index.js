import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './App.css';
import MainPage from "./components/main_page.js"
import ProductPage from "./components/product_page.js"
import Cart from "./components/cart.js"
import { CartProvider } from './cartContext';

const router = createBrowserRouter([
{
  path: "/", element: <MainPage/>,
}, {
  path: "/products/:id", element: <ProductPage/>,
},{
  path: "/cart", element: <Cart/>,
}]);


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </React.StrictMode>
);
