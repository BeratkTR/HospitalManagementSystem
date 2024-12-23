import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get("http://localhost:3002/api/patients");
            setPatients(response.data);
        }
        fetchData();
    }, [])

    const deletePatient = async(id, e) => {
        try{
            const response = await axios.delete(`http://localhost:3002/api/patients/${id}`);
            toast.success(response.data.message, {position: "top-right"});
            setPatients( patients.filter( patient => {
                return patient.id != id;
            }))
        }
        catch(err){
            console.log(err);
            toast.error("Silme başarısız!", {position: "top-right"});
        }

    }

    return(
        <>
            <h1 className="display-4 text-center mb-3">Hastalar:</h1>

            <table class="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">İsim</th>
                        <th scope="col">Telefon</th>
                        <th scope="col">Cinsiyet</th>
                        <th scope="col">Doğum tarihi</th>
                        <th>Hastayı Sil</th>
                    </tr>
                </thead>
                <tbody className="table-dark">
                    {
                        patients.map( (patient, index) => {
                            const date = new Date(patient.birth_date);
                            const localeString = date.toLocaleDateString();

                            return(
                                <tr key={patient.id}>
                                    <th>{index+1}</th>
                                    <td>{patient.name}</td>
                                    <td>{patient.phone_number}</td>
                                    <td>{patient.gender}</td>
                                    <td>{localeString}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => {deletePatient(patient.id, e)}}>Sil</button>
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

export default PatientList