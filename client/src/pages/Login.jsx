import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
function Login() { 
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const { signin, error, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => { 
    signin(data);
  })

  useEffect(() => {
    if (error === "Contraseña incorrecta") {
      setValue("contrasenia", "");
    } else if (error === "Usuario no encontrado") {
      reset();
    }
  }, [error]);

   useEffect(() => {
    if (isAuthenticated) {
      navigate("/paciente");
    }
  }, [isAuthenticated]);

  return (
    <div>
      {
        <div>{ error }</div>
      }
      <h1>Iniciar Sesión</h1>
      <form onSubmit={ onSubmit }>
        <input
          type="email" placeholder="Correo"
          {...register("correo", {required: true})}
        />
        { errors.email && <p>Correo es requerido</p>}
        <input
          type="password" placeholder="Contraseña"
          {...register("contrasenia", {required: true})}
        />
        { errors.password && <p>Contraseña es requerida</p>}
        <button type="submit">Iniciar</button>
      </form>
    </div>
  )
}

export default Login;
