import React, { useEffect, useState } from 'react';

const TrainMap = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      const res = await fetch('http://localhost:5050/api/martainfo/line/gold');
      const data = await res.json();
      setTrains(data);
    };

    fetchTrains();
    const interval = setInterval(fetchTrains, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
        <p>Hi</p>
    </div>
  );
};

export default TrainMap;
