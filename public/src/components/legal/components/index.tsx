import React from 'react';


const Index: React.FC = () => {
  return (
    <div className="contenedor">Hola Mundo!
        <form className='form'>
          <p className='title'>Formulario de Inscripcion</p>
          <input type="text" name="username" id="username" />
          <input type='password' name="password" id="password" />
          <button className='button'></button>
        </form>
    </div>
  );
};

export default Index;
