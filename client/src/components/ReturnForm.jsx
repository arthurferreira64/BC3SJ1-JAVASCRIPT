import React, { useState, useEffect } from 'react';
const base = import.meta.env.VITE_BASE_URL || '/';

const ReturnForm = () => {
    const [loanId, setLoanId] = useState('');
    const [loans, setLoans] = useState([]);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`${base}api/session`, {credentials: 'include'})
            .then(response => response.json())
            .then(data => {
                if (data.user.role === 'utilisateur') {
                    console.log('laaa')
                    console.log(data.user.id)
                    fetch(`${base}api/loans/user/${data.user.id}`, { credentials: 'include' })
                        .then(response => {
                            console.log(response)
                            if (!response.ok) {
                                throw new Error('La réponse du réseau n\'était pas correcte');
                            }
                            return response.json();
                        })
                        .then(data => {
                            setLoans(data);
                            console.log(data);
                        })
                        .catch(error => setErrors([error.message]));
                } else {
                    // Fetch all loans
                    fetch(`${base}api/loans/loans`, { credentials: 'include' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('La réponse du réseau n\'était pas correcte');
                            }
                            return response.json();
                        })
                        .then(data => {
                            setLoans(data);
                            console.log(data);
                        })
                        .catch(error => setErrors([error.message]));
                }

            })
            .catch(error => setErrors([error.message]));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess(false);

        try {
            const response = await fetch(`${base}api/loans/return`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loan_id: loanId }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(true);
                alert(data.message);
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
            {success && <p>Le livre a été retourné avec succès.</p>}
            {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Prêt:</label>
                    <select value={loanId} onChange={(e) => setLoanId(e.target.value)} required>
                        <option value="">Sélectionnez un prêt</option>
                        {loans.map(loan => (
                            <option key={loan.id} value={loan.id}>{`Livre: ${loan.book_title}, Utilisateur: ${loan.user_email}`}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Retourner le livre</button>
            </form>
        </div>
    );
};

export default ReturnForm;
