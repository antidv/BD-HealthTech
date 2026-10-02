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
      <div className="containerColor d-flex align-items-center justify-content-center min-vh-100 p-3">
        {modal.show && (
          <Modal
            titulo={modal.titulo}
            estado={modal.estado}
            mensaje={modal.message}
            setModal={setModal}
          />
        )}

        <div className="container" style={{ maxWidth: "980px" }}>
          <div className="row g-0 align-items-center login-card overflow-hidden">
            {/* Columna Izquierda: Logo y Presentación */}
            <div className="col-12 col-md-6 text-center p-4 p-lg-5 d-flex flex-column align-items-center justify-content-center border-end-md">
              <img src={Logo} alt="HealthTech Logo" className="logo img-fluid mb-3" />
              <p className="text-muted small mt-2 mb-0">
                Plataforma de atención médica y gestión de citas
              </p>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="col-12 col-md-6 p-4 p-lg-5">
              <div className="mb-4 text-center text-md-start">
                <h2 className="fw-bold mb-1">Iniciar Sesión</h2>
                <p className="text-muted small">Ingresa tus credenciales para acceder</p>
              </div>

              <form onSubmit={onSubmit}>
                <fieldset disabled={loadingLogin}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="correo">
                      Correo electrónico
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        id="correo"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className={`form-control border-start-0 ${
                          errors.correo ? "is-invalid" : ""
                        }`}
                        {...register("correo", {
                          required: {
                            value: true,
                            message: "El correo es requerido",
                          },
                          pattern: {
                            value:
                              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: "Correo no válido",
                          },
                        })}
                      />
                    </div>
                    {errors.correo && (
                      <p className="invalid-feedback d-block small mt-1">{errors.correo.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="contrasenia">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        id="contrasenia"
                        type="password"
                        placeholder="••••••••"
                        className={`form-control border-start-0 ${
                          errors.contrasenia ? "is-invalid" : ""
                        }`}
                        {...register("contrasenia", {
                          required: {
                            value: true,
                            message: "La contraseña es requerida",
                          },
                        })}
                      />
                    </div>
                    {errors.contrasenia && (
                      <p className="invalid-feedback d-block small mt-1">
                        {errors.contrasenia.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loadingLogin}
                    className="btn btn-warning w-100 py-2 fs-6 fw-bold shadow-sm"
                  >
                    {loadingLogin ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Ingresar
                      </>
                    )}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
