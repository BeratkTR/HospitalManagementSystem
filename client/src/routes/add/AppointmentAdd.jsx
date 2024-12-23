import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AppointmentAdd = () => {
    const Navigate = useNavigate();
    const username = localStorage.getItem("userName");

    const hours = [10,11,12,13,14,15,16]
    const [fullHours, setFullHours] = useState([]);
    const {city, department, hospital, doctor, date} = useParams();

    const userID = parseInt(localStorage.getItem("userID"));
    const [doctor_id, setDoctor_id] = useState();

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/appointments/${doctor}/${date}`);
            setFullHours(response.data.map(appointment => appointment.saat));
            
            const response2 = await axios.get(`http://localhost:3002/api/doctorID/${doctor}`);
            setDoctor_id(response2.data[0].id);
        }
        fetchData();
    }, [])

    const handleNewAppointment = async(hour, e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3002/api/appointment", {
                patient_id: userID,
                doctor_id: doctor_id,
                tarih: date,
                saat: hour
            });
            toast.success(response.data.message, {position: "top-right"});
            setFullHours([...fullHours, hour]);
            Navigate(`/patientDashboard/${username}`);
        }
        catch(err){
            console.log(err);
            toast.error("Randevu oluşturma başarısız!", {position: "top-right"})
        }
        
    }


    return(
        <>
            <h1 className="display-4 text-center mb-3">Randevular:</h1>

            <table class="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Şehir</th>
                        <th scope="col">Bölüm</th>
                        <th scope="col">Hastane</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Tarih</th>
                        <th scope="col">Saat</th>
                        <th>Randevu Al</th>
                    </tr>
                </thead>
                <tbody className="table-dark">
                    {
                        hours.map( (hour, index) => {
                            return(
                                <tr key={index}>
                                    <th>{index+1}</th>
                                    <td>{city}</td>
                                    <td>{department}</td>
                                    <td>{hospital}</td>
                                    <td>{doctor}</td>
                                    <td>{date}</td>
                                    <td>{hour}</td>
                                    {
                                        fullHours.includes(hour) ?
                                        (
                                           <td>
                                            <button className="btn btn-danger">Dolu</button>
                                           </td>
                                        )
                                        :
                                        (
                                        <td>
                                            <button className="btn btn-success" onClick={(e) => {handleNewAppointment(hour, e)}}>Randevu Al</button>
                                        </td>
                                        )
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default AppointmentAdd