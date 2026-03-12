DROP DATABASE IF EXISTS posta;
CREATE DATABASE posta;
USE posta;

-- Creación de tablas base (Sin dependencias)
CREATE TABLE usuario (
    idusuario INT AUTO_INCREMENT PRIMARY KEY,
    rol ENUM('Administrador', 'Medico', 'Paciente') NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(100) NOT NULL
);

CREATE TABLE admin (
  idadmin INT AUTO_INCREMENT PRIMARY KEY,
  idusuario INT NOT NULL,
  CONSTRAINT fk_admin_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

CREATE TABLE consultorio (
    idconsultorio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(250) DEFAULT 'Descripcion no disponible' NULL,
    foto VARCHAR(100) DEFAULT 'https://i.ibb.co/YBcRmRFs/posta.png' NULL
);

CREATE TABLE posta (
    idposta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(9) DEFAULT '-' NULL,
    foto VARCHAR(100) DEFAULT 'https://i.ibb.co/YBcRmRFs/posta.png' NULL,
    disponible TINYINT(1) DEFAULT 1 NULL
);

CREATE TABLE horario (
    idhorario INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

CREATE TABLE enfermedad (
    idenfermedad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT 'Descripcion no disponible' NULL
);

CREATE TABLE medicamento (
    idmedicamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    via ENUM('Oral', 'Intramuscular') NOT NULL
);

CREATE TABLE alergia (
    idalergia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT 'Descripcion no disponible' NULL
);

-- Creación de tablas con dependencias simples

CREATE TABLE especialidad (
    idespecialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    idconsultorio INT NOT NULL,
    CONSTRAINT fk_especialidad_consultorio FOREIGN KEY (idconsultorio) REFERENCES consultorio(idconsultorio)
);

CREATE TABLE paciente (
    idpaciente INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidoP VARCHAR(20) NOT NULL,
    apellidoM VARCHAR(20) NOT NULL,
    genero ENUM('Masculino', 'Femenino') NOT NULL,
    dni VARCHAR(8) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    celular VARCHAR(9) DEFAULT '-' NULL,
    direccion VARCHAR(100) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

CREATE TABLE medico (
    idmedico INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidoP VARCHAR(20) NOT NULL,
    apellidoM VARCHAR(20) NOT NULL,
    dni VARCHAR(8) NOT NULL,
    idespecialidad INT NOT NULL,
    foto VARCHAR(100) DEFAULT 'https://i.ibb.co/1ttXLJFj/doctor.png' NULL,
    disponible TINYINT(1) DEFAULT 1 NOT NULL,
    CONSTRAINT fk_medico_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE,
    CONSTRAINT fk_medico_especialidad FOREIGN KEY (idespecialidad) REFERENCES especialidad(idespecialidad)
);

CREATE TABLE consultorio_posta (
    idconsultorio_posta INT AUTO_INCREMENT PRIMARY KEY,
    idconsultorio INT NOT NULL,
    idposta INT NOT NULL,
    disponible TINYINT(1) DEFAULT 1 NOT NULL,
    CONSTRAINT fk_cp_consultorio FOREIGN KEY (idconsultorio) REFERENCES consultorio(idconsultorio),
    CONSTRAINT fk_cp_posta FOREIGN KEY (idposta) REFERENCES posta(idposta)
);

CREATE TABLE antecedentes (
    idantecedentes INT AUTO_INCREMENT PRIMARY KEY,
    idpaciente INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT fk_antecedentes_paciente FOREIGN KEY (idpaciente) REFERENCES paciente(idpaciente)
);

-- Creación de tablas transaccionales y de dependencias complejas

CREATE TABLE medico_consultorio_posta (
    idmedconposta INT AUTO_INCREMENT PRIMARY KEY,
    idmedico INT NOT NULL,
    idconsultorio_posta INT NOT NULL,
    disponible TINYINT(1) DEFAULT 1 NOT NULL,
    CONSTRAINT fk_mcp_medico FOREIGN KEY (idmedico) REFERENCES medico(idmedico),
    CONSTRAINT fk_mcp_cp FOREIGN KEY (idconsultorio_posta) REFERENCES consultorio_posta(idconsultorio_posta)
);

CREATE TABLE programacion_cita (
    idprogramacion_cita INT AUTO_INCREMENT PRIMARY KEY,
    idmedconposta INT NOT NULL,
    idhorario INT NOT NULL,
    fecha DATE NOT NULL,
    cupos_totales INT NOT NULL CHECK (cupos_totales >= 0),
    cupos_disponibles INT DEFAULT 0 NULL CHECK (cupos_disponibles >= 0),
    CONSTRAINT fk_pc_mcp FOREIGN KEY (idmedconposta) REFERENCES medico_consultorio_posta(idmedconposta),
    CONSTRAINT fk_pc_horario FOREIGN KEY (idhorario) REFERENCES horario(idhorario)
);

CREATE TABLE cita (
    idcita INT AUTO_INCREMENT PRIMARY KEY,
    idpaciente INT NOT NULL,
    idmedico INT NOT NULL,
    idprogramacion_cita INT NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Atendido', 'Ausente', 'En espera') DEFAULT 'En espera' NULL,
    consultorio VARCHAR(50) NOT NULL,
    num_cupo INT NOT NULL,
    hora_aprox TIME NULL,
    triaje VARCHAR(100) NOT NULL,
    CONSTRAINT fk_cita_paciente FOREIGN KEY (idpaciente) REFERENCES paciente(idpaciente),
    CONSTRAINT fk_cita_medico FOREIGN KEY (idmedico) REFERENCES medico(idmedico),
    CONSTRAINT fk_cita_programacion FOREIGN KEY (idprogramacion_cita) REFERENCES programacion_cita(idprogramacion_cita)
);

CREATE TABLE diagnostico (
    iddiagnostico INT AUTO_INCREMENT PRIMARY KEY,
    idcita INT NOT NULL,
    idenfermedad INT NOT NULL,
    observacion VARCHAR(255) NOT NULL,
    CONSTRAINT fk_diagnostico_cita FOREIGN KEY (idcita) REFERENCES cita(idcita),
    CONSTRAINT fk_diagnostico_enfermedad FOREIGN KEY (idenfermedad) REFERENCES enfermedad(idenfermedad)
);

CREATE TABLE receta (
    idreceta INT AUTO_INCREMENT PRIMARY KEY,
    iddiagnostico INT NOT NULL,
    idmedicamento INT NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    CONSTRAINT fk_receta_diagnostico FOREIGN KEY (iddiagnostico) REFERENCES diagnostico(iddiagnostico),
    CONSTRAINT fk_receta_medicamento FOREIGN KEY (idmedicamento) REFERENCES medicamento(idmedicamento)
);

CREATE TABLE alergia_historia (
    idalergia_historia INT AUTO_INCREMENT PRIMARY KEY,
    idantecedentes INT NOT NULL,
    idalergia INT NOT NULL,
    CONSTRAINT fk_ah_antecedentes FOREIGN KEY (idantecedentes) REFERENCES antecedentes(idantecedentes),
    CONSTRAINT fk_ah_alergia FOREIGN KEY (idalergia) REFERENCES alergia(idalergia)
);

CREATE TABLE enfermedad_historia (
    idenfermedad_historia INT AUTO_INCREMENT PRIMARY KEY,
    idenfermedad INT NOT NULL,
    idantecedentes INT NOT NULL,
    CONSTRAINT fk_eh_antecedentes FOREIGN KEY (idantecedentes) REFERENCES antecedentes(idantecedentes),
    CONSTRAINT fk_eh_enfermedad FOREIGN KEY (idenfermedad) REFERENCES enfermedad(idenfermedad)
);
