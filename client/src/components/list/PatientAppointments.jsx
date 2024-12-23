import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const {name} = useParams();

    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/patientAppointments/${name}`);
            setAppointments(response.data)
        }
        fetchData();
    }, [])

    const deleteAppointments = async(id, e) => {
        try{
            const response = await axios.delete(`http://localhost:3002/api/appointments/${id}`);
            toast.success(response.data.message, {position: "top-right"});
            setAppointments( appointments.filter( appointment => {
                return appointment.id != id;
            }))
        }
        catch(err){
            console.log(err);
            toast.error("Silme başarısız!", {position: "top-right"});
        }
    }


    return(
        <>
            <h1 className="display-4 text-center mb-3">Randevularım:</h1>

            <table class="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Hastane</th>
                        <th scope="col">Bölüm</th>
                        <th scope="col">Doktor Adı</th>
                        <th scope="col">Tarih</th>
                        <th scope="col">Saat</th>
                        <th>İptal Et</th>
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
                                    <td>{appointment.hastane_adı}</td>
                                    <td>{appointment.bolum}</td>
                                    <td>{appointment.name}</td>
                                    <td>{localeString}</td>
                                    <td>{appointment.saat}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => {deleteAppointments(appointment.id, e)} }>İptal</button>
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

export default PatientAppointments