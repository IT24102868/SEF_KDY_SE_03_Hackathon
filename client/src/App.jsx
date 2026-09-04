import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/services/going-abroad')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>AdultinLK - Going Abroad</h1>
      <ul>
        {data.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
}

export default App;