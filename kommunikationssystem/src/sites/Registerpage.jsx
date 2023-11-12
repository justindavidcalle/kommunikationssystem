import axios from 'axios';

const Registerpage = () => {
  const uri = 'http://localhost:3005/users';

  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(uri, formData);
      console.log('User data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending user data:', error.message);
    }
  };

  return (
    <>
      <div className='login-wrapper'>
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" placeholder='username' name='username' value={formData.username} onChange={handleChange} />
          </label>
          <label>
            <p>E-Mail</p>
            <input type="email" placeholder='email' name='email' value={formData.email} onChange={handleChange} />
          </label>
          <label>
            <p>Password</p>
            <input type="password" placeholder='password' name='password' value={formData.password} onChange={handleChange} />
          </label>
          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registerpage;
