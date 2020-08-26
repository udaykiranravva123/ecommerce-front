import Layout from "./Layout";
import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { API } from "../config";

function Address() {
  const [values, setValues] = useState({
    name: "",
    address: "",
    flatno: "",
    pincode: "",
    phonenumber: "",
    error: false,
    loading: false,
    success: false
  });

  const {
    name,
    address,
    flatno,
    pincode,
    phonenumber,
    loading,
    success,
    error
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const { user, token } = isAuthenticated();

  // const getAddress = () => {
  //   return fetch(`${API}/user/getaddress/${user._id}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const init = () => {
  //   getAddress().then((data) => {
  //     if (data.error) {
  //       setValues({ ...values, error: data.error });
  //     } else {
  //       // populate the state
  //       setValues({
  //         ...values,
  //         name: data.name,
  //         address: data.address
  //       });
  //     }
  //   });
  // };

  // useEffect(() => {
  //   init();
  // }, []);

  const addaddress = (fullAddress) => {
    const userId = user._id;
    return fetch(`${API}/user/address/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(fullAddress)
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    addaddress({
      name,
      address,
      flatno,
      pincode,
      phonenumber,
      user: user._id
    }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          name: "",
          address: "",
          flatno: "",
          pincode: "",
          phonenumber: "",
          error: "",
          success: true
        });
      }
    });
  };

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading...</h2>
      </div>
    );

  const addressForm = () => (
    <div className='col'>
      <form onSubmit={clickSubmit}>
        <div className='form-group'>
          <label className='text-muted'>Name</label>
          <input
            onChange={handleChange("name")}
            type='text'
            className='form-control'
            value={name}
            required
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Address</label>
          <input
            onChange={handleChange("address")}
            type='text'
            className='form-control'
            value={address}
            required
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Flat-No</label>
          <input
            onChange={handleChange("flatno")}
            type='text'
            className='form-control'
            value={flatno}
            required
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Pincode</label>
          <input
            onChange={handleChange("pincode")}
            type='text'
            className='form-control'
            value={pincode}
            required
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Phone Number</label>
          <input
            onChange={handleChange("phonenumber")}
            type='text'
            className='form-control'
            value={phonenumber}
            required
          />
        </div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );

  return (
    <Layout title='Add Address' description={`G'day ${user.name}`}>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {/* {showSuccess()} */}
          {showError()}
          {addressForm()}
        </div>
      </div>
    </Layout>
  );
}

export default Address;
