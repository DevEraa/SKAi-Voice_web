import React, { useState } from 'react';
import Navbar from './Navbar'
import UserTable from './UserTable'

export default function User() {
    //  const [modalOpen, setModalOpen] = useState(false);
    // console.log("modalOpen",modalOpen)
    return (
        <>
           {/* <Navbar modalOpen={modalOpen} setModalOpen={setModalOpen} /> */}
            <UserTable />
        </>
    )
}
