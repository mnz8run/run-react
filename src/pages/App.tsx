import { BrowserRouter, NavLink, Routes, Route } from "react-router-dom";
import { useRef, useEffect, useLayoutEffect, useInsertionEffect } from "react";
import Users from "./Users";
import UserDetails from "./UserDetails";
import Admin from "./Admin";

export const App = () => {
  const dom = useRef(null);
  useEffect(() => {
    console.log(dom);
  }, []);
  // useLayoutEffect(() => {
  //   console.log("useLayoutEffect");
  // }, []);
  useInsertionEffect(() => {
    console.log("useInsertionEffect");
  }, []);
  return (
    <>
      <div ref={dom}>123</div>
    </>
  );
};
