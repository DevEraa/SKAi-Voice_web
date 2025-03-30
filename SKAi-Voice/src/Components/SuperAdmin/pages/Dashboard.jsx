import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
import Table from './AdminTable';

export default function Dashboard() {
  // const [modalOpen, setModalOpen] = useState(false);

  // Use useEffect to log state changes
  // useEffect(() => {
  //   console.log("Dashboard - modalOpen changed:", modalOpen);
  // }, [modalOpen]);  // Runs whenever modalOpen changes

  return (
    <>
      {/* <Navbar modalOpen={modalOpen} setModalOpen={setModalOpen} /> */}
      <Table />
    </>
  );
}
