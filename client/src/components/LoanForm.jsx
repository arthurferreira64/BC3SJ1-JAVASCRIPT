import React, {useState, useEffect} from 'react';
import './LoanForm.css';

const base = import.meta.env.VITE_BASE_URL || '/';

const LoanForm = () => {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`${base}api/session`, {credentials: 'include'})
            .then(response => response.json())
            .then(data => {
                const userIdFromSession = data.user.id;
                setUserId(userIdFromSession);
                if (data.user.role === 'utilisateur') {
                    fetch(`${base}api/users/id/${userIdFromSession}`, {credentials: 'include'})
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('La réponse du réseau n\'était pas correcte');
                            }
                            return response.json();
                        })
                        .then(data => setUsers(data))
                        .catch(error => setErrors([error.message]));
                } else {
                    fetch(`${base}api/users/`, {credentials: 'include'})
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('La réponse du réseau n\'était pas correcte');
                            }
                            return response.json();
                        })
                        .then(data => setUsers(data))
                        .catch(error => setErrors([error.message]));
                }

            })
            .catch(error => setErrors([error.message]));

        fetch(`${base}api/books`, {credentials: 'include'})
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => setErrors([error.message]));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess(false);

        try {
            const response = await fetch(`${base}api/loans/loan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({book_id: bookId, user_id: userId}),
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
            {success && <p>Le prêt a été créé avec succès.</p>}
            {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Livre:</label>
                    <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                        <option value="">Sélectionnez un livre</option>
                        {books.map(book => (
                            <option key={book.id} value={book.id}>{book.titre}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Utilisateur:</label>
                    <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
                        <option value="">Sélectionnez un utilisateur</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.email}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Créer un prêt</button>
            </form>
        </div>
    );
};

export default LoanForm;
