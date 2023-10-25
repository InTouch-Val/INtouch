import React, {useState} from 'react';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if(credentials.username === 'admin' && credentials.password === 'admin') {
            setError('');
        } else {
            setError('Invalid username or password');
        }
    }
  return (
    <div className='login-page'>
        <form onSubmit={handleLogin}>
            <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input type='text' className='form-control' 
                id='username' placeholder='Enter username' 
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}/>
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input type='password' className='form-control' 
                id='password' placeholder='Enter password' 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}/>
            </div>
            <button type='submit' className='btn btn-primary'>Login</button>
        </form>
        {error && <div className='alert alert-danger'>{error}</div>}
    </div>
  )
}

export default LoginPage