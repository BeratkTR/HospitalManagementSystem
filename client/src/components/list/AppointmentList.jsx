import React, {useState, useEffect} from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get("http://localhost:3002/api/appointments");
            setAppointments(response.data);
        }
        fetchData();
    }, [])

    const deleteAppointments = async(id, e) => {
        e.preventDefault();
        try{
            const response = await axios.delete(`http://localhost:3002/api/appointments/${id}`);
            toast.success(response.data.message, {position: "top-right"});
            setAppointments( appointments.filter( appointment => {
                return appointment.appointment_id != id;
            }))
        }
        catch(err){
            console.log(err);
            toast.error("Silme başarısız!", {position: "top-right"});
        }
    }

    return(
        <>
            <h1 className="display-4 text-center mb-3">Randevular:</h1>

            <table class="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Hasta Adı</th>
                        <th scope="col">Doktor Adı</th>
                        <th scope="col">Tarih</th>
                        <th scope="col">Saat</th>
                        <th scope="col">Bölüm</th>
                        <th scope="col">Hastane</th>
                        <th>Randevu Sil</th>
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
                                    <td>{appointment.doctor_name}</td>
                                    <td>{localeString}</td>
                                    <td>{appointment.saat}</td>
                                    <td>{appointment.bolum_adi}</td>    
                                    <td>{appointment.hastane_adi}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => {deleteAppointments(appointment.appointment_id, e)}}>Sil</button>
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

export default AppointmentList