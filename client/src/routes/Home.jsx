import React, { useEffect } from "react";
import Login from "../components/login/Login";

const Home = () => {

    useEffect( ()=> {
        localStorage.clear();
    }, [])

    return(
        <>
            <Login/>
        </>
    )
}

export default Home;