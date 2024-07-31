import React, {useEffect, useState} from 'react';

const base = import.meta.env.VITE_BASE_URL || '/';

const LoanHistory = () => {
    const [loans, setLoans] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`${base}api/session`, {credentials: 'include'})
            .then(response => response.json())
            .then(data => {
                fetch(`${base}api/loans/history/${data.user.id}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then(response => {
                        console.log(response);
                        if (!response.ok) {
                            throw new Error('La réponse du réseau n\'était pas correcte');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        setLoans(data);
                    })
                    .catch(error => setErrors([error.message]));

            })
            .catch(error => setErrors([error.message]));

    }, []);

    return (
        <div>
            <h1>Historique des emprunts</h1>
            {errors.length > 0 && <div className="errors">{errors.join(', ')}</div>}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Book ID</th>
                    <th>User ID</th>
                    <th>Date d'emprunt</th>
                    <th>Date de retour</th>
                    <th>Retourné</th>
                </tr>
                </thead>
                <tbody>
                {loans.map(loan => (
                    <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{loan.book_id}</td>
                        <td>{loan.user_id}</td>
                        <td>{loan.loan_date}</td>
                        <td>{loan.return_date}</td>
                        <td>{loan.returned ? 'Oui' : 'Non'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LoanHistory;
