-- ==========================================================
-- Esquema PostgreSQL para Sistema HealthTech (Posta)
-- ==========================================================

-- Tablas base (Sin dependencias)
DROP TABLE IF EXISTS usuario CASCADE;
CREATE TABLE usuario (
    idusuario SERIAL PRIMARY KEY,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Administrador', 'Medico', 'Paciente', 'paciente', 'medico', 'administrador')),
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS admin CASCADE;
CREATE TABLE admin (
    idadmin SERIAL PRIMARY KEY,
    idusuario INT NOT NULL,
    CONSTRAINT fk_admin_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

DROP TABLE IF EXISTS consultorio CASCADE;
CREATE TABLE consultorio (
    idconsultorio SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(250) DEFAULT 'Descripcion no disponible',
    foto VARCHAR(100) DEFAULT 'https://i.ibb.co/YBcRmRFs/posta.png'
);

DROP TABLE IF EXISTS posta CASCADE;
CREATE TABLE posta (
    idposta SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(9) DEFAULT '-',
    foto VARCHAR(100) DEFAULT 'https://i.ibb.co/YBcRmRFs/posta.png',
    disponible SMALLINT DEFAULT 1
);

DROP TABLE IF EXISTS horario CASCADE;
CREATE TABLE horario (
    idhorario SERIAL PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

DROP TABLE IF EXISTS enfermedad CASCADE;
CREATE TABLE enfermedad (
    idenfermedad SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT 'Descripcion no disponible'
);

DROP TABLE IF EXISTS medicamento CASCADE;
CREATE TABLE medicamento (
    idmedicamento SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    via VARCHAR(20) NOT NULL CHECK (via IN ('Oral', 'Intramuscular'))
);

DROP TABLE IF EXISTS alergia CASCADE;
CREATE TABLE alergia (
    idalergia SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT 'Descripcion no disponible'
);

-- Tablas con dependencias simples
DROP TABLE IF EXISTS especialidad CASCADE;
CREATE TABLE especialidad (
    idespecialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    idconsultorio INT NOT NULL,
    CONSTRAINT fk_especialidad_consultorio FOREIGN KEY (idconsultorio) REFERENCES consultorio(idconsultorio)
);

DROP TABLE IF EXISTS paciente CASCADE;
CREATE TABLE paciente (
    idpaciente SERIAL PRIMARY KEY,
    idusuario INT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidoP VARCHAR(20) NOT NULL,
    apellidoM VARCHAR(20) NOT NULL,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('Masculino', 'Femenino')),
    dni VARCHAR(8) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    celular VARCHAR(9) DEFAULT '-',
    direccion VARCHAR(100) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

DROP TABLE IF EXISTS medico CASCADE;
CREATE TABLE medico (
    idmedico SERIAL PRIMARY KEY,
    idusuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidoP VARCHAR(20) NOT NULL,
    apellidoM VARCHAR(20) NOT NULL,
    dni VARCHAR(8) NOT NULL,
    idespecialidad INT NOT NULL,
    foto VARCHAR(100) DEFAULT 'https://i.ibb.co/1ttXLJFj/doctor.png',
    disponible SMALLINT DEFAULT 1 NOT NULL,
    CONSTRAINT fk_medico_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE,
    CONSTRAINT fk_medico_especialidad FOREIGN KEY (idespecialidad) REFERENCES especialidad(idespecialidad)
);

DROP TABLE IF EXISTS consultorio_posta CASCADE;
CREATE TABLE consultorio_posta (
    idconsultorio_posta SERIAL PRIMARY KEY,
    idconsultorio INT NOT NULL,
    idposta INT NOT NULL,
    disponible SMALLINT DEFAULT 1 NOT NULL,
    CONSTRAINT fk_cp_consultorio FOREIGN KEY (idconsultorio) REFERENCES consultorio(idconsultorio),
    CONSTRAINT fk_cp_posta FOREIGN KEY (idposta) REFERENCES posta(idposta)
);

DROP TABLE IF EXISTS antecedentes CASCADE;
CREATE TABLE antecedentes (
    idantecedentes SERIAL PRIMARY KEY,
    idpaciente INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_antecedentes_paciente FOREIGN KEY (idpaciente) REFERENCES paciente(idpaciente)
);

-- Tablas transaccionales y de dependencias complejas
DROP TABLE IF EXISTS medico_consultorio_posta CASCADE;
CREATE TABLE medico_consultorio_posta (
    idmedconposta SERIAL PRIMARY KEY,
    idmedico INT NOT NULL,
    idconsultorio_posta INT NOT NULL,
    disponible SMALLINT DEFAULT 1 NOT NULL,
    CONSTRAINT fk_mcp_medico FOREIGN KEY (idmedico) REFERENCES medico(idmedico),
    CONSTRAINT fk_mcp_cp FOREIGN KEY (idconsultorio_posta) REFERENCES consultorio_posta(idconsultorio_posta)
);

DROP TABLE IF EXISTS programacion_cita CASCADE;
CREATE TABLE programacion_cita (
    idprogramacion_cita SERIAL PRIMARY KEY,
    idmedconposta INT NOT NULL,
    idhorario INT NOT NULL,
    fecha DATE NOT NULL,
    cupos_totales INT NOT NULL CHECK (cupos_totales >= 0),
    cupos_disponibles INT DEFAULT 0 CHECK (cupos_disponibles >= 0),
    CONSTRAINT fk_pc_mcp FOREIGN KEY (idmedconposta) REFERENCES medico_consultorio_posta(idmedconposta),
    CONSTRAINT fk_pc_horario FOREIGN KEY (idhorario) REFERENCES horario(idhorario)
);

DROP TABLE IF EXISTS cita CASCADE;
CREATE TABLE cita (
    idcita SERIAL PRIMARY KEY,
    idpaciente INT NOT NULL,
    idmedico INT NOT NULL,
    idprogramacion_cita INT NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'En espera' CHECK (estado IN ('Atendido', 'Ausente', 'En espera')),
    consultorio VARCHAR(50) NOT NULL,
    num_cupo INT NOT NULL,
    hora_aprox TIME NULL,
    triaje VARCHAR(100) NOT NULL,
    CONSTRAINT fk_cita_paciente FOREIGN KEY (idpaciente) REFERENCES paciente(idpaciente),
    CONSTRAINT fk_cita_medico FOREIGN KEY (idmedico) REFERENCES medico(idmedico),
    CONSTRAINT fk_cita_programacion FOREIGN KEY (idprogramacion_cita) REFERENCES programacion_cita(idprogramacion_cita)
);

DROP TABLE IF EXISTS diagnostico CASCADE;
CREATE TABLE diagnostico (
    iddiagnostico SERIAL PRIMARY KEY,
    idcita INT NOT NULL,
    idenfermedad INT NOT NULL,
    observacion VARCHAR(255) NOT NULL,
    CONSTRAINT fk_diagnostico_cita FOREIGN KEY (idcita) REFERENCES cita(idcita),
    CONSTRAINT fk_diagnostico_enfermedad FOREIGN KEY (idenfermedad) REFERENCES enfermedad(idenfermedad)
);

DROP TABLE IF EXISTS receta CASCADE;
CREATE TABLE receta (
    idreceta SERIAL PRIMARY KEY,
    iddiagnostico INT NOT NULL,
    idmedicamento INT NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    CONSTRAINT fk_receta_diagnostico FOREIGN KEY (iddiagnostico) REFERENCES diagnostico(iddiagnostico),
    CONSTRAINT fk_receta_medicamento FOREIGN KEY (idmedicamento) REFERENCES medicamento(idmedicamento)
);

DROP TABLE IF EXISTS alergia_historia CASCADE;
CREATE TABLE alergia_historia (
    idalergia_historia SERIAL PRIMARY KEY,
    idantecedentes INT NOT NULL,
    idalergia INT NOT NULL,
    CONSTRAINT fk_ah_antecedentes FOREIGN KEY (idantecedentes) REFERENCES antecedentes(idantecedentes),
    CONSTRAINT fk_ah_alergia FOREIGN KEY (idalergia) REFERENCES alergia(idalergia)
);

DROP TABLE IF EXISTS enfermedad_historia CASCADE;
CREATE TABLE enfermedad_historia (
    idenfermedad_historia SERIAL PRIMARY KEY,
    idenfermedad INT NOT NULL,
    idantecedentes INT NOT NULL,
    CONSTRAINT fk_eh_antecedentes FOREIGN KEY (idantecedentes) REFERENCES antecedentes(idantecedentes),
    CONSTRAINT fk_eh_enfermedad FOREIGN KEY (idenfermedad) REFERENCES enfermedad(idenfermedad)
);
