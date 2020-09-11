# use-state-manager
Hook Use State Manager

# Descripción
Libreria para el manejo de estados de un valor (string, number, array, object, etcetera), basa en el patron Pub/Sub

- Permite conectar multiples componentes a un mismo valor y publicar cambios donde todos los componentes  subscritos se enteren del cambio

- perimite a elementos externos al componentes (un cliente HTTP con Axios por ejemplo), publicar cambios donde los componentes subscritos reciban el nuevo valor y se actualicen

# Uso

- Definir un archivos donde se crearan los manager

```js

import { createManager } from 'use-state-manager';

/**
 * @param {any} - variable a observar
 * @param {string} - key global para exponer el <manager> y hacerlo accesible <window.key>
 * @param {boolean} - true para ver un log, default=false
 * @param {boolean} - true Para hacerlo persistente
 */
export const textManager = createManager(valor, key, debugMode, persist)

```

- en el archivo `App.jsx` initializar los manager

```js
import React from 'react';
import {  useManagerInit } from 'use-state-manager';

const App = () => {
  useManagerInit(textManager);
  useManagerInit(yearManager);
  return (
    <div className="app">
    </div>
  );
}

export default App;

```

- Para publicar cambio y leer el valor, se hace de la siguiente forma 
su utiza como un hook de estado

- al hook `useStateManager` se debe pasar como propiedad el manager a escuchar

```js
import React from 'react';
import { useStateManager } from 'use-state-manager';
import { textManager } from '../../store/managers';

const Home = () => {
  
  
  const [year, setYear] = useStateManager(yearManager, "uniquekey");

  return (
    <div className="home">
      {year}
      <button onClick={() => setYear(12)}>Cambiar año</button>
    </div>
  );
};
  
export default Home;
```


