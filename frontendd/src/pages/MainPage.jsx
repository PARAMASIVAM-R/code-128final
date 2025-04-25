import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink, Element } from 'react-scroll';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import godownIMG from '../assets/godownIMG.png';
import quaeIMG from '../assets/quae.jpg';
import scanIMG from '../assets/scan.jpg';
import fifoIMG from '../assets/fifo.jpg';


function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [selectedrole, setSelectedrole] = useState("Admin");
  const navigate = useNavigate();

  const toggleModal = () => setShowModal(!showModal);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigateToDashboard = (role, name, district, pdslocation, godownName) => {
    switch (role) {
      case "Admin":
        navigate("/admin-dashboard", { state: { role, name, district } });
        break;
      case "Godown Incharge":
        navigate("/godown-dashboard", { state: { role, name, godownName, district } });
        break;
      case "PDS Incharge":
        navigate("/pds-dashboard", { state: { role, name, pdslocation, district } });
        break;
      default:
        alert("Unauthorized role detected!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginPayload = { role: selectedrole, id: formData.id, password: formData.password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Login failed!");
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify({
        role: data.role,
        name: data.name,
        district: data.district || "",
        pdslocation: data.pdslocation || "",
        godownName: data.godownName || "",
      }));

      if (data.role !== selectedrole) {
        alert(`Invalid login: You are registered as ${data.role}, not ${selectedrole}`);
        return;
      }

      toggleModal();
      navigateToDashboard(data.role, data.name, data.district, data.pdslocation, data.godownName);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed!");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.background}></div>

      <nav style={styles.navbar}>
        <div style={styles.logo}>FIFO SYSTEM</div>
        <div style={styles.links}>
          {['home', 'about', 'Technologies', 'Members'].map((section) => (
            <ScrollLink
              key={section}
              to={section}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              style={styles.link}
              activeClass="active"
            >
              {section.toUpperCase()}
            </ScrollLink>
          ))}
          <span
            onClick={toggleModal}
            style={{ ...styles.link, color: 'lightblue', fontWeight: 'bold' }}
          >
            LOGIN/SIGNUP
          </span>
        </div>
      </nav>

      {/* Content Sections */}
      <Element name="home" style={styles.section}>
        <div style={{ textAlign: 'center', backgroundColor:'#f8fcfb', padding:'10px' }}>
          <h2 style={styles.college}>
            Alagappa Chettiar Government College of Engineering & Technology, Karaikudi
          </h2>
          <p><strong></strong>TRANSPARENT STOCK MANAGEMENT IN PDS USING CODE-128 FIFO SCHEME</p>
        </div>

        <div style={styles.carouselWrapper}>
          <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false} showArrows interval={1000}>
            <div>
              <img src={scanIMG} style={styles.img} alt="Barcode Scanning" />
              <p className="legend">Barcode Verification at Godown</p>
            </div>
            <div>
              <img src={fifoIMG} style={styles.img} alt="Truck Monitoring" />
              <p className="legend">FIFO-based Stock Management</p>
            </div>
            <div>
              <img src={quaeIMG} style={styles.img} alt="FIFO Stock Management" />
              <p className="legend">Accurate Stock Management</p>
            </div>
          </Carousel>
        </div>
      </Element>

      {/* <Element name="about" style={styles.section}>
        <div>
          <h1 style={styles.header}>About the Project</h1>
          <p style={styles.textContent}>
            This project modernizes the Public Distribution System (PDS) using GS1-128 barcodes and role-based authentication.
            It's built using React.js (frontend), Node.js + Express.js (backend), and MongoDB.
            Barcodes ensure FIFO-based stock clearance, minimizing theft and improving transparency.
          </p>
        </div>
      </Element> */}
      <Element name="about" style={styles.sectionN}>
  <div>
    <h1 style={styles.headerR}>About the Project</h1>
    
    <p style={{ ...styles.textContent, ...styles.paragraph1 }}>
      This project revolutionizes the Public Distribution System (PDS) by integrating GS1-128 barcode technology, enabling efficient and automated inventory tracking. Built using a full-stack approach with React.js for the frontend, Node.js and Express.js for the backend, and MongoDB for database management, the system ensures secure role-based access for Admins, Godown Incharges, and PDS Incharges.
    </p>

    <p style={{ ...styles.textContent, ...styles.paragraph2 }}>
      Barcodes are used to encode essential product information, such as date, weight, and unique ID, allowing real-time stock tracking and ensuring FIFO (First-In-First-Out) based stock clearance. The use of barcode scanners at key points—dispatch and receipt—helps reduce manual errors, prevents tampering, and enhances transparency in the distribution of goods.
    </p>

    <p style={{ ...styles.textContent, ...styles.paragraph3 }}>
      This modernized approach not only improves the accuracy and security of the distribution process but also strengthens accountability, ensuring that ration goods are effectively monitored from godowns to PDS shops. Overall, the system guarantees a more reliable, transparent, and efficient way of managing the PDS process, minimizing the risk of theft and ensuring fair distribution.
    </p>
  </div>
</Element>



      {/* <Element name="Technologies" style={styles.section}>
        <div>
          <h1 style={styles.header}>Technologies Used</h1>
          <ul style={styles.list}>
            <li>⚙️ React.js for frontend</li>
            <li>🧠 Node.js backend</li>
            <li>🗃️ MongoDB database</li>
            <li>📡 Barcode Reader (GS1-128)</li>
            <li>🔐 Role-Based Authentication</li>
          </ul>
        </div>
      </Element> */}
      <Element name="Technologies" style={{
  padding: '80px 20px',
  backgroundColor: '#f4f4f9',
  textAlign: 'center',
  borderBottom: '2px solid #e0e0e0',
}}>
  <div style={{
    maxWidth: '900px',
    margin: '0 auto',
  }}>
    <h1 style={{
      fontSize: '2.5rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '20px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: "'Roboto', sans-serif",
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
      transition: 'color 0.3s ease-in-out',
    }}>
      Technologies Used
    </h1>
    <ul style={{
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      fontSize: '1.2rem',
      lineHeight: '1.8',
      fontFamily: "'Lato', sans-serif",
      color: '#555',
    }}>
      <li style={{
        marginBottom: '15px',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
      }}>
        <span style={{
          marginRight: '10px',
          fontSize: '1.5rem',
          color: '#00796b',
        }}>⚙️</span> React.js for frontend
      </li>
      <li style={{
        marginBottom: '15px',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
      }}>
        <span style={{
          marginRight: '10px',
          fontSize: '1.5rem',
          color: '#00796b',
        }}>🧠</span> Node.js backend
      </li>
      <li style={{
        marginBottom: '15px',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
      }}>
        <span style={{
          marginRight: '10px',
          fontSize: '1.5rem',
          color: '#00796b',
        }}>🗃️</span> MongoDB database
      </li>
      <li style={{
        marginBottom: '15px',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
      }}>
        <span style={{
          marginRight: '10px',
          fontSize: '1.5rem',
          color: '#00796b',
        }}>📡</span> Barcode Reader (GS1-128)
      </li>
      <li style={{
        marginBottom: '15px',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
      }}>
        <span style={{
          marginRight: '10px',
          fontSize: '1.5rem',
          color: '#00796b',
        }}>🔐</span> Role-Based Authentication
      </li>
    </ul>
  </div>
</Element>


<Element name="Members" style={styles.section}>
  <div style={{ textAlign: 'center', width: '100%' }}>
    <h1 style={styles.header}>Project Members</h1>
    <div style={styles.membersWrapper}>
      {[
        { name: 'PARAMASIVAM R', role: 'Fullstack Developer', emoji: '👨‍💻' },
        { name: 'SANTHOSH R', role: 'MongoDB Developer', emoji: '👨‍💻' },
        { name: 'VIKNESHRAJA M', role: 'Backend Developer', emoji: '👨‍💻' },
        { name: 'DHANUMOORTHY S', role: 'Backend Developer', emoji: '👨‍💻' },
        { name: 'Dr. A. SIVANANTHA RAJA, M.E., Ph.D.', role: 'Professor and HoD, ECE', emoji: '👨‍🏫' }
      ].map((member, index) => (
        <div key={index} style={styles.memberCard}
          onMouseEnter={e => e.currentTarget.querySelector('.inner').style.transform = 'rotateY(180deg)'}
          onMouseLeave={e => e.currentTarget.querySelector('.inner').style.transform = 'rotateY(0deg)'}>
          
          <div className="inner" style={styles.cardInner}>
            <div style={{ ...styles.cardFace, ...styles.cardFront }}>
              <div style={styles.profileCircle}>{member.emoji}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
            <div style={{ ...styles.cardFace, ...styles.cardBack }}>
              <h3>{member.name}</h3>
              <p>Role: <strong>{member.role}</strong></p>
              <p style={{ fontSize: '1.5rem' }}>🚀</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <p style={{
      marginTop: '2rem',
      color: '#fff',
      fontSize: '1.5rem',
      backgroundColor: '#0a192f',
      padding: '10px',
      borderRadius: '10px'
    }}>
      &copy; 2025 FIFO SYSTEM. All rights reserved.
    </p>
  </div>
</Element>


      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={toggleModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Login</h2>
            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              {["Admin", "Godown Incharge", "PDS Incharge"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedrole(type)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor: selectedrole === type ? "#0a192f" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <input type="text" name="id" placeholder={`${selectedrole} ID`} value={formData.id} onChange={handleChange} style={styles.input} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={styles.input} required />
              <button type="submit" style={styles.loginBtn}>Login</button>
            </form>
            <p style={styles.signupText}>Only allowed registered users.</p>
            <button onClick={toggleModal} style={styles.closeBtn}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  background: {
    backgroundImage: `url(${godownIMG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: -1,
    opacity: 0.3,
  },
  navbar: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: '#0a192f',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    color: 'lightblue',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    textDecoration: 'none',
    fontSize: '1rem',
  },
  section: {
    minHeight: '100vh',
    // backgroundColor: 'rgba(0, 0, 0, 0.78)',
    paddingTop: '5rem',
    paddingBottom: '3rem',
    color: '#272343',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  college: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color:'black',
  },
  header: {
    fontSize: '2.4rem',
    marginBottom: '1rem',
    textTransform:'uppercase'
  },
  textContent: {
    maxWidth: '700px',
    margin: '0 auto',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  carouselWrapper: {
    width: '100%',
    height: '90%',
    // marginTop: '1rem',
    backgroundColor:'red'
  },
  img:{
    width: '100%',
    height: '500px',
    
  },



  membersWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '2rem',
  },

  memberCard: {
  perspective: '1000px',
  width: '240px',
  height: '260px',
  display:'flex',

},
cardInner: {
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.8s',
  transformStyle: 'preserve-3d',
  backgroundColor: '#f8fcfb',

},
cardHover: {
  transform: 'rotateY(180deg)',
},
cardFace: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // color: '#fff',
},
cardFront: {
  backgroundColor: '#fdfdfd',
},
cardBack: {
  backgroundColor: '#0a192f',
  color: '#fff',
  transform: 'rotateY(180deg)',
},
profileCircle: {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#e0e0e0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2rem',
  marginBottom: '1rem',
},






  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: '#f8fcfb',
    padding: '2rem',
    borderRadius: '10px',
    width: '490px',
    textAlign: 'center',
    position: 'relative',
  },
  modalTitle: {
    marginBottom: '1rem',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  loginBtn: {
    backgroundColor: '#0a192f',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  signupText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  signupLink: {
    color: '#007bff',
    cursor: 'pointer',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    border: 'none',
    background: 'transparent',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },


  sectionN: {
    padding: '40px',
    backgroundColor: 'rgba(14, 21, 67, 0.69)',
    borderRadius: '8px',
    marginTop: '30px',
  },
  headerR: {
    fontSize: '2.5rem',
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  textContent: {
    fontSize: '1.15rem',
    lineHeight: '1.8',
    color: '#444',
    marginBottom: '25px',
    textAlign: 'justify',  // Align text to both left and right for better readability
    padding: '15px',
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
  },
  paragraph1: {
    backgroundColor: '#e3f2fd', // Light blue background
    borderLeft: '8px solid #2196f3', // Blue left border for emphasis
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    paddingLeft: '20px',
    fontStyle: 'italic',
  },
  paragraph2: {
    backgroundColor: '#fffde7', // Soft yellow background
    borderLeft: '8px solid #ffeb3b', // Yellow left border for contrast
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    paddingLeft: '20px',
    fontWeight: '600', // Make the text bold to highlight the information
  },
  paragraph3: {
    backgroundColor: '#e8f5e9', // Light green background
    borderLeft: '8px solid #4caf50', // Green left border for emphasis
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    paddingLeft: '20px',
    fontWeight: 'normal', // Regular weight for a more neutral look
  },
};

export default MainPage;
