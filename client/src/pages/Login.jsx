import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_ht.png";
import inic from "../pages/login.module.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const { user, signin, error, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (error === "Contraseña incorrecta") {
      setValue("contrasenia", "");
    } else if (error === "Usuario no encontrado") {
      reset();
    }
  }, [error]);

  useEffect(() => {
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
    <div className={`container-fluid ${inic.containerLogin}`}>
      <div className="row align-items-center justify-content-center vh-100">
        <div className="col-6 text-center">
          <img src={Logo} alt="Logo" className={`${inic.logo}`} />
        </div>

        <div className="col-6 align-items-center justify-content-center text-center">
          {<div>{error}</div>}
          <h2>Iniciar sesión</h2>
          <form onSubmit={onSubmit}>
            <div className="d-flex justify-content-center">
              <input
                type="email"
                placeholder="Correo"
                {...register("correo", {
                  required: {
                    value: true,
                    message: "Correo es requerido",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Correo no válido",
                  },
                })}
                className="form-control mt-3 mb-3 w-50"
              />
            </div>
            <div className="d-flex justify-content-center">
              {errors.correo && <p>{errors.correo.message}</p>}
              <input
                type="password"
                placeholder="Contraseña"
                {...register("contrasenia", {
                  required: {
                    value: true,
                    message: "Contaseña es requerida",
                  },
                })}
                className="form-control mt-3 mb-3 w-50"
              />
            </div>
            <div className="d-flex justify-content-center">
              {errors.contrasenia && <p>{errors.contrasenia.message}</p>}
              <button type="submit" className="btn btn-warning mt-3 mb-3">
                Iniciar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
