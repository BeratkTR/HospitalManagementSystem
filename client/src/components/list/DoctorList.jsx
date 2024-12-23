import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get("http://localhost:3002/api/doctors");
            setDoctors(response.data);
        }
        fetchData();
    }, [])

    const deleteDoctor = async(id, e) => {
        try{
            const response = await axios.delete(`http://localhost:3002/api/doctors/${id}`);
            toast.success(response.data.message, {position: "top-right"});
            setDoctors( doctors.filter( doctor => {
                return doctor.id != id;
            }))
        }
        catch(err){
            console.log(err);
            toast.error("Silme başarısız!", {position: "top-right"});
        }
    }



    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = doctors.slice(startIndex, endIndex);

    const nextPage = () => {
        if ((currentPage + 1) * itemsPerPage < doctors.length) {
        setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        }
    };




    return(
        
        <>
            <h1 className="display-4 text-center mb-3">Doktorlar:</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link to={"/doctors/add"} className="btn btn-primary" style={{padding: "15px 60px"}}>Yeni Doktor Ekle</Link>

                <div className="text-end">
                    <button onClick={prevPage} disabled={currentPage === 0} className="btn btn-primary" style={{padding: "12px 15px"}}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={(currentPage + 1) * itemsPerPage >= doctors.length}
                        className="btn btn-primary"
                        style={{padding: "12px 15px"}}
                    >
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>


            <table class="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">İsim</th>
                        <th scope="col">Numara</th>
                        <th scope="col">Cinsiyet</th>
                        <th scope="col">Bölüm</th>
                        <th scope="col">Hastane</th>
                        <th scope="col">Şehir</th>
                        <th>Doktoru Güncelle</th>
                        <th>Doktoru Sil</th>
                    </tr>
                </thead>
                <tbody className="table-dark">
                    {
                        currentItems.map( (doctor, index) => {
                            return(
                                <tr key={doctor.id}>
                                    <th>{index+1}</th>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.phone_number}</td>
                                    <td>{doctor.gender}</td>
                                    <td>{doctor.departman_adi}</td>
                                    <td>{doctor.hastane_adi}</td>
                                    <td>{doctor.city_name}</td>
                                    <td>
                                        <Link to={`/doctors/${doctor.id}/update`} className="btn btn-warning block-btn">Güncelle</Link>
                                    </td> 
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => {deleteDoctor(doctor.id, e)}}>Sil</button>
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

export default DoctorList