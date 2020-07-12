import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from './components/Table';
import './App.css';

function App() {
  const [colData, setColData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchpost = async () => {
    try {
      const response = await axios.get(
        'https://cors-anywhere.herokuapp.com/https://9hu0ztgsi6.execute-api.us-east-2.amazonaws.com/test/student/grade/'
      );
      console.log(response.data);
      const clsassignments = response.data.clsassignments;
      const colArray = [
        {
          Header: 'Student Name',
          accessor: 'studentName',
        },
      ];
      for (let i = 0; i < clsassignments.length; i++) {
        colArray.push({
          Header: clsassignments[i].sectionname,
          accessor: `grades.${clsassignments[i].sectionid}`,
          Cell: ({ cell: { value } }) => {
            return <>{value ? `${value}` : '0%'}</>;
          },
        });
      }
      // console.log(clsassignments);
      console.log(colArray);
      const gradedata = response.data.gradedata;
      const dataArray = [];
      for (let i = 0; i < gradedata.length; i++) {
        const grades = {};
        for (let j = 0; j < gradedata[i].grades.length; j++) {
          grades[gradedata[i].grades[j].sectionid] =
            gradedata[i].grades[j].gradePer;
        }
        dataArray.push({
          studentName: gradedata[i].studentName,
          grades,
        });
      }
      console.log(dataArray);
      setColData(colArray);
      setRowData(dataArray);
    } catch (error) {
      setErrorMsg((error.message = 'server error'));
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchpost();
  }, []);

  return (
    <div className="App">
      {rowData.length ? (
        <Table columns={colData} data={rowData} />
      ) : (
        <div>{errorMsg}</div>
      )}
    </div>
  );
}

export default App;
