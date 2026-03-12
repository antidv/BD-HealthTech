USE posta;

-- ==========================================================
-- 1. CATÁLOGOS BASE (Consultorios, Postas, Horarios, etc.)
-- ==========================================================

INSERT INTO consultorio (idconsultorio, nombre, descripcion) VALUES
(1, 'Medicina General', 'Atención médica primaria y preventiva'),
(2, 'Pediatría', 'Atención integral para niños y adolescentes'),
(3, 'Odontología', 'Salud bucal y prevención dental'),
(4, 'Ginecología', 'Salud integral de la mujer'),
(5, 'Psicología', 'Atención y soporte en salud mental'),
(6, 'Nutrición', 'Asesoría nutricional y dietética');

INSERT INTO posta (idposta, nombre, ciudad, direccion, telefono, disponible) VALUES
(1, 'Posta Médica Ate Vitarte', 'Lima', 'Av. Nicolás Ayllón 1234, Ate', '999888777', 1),
(2, 'Posta Santa Anita', 'Lima', 'Los Ruiseñores 444, Santa Anita', '988777666', 1),
(3, 'Posta La Molina', 'Lima', 'Av. Constructores 789, La Molina', '977666555', 1),
(4, 'Centro de Salud San Luis', 'Lima', 'Jr. San Juan 100, San Luis', '966555444', 1),
(5, 'Posta El Agustino', 'Lima', 'Riva Agüero 200, El Agustino', '955444333', 1),
(6, 'Posta Chaclacayo', 'Lima', 'Av. Nicolás de Piérola 500, Chaclacayo', '944333222', 1);

INSERT INTO horario (idhorario, hora_inicio, hora_fin) VALUES
(1, '08:00:00', '10:00:00'),
(2, '10:00:00', '12:00:00'),
(3, '12:00:00', '14:00:00'),
(4, '14:00:00', '16:00:00'),
(5, '16:00:00', '18:00:00'),
(6, '18:00:00', '20:00:00');

INSERT INTO enfermedad (idenfermedad, nombre, descripcion) VALUES
(1, 'Resfriado Común', 'Infección viral del tracto respiratorio'),
(2, 'Infección Estomacal', 'Gastroenteritis por bacterias o virus'),
(3, 'Hipertensión', 'Presión arterial anormalmente alta'),
(4, 'Migraña', 'Dolor de cabeza intenso y punzante'),
(5, 'Faringitis', 'Inflamación de la faringe'),
(6, 'Diabetes Tipo 2', 'Nivel elevado de azúcar en la sangre');

INSERT INTO medicamento (idmedicamento, nombre, via) VALUES
(1, 'Paracetamol 500mg', 'Oral'),
(2, 'Ibuprofeno 400mg', 'Oral'),
(3, 'Amoxicilina 500mg', 'Oral'),
(4, 'Losartán 50mg', 'Oral'),
(5, 'Diclofenaco 75mg', 'Intramuscular'),
(6, 'Omeprazol 20mg', 'Oral');

INSERT INTO alergia (idalergia, nombre, descripcion) VALUES
(1, 'Penicilina', 'Reacción alérgica a antibióticos'),
(2, 'Ibuprofeno', 'Intolerancia a AINEs'),
(3, 'Polvo', 'Alergia a ácaros del polvo'),
(4, 'Polen', 'Rinitis alérgica estacional'),
(5, 'Mariscos', 'Alergia alimentaria'),
(6, 'Látex', 'Alergia al contacto con látex');

INSERT INTO especialidad (idespecialidad, nombre, idconsultorio) VALUES
(1, 'Médico Cirujano', 1),
(2, 'Pediatra General', 2),
(3, 'Odontólogo', 3),
(4, 'Gineco-Obstetra', 4),
(5, 'Psicólogo Clínico', 5),
(6, 'Nutricionista', 6);

-- ==========================================================
-- 2. USUARIOS (Cuentas Principales solicitadas)
-- ==========================================================
-- Admin: id 1 | Medico: id 2 | Paciente: id 3 | Resto: ids 4 al 10

INSERT INTO usuario (idusuario, rol, correo, contrasenia) VALUES
(1, 'Administrador', 'admin@correo.com', 'admin123'),
(2, 'Medico', 'medico1@correo.com', 'medico123'),
(3, 'Paciente', 'paciente1@correo.com', 'paciente123'),
(4, 'Medico', 'medico2@correo.com', 'medico123'),
(5, 'Medico', 'medico3@correo.com', 'medico123'),
(6, 'Paciente', 'paciente2@correo.com', 'paciente123'),
(7, 'Paciente', 'paciente3@correo.com', 'paciente123'),
(8, 'Paciente', 'paciente4@correo.com', 'paciente123'),
(9, 'Paciente', 'paciente5@correo.com', 'paciente123'),
(10, 'Paciente', 'paciente6@correo.com', 'paciente123');

-- ==========================================================
-- 3. PERFILES (Pacientes y Médicos)
-- ==========================================================
-- Admin
INSERT INTO admin (idadmin, idusuario) VALUES
(1, 1);


-- El Paciente 1 (idpaciente 1) es el que usaremos para ver más data
INSERT INTO paciente (idpaciente, idusuario, nombre, apellidoP, apellidoM, genero, dni, fecha_nacimiento, celular, direccion, ciudad) VALUES
(1, 3, 'Carlos', 'Quispe', 'Pérez', 'Masculino', '11111111', '1990-05-15', '999111222', 'Av. Central 123', 'Ate'),
(2, 6, 'María', 'López', 'Rojas', 'Femenino', '22222222', '1985-08-20', '988222333', 'Jr. Los Pinos 456', 'Ate'),
(3, 7, 'Jorge', 'Gómez', 'Díaz', 'Masculino', '33333333', '2000-11-10', '977333444', 'Ca. Las Flores 789', 'Santa Anita'),
(4, 8, 'Lucía', 'Fernández', 'Ruiz', 'Femenino', '44444444', '1995-02-28', '966444555', 'Av. Sol 321', 'La Molina'),
(5, 9, 'Luis', 'Torres', 'Mendoza', 'Masculino', '55555555', '1978-07-07', '955555666', 'Jr. Amazonas 654', 'San Luis'),
(6, 10, 'Ana', 'Vargas', 'Sánchez', 'Femenino', '66666666', '2010-09-12', '944666777', 'Pasaje Luna 987', 'Ate');

-- El Médico 1 (idmedico 1) será el principal
INSERT INTO medico (idmedico, idusuario, nombre, apellidoP, apellidoM, dni, idespecialidad, disponible) VALUES
(1, 2, 'Roberto', 'Sánchez', 'Paz', '88888888', 1, 1),
(2, 4, 'Laura', 'García', 'Ríos', '99999999', 2, 1),
(3, 5, 'Miguel', 'Salas', 'Vega', '77777777', 3, 1);

-- ==========================================================
-- 4. RELACIONES INSTITUCIONALES (Consultorio <-> Posta <-> Médico)
-- ==========================================================

-- Asignamos los 6 consultorios a la Posta 1 (Ate)
INSERT INTO consultorio_posta (idconsultorio_posta, idconsultorio, idposta, disponible) VALUES
(1, 1, 1, 1), (2, 2, 1, 1), (3, 3, 1, 1),
(4, 4, 1, 1), (5, 5, 1, 1), (6, 6, 1, 1);

-- Asignamos médicos a los consultorios de la Posta 1
-- Médico 1 (Roberto, Medicina General) tiene mucha actividad aquí
INSERT INTO medico_consultorio_posta (idmedconposta, idmedico, idconsultorio_posta, disponible) VALUES
(1, 1, 1, 1), 
(2, 2, 2, 1),
(3, 3, 3, 1);

-- ==========================================================
-- 5. HISTORIAL Y ANTECEDENTES (Concentrado en Paciente 1)
-- ==========================================================

INSERT INTO antecedentes (idantecedentes, idpaciente, fecha_creacion) VALUES
(1, 1, '2024-01-15'), (2, 2, '2025-05-20'), (3, 3, '2025-08-10'),
(4, 4, '2025-10-05'), (5, 5, '2026-01-12'), (6, 6, '2026-02-01');

INSERT INTO alergia_historia (idantecedentes, idalergia) VALUES
(1, 1), (1, 3), (2, 2), (3, 5), (4, 4), (5, 6);

INSERT INTO enfermedad_historia (idantecedentes, idenfermedad) VALUES
(1, 3), (1, 4), (2, 6), (4, 5), (5, 1), (6, 2);

-- ==========================================================
-- 6. PROGRAMACIÓN Y CITAS (Actividad para Médico 1 y Paciente 1)
-- ==========================================================

-- Programaciones de citas para el Médico 1 (idmedconposta = 1)
INSERT INTO programacion_cita (idprogramacion_cita, idmedconposta, idhorario, fecha, cupos_totales, cupos_disponibles) VALUES
(1, 1, 1, CURDATE(), 10, 8),              -- Hoy, turno 1 (2 ocupados)
(2, 1, 2, CURDATE(), 10, 10),             -- Hoy, turno 2
(3, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 10, 9), -- Mañana, turno 1 (1 ocupado)
(4, 1, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 10, 10),
(5, 2, 1, CURDATE(), 5, 5),               -- Programación para otro médico (Pediatra)
(6, 3, 4, CURDATE(), 8, 8);               -- Programación para otro médico (Odontólogo)

-- Citas (El Paciente 1 interactúa mucho con el Médico 1)
INSERT INTO cita (idcita, idpaciente, idmedico, idprogramacion_cita, motivo, fecha, estado, consultorio, num_cupo, hora_aprox, triaje) VALUES
(1, 1, 1, 1, 'Dolor de cabeza severo', CURDATE(), 'Atendido', 'Medicina General', 1, '08:00:00', 'Presión 140/90, Temp 37.5'),
(2, 2, 1, 1, 'Malestar general', CURDATE(), 'En espera', 'Medicina General', 2, '08:12:00', 'Pendiente'),
(3, 1, 1, 3, 'Control de presión', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'En espera', 'Medicina General', 1, '08:00:00', 'Pendiente'),
(4, 3, 2, 5, 'Fiebre infantil', CURDATE(), 'En espera', 'Pediatría', 1, '08:00:00', 'Temp 39.0'),
(5, 4, 3, 6, 'Dolor de muela', CURDATE(), 'En espera', 'Odontología', 1, '14:00:00', 'Pendiente'),
(6, 5, 1, 2, 'Chequeo general', CURDATE(), 'Ausente', 'Medicina General', 1, '10:00:00', 'No se presentó');

-- ==========================================================
-- 7. DIAGNÓSTICOS Y RECETAS (Para las citas atendidas)
-- ==========================================================

-- Diagnóstico para la Cita 1 (Paciente 1 Atendido por Médico 1)
INSERT INTO diagnostico (iddiagnostico, idcita, idenfermedad, observacion) VALUES
(1, 1, 3, 'Paciente presenta pico hipertensivo leve, se recomienda reposo y medicación.'),
(2, 1, 4, 'Migraña tensional asociada a la presión alta.');

-- Recetas para el Diagnóstico 1 y 2
INSERT INTO receta (idreceta, iddiagnostico, idmedicamento, dosis) VALUES
(1, 1, 4, 'Tomar 1 pastilla cada 12 horas por 7 días'),
(2, 2, 1, 'Tomar 1 pastilla en caso de dolor agudo'),
(3, 2, 5, 'Aplicar 1 inyección si el dolor no cede en 24h');