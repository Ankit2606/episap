import React,{ useState, useEffect } from 'react'
import axios from 'axios';


const CreateIdea = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
  
    useEffect(() => {
      axios
        .get('http://localhost:3001/api/data')
        .then((response) => setData(response.data))
        .catch((error) => console.log(error));
    }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      axios
        .post('http://localhost:3001/api/data', formData)
        .then((response) => {
          if (response.data.success) {
            setData([...data, formData]);
            setFormData({});
          }
        })
        .catch((error) => console.log(error));
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
          />
          <input
            type="contact"
            name="contact"
            value={formData.contact || ''}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {data.map((item) => (
            <li key={item.email}>{item.name} - {item.email} - {item.contact}</li>
          ))}
        </ul>
      </div>
    );
}

export default CreateIdea