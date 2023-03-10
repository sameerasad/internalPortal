import React, { Component, useState } from "react";
import { NavLink } from "react-router-dom";
// import { GoogleLogin } from "react-google-login";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./style.css";

import {
  CheckIcon,
  UserIcon,
  LockClosedIcon,
  signUpWithGoogle,
} from "@heroicons/react/outline";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import { observable, makeObservable } from "mobx";

import { observer, inject } from "mobx-react";
import { images } from "../config/Images/index";
import LogoAuthentication from "../Components/logos/LogoAuthentication";
import { token } from "morgan";
import { components } from "react-select";
import EntryN from "../Components/EntryN";
@inject("store")
@observer
class Login extends Component {
  @observable email = "";
  @observable password = "";
  @observable fname = "";
  @observable lname = "";
  @observable errorMessage = "";

  constructor() {
    super();
    makeObservable(this);
  }

  onChange = (val) => {
    this.currentPromptOption = val;
    console.log(this.currentPromptOption);
  };

  onChangeAny = (val, attr) => {
    this[attr] = val;
    this.errorMessage = "";
  };

  onLogin = async (e) => {
    try {
      e.preventDefault();
      let data = await this.props.store.api
        .post("/auth/signin", {
          email: this.email,
          password: this.password,
        })
        .then(({ data }) => data);
      this.props.store.loginWithDataTokenAndProfile(data.token, data.profile);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.message);
      if (err?.response?.data?.message) {
        this.errorMessage = err?.response?.data?.message;
      }
    }
  };

  tokenAndProfileSetter = async (e) => {
    console.log(e, "oooo");
    this.props.store.loginWithDataTokenAndProfile(e.accessToken, {
      accountType: "admin",
      cancel_at_period_end: false,
      // created: "2023-01-01T23:15:39.482Z",
      credits: 9933,
      creditsUsed: 67,
      current_period_end: "2023-01-08T23:15:38.589Z",
      customerId: e.googleId,
      email: e.profileObj.email,
      fname: e.profileObj.name,
      lname: "",
      permissions: ["user"],
      plan: "Ultimate",
      referralId: "367750d9-6261-48cb-87d4-b80dd9737522",
      referrerPaid: false,
      status: "active",
      trial_end: "2023-01-08T23:15:38.589Z",
      __v: 0,
      _id: "63b2141b577ec315a64975e4",
    });

    this.props.store.api.post("/auth/socialLogin", {
      email: e.profileObj.email,
      fname: e.profileObj.name,
      lname: e.profileObj.familyName,
      // customerId: e.profileObj.googleId,
    });
  };
  // get detail of users from their access token
  getUser = async (user) => {
    if (user.credential != null) {
      const USER_CREDENTIAL = jwtDecode(user.credential);
      this.props.store.loginWithDataTokenAndProfile(
        USER_CREDENTIAL.accessToken,
        {
          accountType: "admin",
          cancel_at_period_end: false,
          // created: "2023-01-01T23:15:39.482Z",
          credits: 9933,
          creditsUsed: 67,
          current_period_end: "2023-01-08T23:15:38.589Z",
          customerId: USER_CREDENTIAL.jti,
          email: USER_CREDENTIAL.email,
          fname: USER_CREDENTIAL.name,
          lname: "",
          permissions: ["user"],
          plan: "Ultimate",
          referralId: "367750d9-6261-48cb-87d4-b80dd9737522",
          referrerPaid: false,
          status: "active",
          trial_end: "2023-01-08T23:15:38.589Z",
          __v: 0,
          _id: "63b2141b577ec315a64975e4",
        }
      );
      localStorage.setItem("googleId", USER_CREDENTIAL.jti);

      console.log(USER_CREDENTIAL);
    }
    // if (user) {
    //   axios
    //     .get(
    //       `https://www.googleapis.com/oauth2/v1/userinfo?client_id=${user.clientId}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.access_token}`,
    //           Accept: "application/json",
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       // setProfile(res.data);
    //       // tokenAndProfileSetter(res);
    //       console.log(res, "ppppppp");
    //     })
    //     .catch((err) => console.log(err));
    // }
  };

  // componentDidMount() {
  //   // Runs after the first render() lifecycle

  //   const initClient = () => {
  //     gapi.auth2.init({
  //       clientId:
  //         "4856694592-h06iepuhl4ils4morf1td8et0tboeude.apps.googleusercontent.com",
  //       scope: "",
  //     });
  //   };
  //   gapi.load("client:auth2", initClient);
  // }
  onSignup = async (e) => {
    try {
      e.preventDefault();
      this.errorMessage = "";
      console.log("signup");
      let data = await this.props.store.api
        .post("/auth/signup", {
          email: this.email,
          password: this.password,
          fname: this.fname,
          lname: this.lname,
          referral: this.props.store.referral,
        })
        .then(({ data }) => data);
      console.log(`onSignup`, data);
      if (data.token && data.profile) {
        this.props.store.loginWithDataTokenAndProfile(data);
      }
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.message);
      if (err?.response?.data?.message) {
        this.errorMessage = err?.response?.data?.message;
      }
    }
  };
  isloggedIn = () => {
    return this.store.isLogIn();
  };
  // this.props.store.loginWithDataTokenAndProfile(
  //   e.accessToken,
  //   profile
  // );
  // Currently Selected Input Option

  render() {
    return (
      <>
        {/* <Helmet>
          <title>{`Login - OpenAI Template`}</title>
        </Helmet> */}
        <div
          className="lg:px-4 py-4 min-h-screen flex flex-col md:items-center md:justify-center"
          style={{
            backgroundColor: "#673AB7",
          }}
        >
          {/* <div className="text-center mb-6">
					<Logo />
					<div className="text-3xl md:text-5xl relative font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-600 mb-4">OpenAI<span className="font-normal "> Template</span>
						<div className="absolute top-0 ml-3 left-full bg-gradient-to-r from-gray-500 to-gray-500 text-white text-sm px-2 py-0.5 hidden md:inline-block rounded-md font-normal ">gpt3</div>
					</div>
				</div> */}
          <div
            className={`min-w-full md:min-w-0 bg-white rounded-xl shadow-xl transform transition-all  transition shadow-md hover:shadow-2xl focus:shadow-2xl w-1/2`}
          >
            <div className="align-bottom flex bg-primary transform transition-all sm:align-middle transition flex divide-x divide-gray-300">
              <NavLink
                to="/login"
                className={`flex-1 justify-center transition py-4 px-4 pr-8 rounded-t-md flex text-${
                  this.props.location.pathname === "/login"
                    ? "gray-800"
                    : "gray-600"
                } font-medium  bg-${
                  this.props.location.pathname === "/login"
                    ? "white"
                    : "gray-300"
                } hover:bg-${
                  this.props.location.pathname === "/login"
                    ? "white"
                    : "gray-100"
                } cursor-pointer`}
                style={{
                  backgroundColor:
                    this.props.location.pathname === "/login"
                      ? "white"
                      : "#A7ADF2",
                  color:
                    this.props.location.pathname === "/login"
                      ? "black"
                      : "white",
                }}
              >
                {/* <div className={`transition mr-4  flex-shrink-0 inline-flex items-center justify-center text-sm h-6 w-6 rounded-full bg-${this.props.location.pathname === "/login" ? "green-300" : "gray-200"} text-${this.props.location.pathname === "/login" ? "green" : "gray"}`}>
							  <CheckIcon className={`transition h-4 w-4 text-${this.props.location.pathname === "/login" ? "green-600" : "gray-400"}`} aria-hidden="true" />
						  </div> */}
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={`flex-1 justify-center transition py-4 px-4 pr-8 rounded-t-md flex text-${
                  this.props.location.pathname === "/signup"
                    ? "gray-800"
                    : "gray-600"
                } font-medium  bg-${
                  this.props.location.pathname === "/signup"
                    ? "white"
                    : "gray-300"
                } hover:bg-${
                  this.props.location.pathname === "/signup"
                    ? "white"
                    : "gray-100"
                } cursor-pointer`}
                style={{
                  backgroundColor:
                    this.props.location.pathname === "/signup"
                      ? "white"
                      : "#A7ADF2",
                  color:
                    this.props.location.pathname === "/signup"
                      ? "black"
                      : "white",
                }}
              >
                {/* <div className={`transition mr-4  flex-shrink-0 inline-flex items-center justify-center text-sm h-6 w-6 rounded-full bg-${this.props.location.pathname === "/signup" ? "green-300" : "gray-200"} text-${this.props.location.pathname === "/signup" ? "green" : "gray"}`}>
							  <CheckIcon className={`transition h-4 w-4 text-${this.props.location.pathname === "/signup" ? "green-600" : "gray-400"}`} aria-hidden="true" />
						  </div> */}
                Signup
              </NavLink>
            </div>
            <div className="px-4 py-4 md:px-12 md:py-12">
              {/* Sorru */}
              <Switch>
                <Route path="/login">
                  <Logon
                    landingPageUrl={this.props.store.landingPageUrl}
                    email={this.email}
                    password={this.password}
                    signUp={this.signUpWithGoogle}
                    onChange={this.onChangeAny}
                    onLogin={this.onLogin}
                    isloggedIn={this.isloggedIn}
                    tokenAndProfileSetter={this.getUser}
                  />
                </Route>
                <Route path="/signup">
                  <Signup
                    email={this.email}
                    password={this.password}
                    fname={this.fname}
                    lname={this.lname}
                    onChange={this.onChangeAny}
                    onSignup={this.onSignup}
                    tokenAndProfileSetter={this.getUser}
                  />
                </Route>
                <Route>
                  <Redirect to="/login" />
                </Route>
              </Switch>
              {this.errorMessage ? (
                <div className="text-red-600 bg-red-50 rounded-md p-1 text-center mt-4">
                  {this.errorMessage}
                </div>
              ) : null}
            </div>
            <a
              href={`https://www.open.ai/`}
              className="block text-center bg-gray-100 text-gray-500 text-sm p-3 rounded-b-lg hover:bg-gray-200 cursor-pointer"
            >
              Back to landing page
            </a>
          </div>
        </div>
      </>
    );
  }
}

const Logon = observer(
  ({
    active,
    email,
    password,
    onChange,
    onLogin,
    landingPageUrl,
    signUp,
    isloggedIn,
    tokenAndProfileSetter,
  }) => {
    console.log(isloggedIn, tokenAndProfileSetter, "sss");
    return (
      <>
        <form onSubmit={onLogin}>
          {/* <div
          className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${
            email && password ? "green" : "gray"
          }-300  ${email && password ? "bg-green-300" : "bg-gray-300"} `}
        > */}
          <div
            className={`mx-auto flex-shrink-0 flex items-center justify-center h-16  w-1/4  `}
          >
            <LogoAuthentication />
          </div>

          {/* <LockClosedIcon
            className={`h-8 w-8 ${
              active ? "text-green-700" : "text-gray-500"
            } text-${email && password ? "green-700" : "gray-500"}`}
            aria-hidden="true"
          /> */}
          {/* </div> */}

          <div className="mt-3 text-center ">
            <div className="text-3xl font-medium text-gray-900">Log in</div>
            <p className="text-lg text-gray-500">Login to your account</p>
            <div className="flex flex-col flex-1">
              <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => onChange(e.target.value, "email")}
                focus="true"
                type="email"
                className="rounded-md text-lg px-4 py-2  border border-gray-300 "
                placeholder="john@smith.com"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => onChange(e.target.value, "password")}
                type="password"
                className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block"
                placeholder="*******"
              />
            </div>
            <div className="flex flex-col">
              <button
                type="submit"
                className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500  text-white mt-4 border border-gray-300 inline-block"
                style={{
                  backgroundColor: "#A7ADF2",
                }}
              >
                Log in
              </button>
              {/* <div onClick={signUp} className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
						signUp Google
						</div>
						 */}

              <div className="mt-4">
                <div style={{ width: "40px", height: "2px", color: "black" }} />
                <p className="otherOption">Or Login in With</p>
              </div>
              <div
                style={{
                  alignItem: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <GoogleLogin
                  className="justify-center mt-4"
                  // clientId="4856694592-h06iepuhl4ils4morf1td8et0tboeude.apps.googleusercontent.com"
                  buttonText="Sign in with Google"
                  auto_select={false}
                  onSuccess={(e) => {
                    console.log(e, "e");
                    // localStorage.setItem("token", e.accessToken);
                    // localStorage.setItem("googleId", e.googleId);
                    tokenAndProfileSetter(e);
                  }}
                  // onFailure={() => console.log("failure")}
                  // cookiePolicy={"single_host_origin"}
                  // isSignedIn={true}
                />
              </div>

              {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              /> */}
            </div>
          </div>
        </form>
      </>
    );
  }
);

const Signup = observer(
  ({
    active,
    email,
    password,
    fname,
    lname,
    onChange,
    onSignup,
    tokenAndProfileSetter,
  }) => {
    return (
      <>
        {/* onSignup */}
        <form onSubmit={onSignup}>
          {/* <div
          className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${
            email && password ? "green" : "gray"
          }-300  ${email && password ? "bg-green-300" : "bg-gray-300"} `}
        >
          <UserIcon
            className={`h-8 w-8 ${
              active ? "text-green-700" : "text-gray-500"
            } text-${email && password ? "green-700" : "gray-500"}`}
            aria-hidden="true"
          />
        </div> */}
          <div
            className={`mx-auto flex-shrink-0 flex items-center justify-center h-16  w-1/4 `}
          >
            <img
              class="bi x0 y0 w1 h6"
              alt=""
              src="data:image/png;base64,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"
            ></img>
          </div>
          <div className="mt-3 text-center ">
            <div className="text-3xl font-medium text-gray-900">Sign Up</div>
            <p className="text-lg text-gray-500">Create your account</p>
            <div className="md:flex">
              <div className="flex flex-col min-w-0 md:pr-2 flex-1">
                <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                  First Name
                </label>
                <input
                  value={fname}
                  onChange={(e) => onChange(e.target.value, "fname")}
                  type="text"
                  className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto"
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col min-w-0 md:pl-2 flex-1">
                <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                  Last Name
                </label>
                <input
                  value={lname}
                  onChange={(e) => onChange(e.target.value, "lname")}
                  type="text"
                  className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto"
                  placeholder="Smith"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => onChange(e.target.value, "email")}
                focus="true"
                type="email"
                className="rounded-md text-lg px-4 py-2  border border-gray-300 "
                placeholder="john@smith.com"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm block mt-4 inline-block text-left">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => onChange(e.target.value, "password")}
                type="password"
                className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block"
                placeholder="*******"
              />
            </div>

            <div className="flex flex-col">
              <button
                type="submit"
                className="hover:bg-blue-400 bg-green-500 font-medium rounded-lg text-lg px-4 py-2 bg-gray-200 text-white mt-4 border border-gray-300 inline-block"
                style={{ backgroundColor: "#A7ADF2" }}
              >
                Sign Up
              </button>
              <div className="mt-4">
                <div style={{ width: "40px", height: "2px", color: "black" }} />
                <p className="otherOption">Or SignUp in With</p>
              </div>

              <div
                style={{
                  alignItem: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <GoogleLogin
                  // className="justify-center mt-4"
                  // clientId="4856694592-sf5edlejscubputd35vdmc0fpton1lqh.apps.googleusercontent.com"
                  buttonText="Sign Up with Google"
                  onSuccess={(e) => {
                    console.log(e, "e");
                    // localStorage.setItem("token", e.accessToken);
                    // localStorage.setItem("googleId", e.googleId);
                    tokenAndProfileSetter(e);
                  }}
                  onError={(e) => console.log(e, "error")}
                  // onFailure={() => console.log("failure")}
                  // cookiePolicy={"single_host_origin"}
                  // isSignedIn={true}
                />
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
);

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="w-20 h-20 inline-block"
    viewBox="0 0 1512 1532"
  >
    <path
      fill="#000"
      d="M1412.22 627.024a381.628 381.628 0 0017.47-160.247 381.625 381.625 0 00-50.27-153.158 385.877 385.877 0 00-177.63-160.359 385.89 385.89 0 00-238.016-24.803A381.525 381.525 0 00833.74 33.209 381.565 381.565 0 00675.978.154a385.936 385.936 0 00-368.15 267.204A381.68 381.68 0 0052.672 452.459 385.97 385.97 0 002.636 686.458a385.954 385.954 0 0097.504 218.517 381.566 381.566 0 0032.793 313.405 385.943 385.943 0 00415.649 185.16 381.574 381.574 0 00287.797 128.31 385.89 385.89 0 00227.731-73.63 385.855 385.855 0 00140.54-193.73 381.572 381.572 0 00147.58-64.98c44-31.92 80.68-72.88 107.58-120.12a386.032 386.032 0 0049.92-233.94 385.967 385.967 0 00-97.51-218.426zM836.501 1431.71a286.188 286.188 0 01-183.744-66.43c2.325-1.26 6.403-3.5 9.061-5.13l304.978-176.16a49.595 49.595 0 0025.062-43.39V710.636l128.912 74.434c.67.337 1.25.834 1.69 1.451.44.616.72 1.333.81 2.079v356.07a287.37 287.37 0 01-84.08 202.77 287.387 287.387 0 01-202.689 84.27zm-616.724-263.39a286.085 286.085 0 01-34.242-192.354c2.264 1.36 6.22 3.776 9.059 5.407l304.977 176.157a49.582 49.582 0 0025.051 6.79c8.8 0 17.447-2.34 25.048-6.79l372.346-214.989v148.869c.042.76-.103 1.52-.425 2.21a4.548 4.548 0 01-1.417 1.74l-308.302 178.01a287.314 287.314 0 01-217.77 28.55 287.33 287.33 0 01-174.325-133.6zm-80.231-665.797a285.999 285.999 0 01149.41-125.856c0 2.627-.151 7.279-.151 10.507v352.327a49.55 49.55 0 0025.033 43.363l372.345 214.967-128.904 74.429c-.636.42-1.368.67-2.126.74a4.702 4.702 0 01-2.225-.34l-308.33-178.161a287.348 287.348 0 01-105.052-391.976zm1059.094 246.46L826.292 533.988l128.909-74.402a4.596 4.596 0 014.346-.391l308.333 178.004a287.1 287.1 0 01142.45 273.103 287.09 287.09 0 01-57.78 149.628 287.044 287.044 0 01-129.03 95.28V792.345a49.468 49.468 0 00-6.57-25.051 49.515 49.515 0 00-18.31-18.311zm128.3-193.103c-2.26-1.39-6.22-3.775-9.05-5.403L1012.9 374.312a49.683 49.683 0 00-50.09 0L590.463 589.31V440.443a4.613 4.613 0 011.842-3.955l308.302-177.857a287.08 287.08 0 01155.713-38.117 287.052 287.052 0 01151.87 51.322 287.09 287.09 0 01100.67 124.758 286.994 286.994 0 0118.08 159.286zM520.38 821.214l-128.939-74.433a4.572 4.572 0 01-2.505-3.535V387.174a287.084 287.084 0 0144.883-153.942 287.095 287.095 0 01120.453-105.853 287.069 287.069 0 01305.419 39.366c-2.324 1.268-6.372 3.503-9.06 5.134L545.653 348.042a49.548 49.548 0 00-25.063 43.36l-.21 429.812zm70.022-150.98l165.838-95.782 165.834 95.72v191.502L756.24 957.398l-165.838-95.724v-191.44z"
    ></path>
  </svg>
);

export default withRouter(Login);
