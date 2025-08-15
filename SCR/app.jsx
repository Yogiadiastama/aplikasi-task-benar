import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";

function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    };
    fetchData();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskName === "") return;
    try {
      const newTaskData = { name: newTaskName };
      const docRef = await addDoc(collection(db, "tasks"), newTaskData);
      setTasks(prevTasks => [...prevTasks, { id: docRef.id, ...newTaskData }]);
      setNewTaskName("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <div>
      <h1>Proyek Dasbor Pekerjaan</h1>
      <form onSubmit={handleAddTask}>
        <input 
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Ketik tugas baru..."
        />
        <button type="submit">Tambah Tugas</button>
      </form>
      <h2>Daftar Tugas dari Database:</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => handleDeleteTask(task.id)} style={{ marginLeft: '10px' }}>
              Hapus
            </button>
          </li> 
        ))}
      </ul>
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MyApp />
  </React.StrictMode>
);