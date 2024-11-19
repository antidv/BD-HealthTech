import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
function Login() { 
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const { user, signin, error, isAuthenticated } = useAuth();

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

  useEffect( () => {
    if (isAuthenticated) {
      switch (user.rol) {
        case "Paciente":
          navigate("/paciente");
          break;
        case "Medico":
          navigate("/medico");
          break;
        case "Administrador":
          navigate("/admin");
          break;
        default:
          navigate("/404");
          break;
      }
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
          {...register("correo", {
            required: {
              value: true,
              message: "Correo es requerido"
            },
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Correo no válido"
            }
          })}
        />
        {errors.correo && <p>{ errors.correo.message }</p>}
        <input
          type="password" placeholder="Contraseña"
          {...register("contrasenia", {
            required: {
              value: true,
              message: "Contaseña es requerida"
            }
          })}
        />
        { errors.contrasenia && <p>{ errors.contrasenia.message }</p>}
        <button type="submit">Iniciar</button>
      </form>
    </div>
  )
}

export default Login;
