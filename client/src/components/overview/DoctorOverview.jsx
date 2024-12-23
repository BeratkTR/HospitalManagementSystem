import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DoctorOverview = () => {
    const {name} = useParams()
    const [totalAppointments, setTotalAppointments] = useState();

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/doctorAppointments/${name}`);
            setTotalAppointments(response.data.length)
        }
        fetchData();
    })

    return (
        <>
            <h1 className="display-4 text-center mb-3">Genel Bakış:</h1>
            <div style={styles.container}>
                <div style={{...styles.box, backgroundColor: "green"}}>
                    <h3>Toplam Randevu: {totalAppointments}</h3>
                    <i class="fa-regular fa-calendar fa-4x"></i>
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
      width: '400px', // You can adjust this width as needed
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color: "white"
    },
  };

export default DoctorOverview