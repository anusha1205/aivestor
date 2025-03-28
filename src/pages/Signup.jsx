import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1. Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Save extra info in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        name,
        age,
        phone,
        createdAt: new Date()
      });

      alert("Signup successful!");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
      <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" type="number" required />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
