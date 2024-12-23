import React, { useContext } from "react";

const PatientOverview = () => {

    return(
        <>
            <h1 className="display-4 text-center mb-3">Genel Bakış:</h1>
            <div style={styles.container}>
                <div style={{...styles.box, backgroundColor: "blue"}}>
                    <h3>Aktif Randevular: ?{}</h3>
                    <i class="fa-regular fa-calendar fa-4x"></i>
                </div>
                <div style={{...styles.box, backgroundColor: "red"}}>
                    <h3>Ödenmemiş Faturalar: ?{}</h3>
                    <i class="fa-solid fa-receipt fa-4x"></i>
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px', // Gap between the boxes
    },
    box: {
      border: '1px solid #ccc',
      padding: '25px',
      borderRadius: '8px',
      textAlign: 'center',
      width: '360px', // You can adjust this width as needed
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color: "white"
    },
  };

export default PatientOverview