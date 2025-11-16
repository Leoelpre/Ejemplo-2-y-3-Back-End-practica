import express from 'express';
import cors from 'cors';
import connection from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Crear POST - agregar alumno
app.post('/api/alumnos', (req, res) => {
  const { nombre, edad, curso } = req.body;

  if (!nombre || !edad) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre y edad' });
  }

  const query = 'INSERT INTO alumnos (nombre, edad, curso) VALUES (?, ?, ?)';
  connection.query(query, [nombre, edad, curso || null], (err, results) => {
    if (err) {
      console.error('Error al insertar alumno:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ mensaje: 'Alumno agregado correctamente', id: results.insertId });
  });
});

// GET - listar alumnos
app.get('/api/alumnos', (req, res) => {
  const query = 'SELECT * FROM alumnos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener alumnos:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// DELETE
app.delete('/api/alumnos/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM alumnos WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar alumno:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json({ mensaje: 'Alumno eliminado correctamente' });
  });
});

//actualizar alumno por id
app.put('/api/alumnos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, edad, curso } = req.body;

  if (!nombre || !edad) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre y edad' });
  }

  const query = 'UPDATE alumnos SET nombre = ?, edad = ?, curso = ? WHERE id = ?';
  connection.query(query, [nombre, edad, curso || null, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar alumno:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json({ mensaje: 'Alumno actualizado correctamente' });
  });
});


app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
