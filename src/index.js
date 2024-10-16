import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './App.css';
import MainPage from "./main_page.js"
import ProductPage from "./product_page.js"
import Cart from "./cart.js"
import Orders from "./orders_page"
import { CartProvider } from './cartContext';

const router = createBrowserRouter([
{
  path: "/", element: <MainPage/>,
}, {
  path: "/products/:id", element: <ProductPage/>,
},{
  path: "/cart", element: <Cart/>,
},{
  path: "/orders", element: <Orders/>,
}]);


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </React.StrictMode>
);
