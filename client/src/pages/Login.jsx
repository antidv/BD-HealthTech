import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Logo from "../assets/logo_ht.png";

function Login() {
  const [modal, setModal] = useState({
    show: false,
    estado: true,
    titulo: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const { user, signin, error, clearError, loadingLogin, isAuthenticated } =
    useAuth();

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (error) {
      setModal({ show: true, titulo: "Error", estado: false, message: error });
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
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center vh-100">
          <div className="col-6 text-center">
            <img src={Logo} alt="Logo" className="logo" />
          </div>

          <div className="col-6 align-items-center justify-content-center text-center">
            {modal.show && (
              <Modal
                titulo={modal.titulo}
                estado={modal.estado}
                mensaje={modal.message}
                setModal={setModal}
              />
            )}
            <h1>Iniciar Sesión</h1>
            <form onSubmit={onSubmit}>
              <fieldset disabled={loadingLogin}>
                <div className="d-flex flex-column justify-content-center">
                  <input
                    type="email"
                    placeholder="Correo"
                    className={`form-control mt-3 w-50 mx-auto ${
                      errors.correo ? "is-invalid" : ""
                    }`}
                    {...register("correo", {
                      required: {
                        value: true,
                        message: "Correo es requerido",
                      },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Correo no válido",
                      },
                    })}
                  />
                  {errors.correo && (
                    <p className="invalid-feedback">{errors.correo.message}</p>
                  )}
                </div>

                <div className="d-flex flex-column justify-content-center">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className={`form-control mt-3 w-50 mx-auto ${
                      errors.contrasenia ? "is-invalid" : ""
                    }`}
                    {...register("contrasenia", {
                      required: {
                        value: true,
                        message: "Contaseña es requerida",
                      },
                    })}
                  />
                  {errors.contrasenia && (
                    <p className="invalid-feedback">
                      {errors.contrasenia.message}
                    </p>
                  )}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    disabled={loadingLogin}
                    className="btn btn-warning mt-3 mb-3"
                  >
                    {loadingLogin ? "Cargando ..." : "Iniciar"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
