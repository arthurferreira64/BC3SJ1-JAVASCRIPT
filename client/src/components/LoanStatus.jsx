import React, { useState, useEffect } from 'react';
const base = import.meta.env.VITE_BASE_URL || '/';

const LoanStatus = () => {
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`${base}api/users`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => setErrors([error.message]));
    }, []);

    const handleFetch = async () => {
        setErrors([]);
        try {
            const response = await fetch(`${base}api/loans/status/${userId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setLoans(data);
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || ['Une erreur est survenue']);
            }
        } catch (error) {
            setErrors([error.message]);
        }
    };

    return (
        <div className="container">
            {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
            <div>
                <label>Utilisateur:</label>
                <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
                    <option value="">Sélectionnez un utilisateur</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.email}</option>
                    ))}
                </select>
                <button onClick={handleFetch}>Obtenir le statut des prêts</button>
            </div>
            <ul>
                {loans.map((loan) => (
                    <li key={loan.id}>
                        ID du livre: {loan.book_id}, Date de prêt: {loan.loan_date}, Date de retour: {loan.return_date}, Retourné: {loan.returned ? 'Oui' : 'Non'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LoanStatus;
