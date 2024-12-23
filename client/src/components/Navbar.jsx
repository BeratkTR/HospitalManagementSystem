import React from "react";

const Navbar = () => {


    return(
        <>
            <nav class="navbar bg-body-tertiary" style={styles.nav}>
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <i class="fa-solid fa-hospital d-inline-block align-text-top me-1" width="30" height="24"></i>
                        Medikol Hastanesi
                    </a>
                </div>
            </nav>
        </>
    )
}

const styles = {
    nav: {
        zIndex: 1001,
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
    }
}

export default Navbar