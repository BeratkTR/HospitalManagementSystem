import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const {name} = useParams();

    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/doctorAppointments/${name}`);
            setAppointments(response.data)
        }
        fetchData();
    }, [])

    return(
        <>
            <h1 className="display-4 text-center mb-3">Randevular:</h1>

            <table class="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Hasta Adı</th>
                        <th scope="col">Cinsiyet</th>
                        <th scope="col">Tarih</th>
                        <th scope="col">Saat</th>
                        <th>Tedavi Başlat</th>
                    </tr>
                </thead>
                <tbody className="table-dark">
                    {
                        appointments.map( (appointment, index) => {
                            const date = new Date(appointment.tarih);
                            const localeString = date.toLocaleDateString();

                            return(
                                <tr key={appointment.id}>
                                    <th>{index+1}</th>
                                    <td>{appointment.patient_name}</td>
                                    <td>{appointment.cinsiyet}</td>
                                    <td>{localeString}</td>
                                    <td>{appointment.saat}</td>
                                    <td>
                                        <button className="btn btn-success">İşleme Başla    </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}
export default DoctorAppointments