import React, { useState, useEffect } from "react";
import { createOrder, getAddress, read } from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { API, RAZORPAY } from "../config";

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  });

  useEffect(() => {
    getAddress();
  }, []);

  const [address, setAddress] = useState("");

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>
        <button className='btn btn-success' onClick={paymentHandler}>
          Pay Now
        </button>
      </div>
    ) : (
      <Link to='/signin'>
        <button className='btn btn-primary'>Sign in to checkout</button>
      </Link>
    );
  };

  const showError = (error) => (
    <div
      className='alert alert-danger'
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div
      className='alert alert-info'
      style={{ display: success ? "" : "none" }}
    >
      Thanks! Your payment was successful!
    </div>
  );

  const paymentHandler = async (e) => {
    e.preventDefault();
    const paymentData = {
      amount: getTotal(products)
    };

    const data = await fetch(`${API}/razorpay/createorder/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    }).then((t) => t.json());

    const options = {
      key: RAZORPAY,
      currency: "INR",
      amount: getTotal(products) * 100,
      order_id: data.id,
      name: "Payment",
      handler: async (response) => {
        const result = await fetch(
          `${API}/razorpay/success/${response.razorpay_payment_id}/${response.razorpay_order_id}/${response.razorpay_signature}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
        const createOrderData = {
          products: products
        };

        createOrder(userId, token, createOrderData)
          .then((response) => {
            emptyCart(() => {
              setRun(!run);
              console.log("payment success and empty cart");
              setData({
                loading: false,
                success: true
              });
            });
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const showLoading = (loading) =>
    loading && <h2 className='text-danger'>Loading...</h2>;

  var add = "";

  const getAddress = () => {
    return fetch(`${API}/user/getaddress`, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((out) => {
        for (let index = 0; index < out.length; index++) {
          if (out[index].user == userId) {
            add =
              "NAME: " +
              out[index].name +
              ", ADDRESS: " +
              out[index].address +
              ", FLAT_NO: " +
              out[index].flatno +
              ", PINCODE: " +
              out[index].pincode +
              ", PHONENUM: " +
              out[index].phonenumber;
          }
          console.log(add);
          setAddress(add);
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <div>
      <h2>Total: ₹ {getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {getTotal(products) > 0 && address != "" ? showCheckout() : ""}
      <h6>{JSON.stringify(address)}</h6>
      {address == "" ? (
        <Link className='nav-link' to='/user/address'>
          Click here to add address
        </Link>
      ) : (
        <Link className='nav-link' to='/user/address'>
          Click here to Change address
        </Link>
      )}
    </div>
  );
};

export default Checkout;
