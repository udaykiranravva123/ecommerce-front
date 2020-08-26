import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./core/Home";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Orders from "./admin/Orders";
import Profile from "./user/Profile";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import UpdateCategory from "./admin/updateCategory";
import ForgotPassword from "./user/ForgetPassword";
import ResetPassword from "./user/ResetPassword";
import Address from "./core/Address";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/shop' exact component={Shop} />
        <Route path='/signin' exact component={Signin} />
        <Route path='/signup' exact component={Signup} />
        <PrivateRoute path='/user/dashboard' exact component={Dashboard} />
        <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
        <AdminRoute path='/create/category' exact component={AddCategory} />
        <AdminRoute path='/create/product' exact component={AddProduct} />
        <Route path='/product/:productId' exact component={Product} />
        <Route path='/cart' exact component={Cart} />
        <AdminRoute path='/admin/orders' exact component={Orders} />
        <PrivateRoute path='/profile/:userId' exact component={Profile} />
        <PrivateRoute path='/admin/products' exact component={ManageProducts} />
        <PrivateRoute path='/user/address' exact component={Address} />
        <AdminRoute
          path='/admin/product/update/:productId'
          exact
          component={UpdateProduct}
        />
        <AdminRoute
          path='/admin/category/update/:categoryId'
          exact
          component={UpdateCategory}
        />
        <Route exact path='/forgot-password' component={ForgotPassword} />
        <Route
          exact
          path='/reset-password/:resetPasswordToken'
          component={ResetPassword}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
