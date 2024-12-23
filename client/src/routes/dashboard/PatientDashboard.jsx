import React, {useState} from "react";
import { useParams } from "react-router-dom";
import PatientOverview from "../../components/overview/PatientOverview";
import PatientAppointments from "../../components/list/PatientAppointments";
import NewAppointment from "../../components/list/NewAppointment";
import PatientBills from "../../components/list/PatientBills";
import PatientTreatments from "../../components/list/PatientTreatments";

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { name } = useParams();
    
    return (
        <>
            <div id="wrapper" style={styles.wrapper}>
                {/* Sidebar */}
                <div id="sidebar-wrapper" style={styles.sidebarWrapper}>
                    <ul className="sidebar-nav" style={styles.sidebarNav}>
                        <li className="sidebar-brand" style={styles.sidebarBrand}>
                            <a style={styles.sidebarBrandLink}>
                                Hasta Paneli
                            </a>
                            <p style={styles.user}>Kullanıcı: {name}</p>
                        </li>
                        <li style={styles.sidebarNavItem}>
                            <a href="#" style={styles.sidebarNavLink} onClick={() => {setActiveTab("overview")}}>
                                Genel Bakış
                            </a>
                        </li>
                        <li style={styles.sidebarNavItem}>
                            <a href="#" style={styles.sidebarNavLink} onClick={() => {setActiveTab("appointments")}}>
                                Randevularım
                            </a>
                        </li>
                        <li style={styles.sidebarNavItem}>
                            <a href="#" style={styles.sidebarNavLink} onClick={() => {setActiveTab("newAppointment")}}>
                                Yeni Randevu
                            </a>
                        </li>
                        <li style={styles.sidebarNavItem}>
                            <a href="#" style={styles.sidebarNavLink} onClick={() => {setActiveTab("treatments")}}>
                                Tedavi Raporlarım
                            </a>
                        </li>
                        <li style={styles.sidebarNavItem}>
                            <a href="#" style={styles.sidebarNavLink} onClick={() => {setActiveTab("bills")}}>
                                Faturalarım
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Page Content */}
                <div id="page-content-wrapper" style={styles.pageContentWrapper}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                {activeTab === 'overview' && <PatientOverview/>}
                                {activeTab === 'appointments' && <PatientAppointments/>}
                                {activeTab === 'newAppointment' && <NewAppointment/>}
                                {activeTab === 'treatments' && <PatientTreatments/>}
                                {activeTab === 'bills' && <PatientBills/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
// Styles for the Sidebar Layout
const styles = {
    // Wrapper styles
    wrapper: {
        display: 'flex',
        flexDirection: 'row', // Sidebar on the left and content on the right
        height: '100vh', // Full screen height
    },

    // Sidebar styles
    sidebarWrapper: {
        position: 'fixed', // Fixed on the left side of the screen
        top: '50px',
        left: '0',
        width: '250px',
        height: 'calc(100vh - 50px)',
        backgroundColor: '#333',
        paddingTop: '20px',
        paddingRight: '10px',
        transition: 'all 0.3s ease',
        zIndex: 1000,
    },

    // Sidebar Navigation
    sidebarNav: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
    },

    sidebarNavItem: {
        padding: '10px 20px',
        borderBottom: '1px solid #444',
    },

    sidebarNavLink: {
        display: 'block',
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '18px',
        transition: 'color 0.3s',
    },

    sidebarNavLinkHover: {
        color: '#fff',
    },

    sidebarBrand: {
        fontSize: '22px',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px 20px',
        marginBottom: '5px',
    },

    sidebarBrandLink: {
        color: '#fff',
        textDecoration: 'none',
    },

    // Page content styles
    pageContentWrapper: {
        marginLeft: '250px', // To make space for the sidebar
        padding: '20px',
        flex: 1, // Content takes up remaining space
        backgroundColor: '#f0f0f0',
        height: '100vh',
        overflowY: 'auto',
    },

    user: {
        color: "#cccccc",
        textDecoration: "underline"
    }
};


export default PatientDashboard