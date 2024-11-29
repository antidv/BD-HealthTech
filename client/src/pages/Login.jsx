import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_ht.png";
import inic from "../pages/principal.module.css";

function Login() {
=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

function Login() {
  const [modal, setModal] = useState({ show: false, message: "" });

>>>>>>> baf82e682819684ff2b3fb1ce3625fcb80311075
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
<<<<<<< HEAD
  const { user, signin, error, isAuthenticated } = useAuth();
=======
  const { user, signin, error, clearError, loadingLogin, isAuthenticated } =
    useAuth();
>>>>>>> baf82e682819684ff2b3fb1ce3625fcb80311075

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (error) {
      setModal({ show: true, message: error });
      if (error === "Contraseña incorrecta") {
        setValue("contrasenia", "");
      } else if (error === "Usuario no encontrado") {
        reset();
      }
    }
    clearError();
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
    <div>
      {modal.show && (
        <Modal titulo={"Error"} mensaje={modal.message} setModal={setModal} />
      )}
      <h1>Iniciar Sesión</h1>
      <form onSubmit={onSubmit}>
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
        />
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
        />
        {errors.contrasenia && <p>{errors.contrasenia.message}</p>}
        <button type="submit" disabled={loadingLogin}>
          {loadingLogin ? "Cargando ..." : "Iniciar"}
        </button>
      </form>
    </div>
  );
}

export default Login;
