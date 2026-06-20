const app = require('./src/app');
const { sequelize } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a la base de datos establecida correctamente');

    // sync({ alter: true }) crea/actualiza las tablas automaticamente
    // En produccion real se recomienda usar migraciones en vez de sync
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciar();
