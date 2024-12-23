import React, { useEffect, useState } from "react";
import axios from "axios"

const AdminOverview = () => {
    const [doctorNum, setDoctorNum] = useState(0);
    const [patientNum, setPatientNum] = useState(0);
    const [appointmentNum, setAppointmentNum] = useState(0);
    useEffect( () => {
        const fetchData = async() => {
            try{
                const response = await axios.get("http://localhost:3002/api/doctors");
                setDoctorNum(response.data.length);
                const response2 = await axios.get("http://localhost:3002/api/patients")
                setPatientNum(response2.data.length);
                const response3 = await axios.get("http://localhost:3002/api/appointments")
                setAppointmentNum(response3.data.length);
            }
            catch(err){
                console.log(err);
            }
        }   
        fetchData();
    }, [])

    return(
        <>  
            <h1 className="display-4 text-center mb-3">Genel Bakış:</h1>
            <div style={styles.container}>
                <div style={{...styles.box, backgroundColor: "red"}}>
                    <h3>Doktor Sayısı: {doctorNum}</h3>
                    <i class="fa-solid fa-user-doctor fa-4x"></i>
                </div>
                <div style={{...styles.box, backgroundColor: "green"}}>
                    <h3>Randevu Sayısı: {appointmentNum}</h3>
                    <i class="fa-regular fa-calendar fa-4x"></i>
                </div>
                <div style={{...styles.box, backgroundColor: "blue"}}>
                    <h3>Kayıtlı Hasta: {patientNum}</h3>
                    <i class="fa-solid fa-bed-pulse fa-4x"></i>
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
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      width: '300px', // You can adjust this width as needed
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color: "white"
    },
  };

export default AdminOverview