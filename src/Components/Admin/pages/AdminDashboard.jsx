import React, { useState } from 'react';
import Navbar from './Navbar';
import Audiocallpre from './Audiocallpre';

export default function AdminDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  console.log("modalOpen",modalOpen)
  return (
   <>
   {/* <Navbar modalOpen={modalOpen} /> */}
    <Audiocallpre />
   </>
  )
}
