USE posta;

-- ==========================================================
-- 1. PROCEDIMIENTOS ALMACENADOS
-- ==========================================================

DROP PROCEDURE IF EXISTS `actualizarPostaYConsultorios`;
CREATE PROCEDURE `actualizarPostaYConsultorios`(
    IN p_idposta INT,
    IN p_nombre VARCHAR(100),
    IN p_ciudad VARCHAR(50),
    IN p_direccion VARCHAR(255),
    IN p_telefono VARCHAR(9),
    IN p_estado TINYINT(1),
    IN p_consultorios JSON,
    IN p_nuevos_consultorios JSON
)
BEGIN
    DECLARE idx INT DEFAULT 0;
    DECLARE total INT DEFAULT 0;
    DECLARE v_idconsultorio INT;
    DECLARE v_disponible TINYINT(1);

    UPDATE posta
    SET nombre = p_nombre,
        ciudad = p_ciudad,
        direccion = p_direccion,
        telefono = p_telefono,
        disponible = p_estado
    WHERE idposta = p_idposta;

    IF p_consultorios IS NOT NULL THEN
        SET total = JSON_LENGTH(p_consultorios);
        WHILE idx < total DO
            SET v_idconsultorio = JSON_VALUE(JSON_EXTRACT(p_consultorios, CONCAT('$[', idx, ']')), '$.idconsultorio');
            SET v_disponible = JSON_VALUE(JSON_EXTRACT(p_consultorios, CONCAT('$[', idx, ']')), '$.disponible');

            UPDATE consultorio_posta
            SET disponible = v_disponible
            WHERE idposta = p_idposta AND idconsultorio = v_idconsultorio;
            SET idx = idx + 1;
        END WHILE;
    END IF;

    SET idx = 0;
    IF p_nuevos_consultorios IS NOT NULL THEN
        SET total = JSON_LENGTH(p_nuevos_consultorios);
        WHILE idx < total DO
            SET v_idconsultorio = JSON_VALUE(JSON_EXTRACT(p_nuevos_consultorios, CONCAT('$[', idx, ']')), '$');
            INSERT INTO consultorio_posta (idposta, idconsultorio, disponible)
            VALUES (p_idposta, v_idconsultorio, 1);
            SET idx = idx + 1;
        END WHILE;
    END IF;
END;

DROP PROCEDURE IF EXISTS sp_insertar_medico;
CREATE PROCEDURE sp_insertar_medico (
    IN i_correo VARCHAR(100),
    IN i_contrasenia VARCHAR(100),
    IN i_nombre VARCHAR(50),
    IN i_apellidoP VARCHAR(20),
    IN i_apellidoM VARCHAR(20),
    IN i_dni VARCHAR(8),
    IN i_especialidad VARCHAR(50)
)
BEGIN
    DECLARE existe_correo INT DEFAULT 0;
    DECLARE usuario_id INT DEFAULT 0;
    DECLARE especialidad_id INT DEFAULT 0;

    START TRANSACTION;
    SELECT COUNT(*) INTO existe_correo FROM usuario WHERE correo = i_correo;

    IF existe_correo > 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ingresado ya existe';
    ELSE
        SELECT idespecialidad INTO especialidad_id FROM especialidad WHERE nombre = i_especialidad;
        IF especialidad_id IS NULL OR especialidad_id = 0 THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La especialidad ingresada no existe';
        ELSE
            INSERT INTO usuario (rol, correo, contrasenia)
            VALUES ('Medico', i_correo, i_contrasenia);
            SET usuario_id = LAST_INSERT_ID();

            INSERT INTO medico (idusuario, nombre, apellidoP, apellidoM, dni, idespecialidad)
            VALUES (usuario_id, i_nombre, i_apellidoP, i_apellidoM, i_dni, especialidad_id);
            COMMIT;

            SELECT 'Médico registrado con éxito' AS mensaje, usuario_id, i_correo as correo, i_nombre as nombre, i_apellidoP as apellidoP, i_apellidoM as apellidoM, i_dni as dni, i_especialidad as especialidad;
        END IF;
    END IF;
END;

-- ==========================================================
-- 2. FUNCIONES Y TRIGGERS
-- ==========================================================

DROP FUNCTION IF EXISTS f_calcular_hora_aprox;
CREATE FUNCTION f_calcular_hora_aprox(
    p_num_cupo INT,
    p_idprogramacion_cita INT
) RETURNS TIME
DETERMINISTIC
BEGIN
    DECLARE v_hora_inicio TIME;
    DECLARE v_hora_fin TIME;
    DECLARE v_num_total_cupos INT;
    DECLARE v_intervalo INT;
    DECLARE v_hora_aprox_sec INT;

    SELECT h.hora_inicio, h.hora_fin, pc.cupos_totales
    INTO v_hora_inicio, v_hora_fin, v_num_total_cupos
    FROM programacion_cita pc
    JOIN horario h ON pc.idhorario = h.idhorario
    WHERE pc.idprogramacion_cita = p_idprogramacion_cita
    LIMIT 1;

    IF v_hora_inicio IS NULL OR v_hora_fin IS NULL OR v_num_total_cupos IS NULL OR v_num_total_cupos = 0 THEN
        RETURN NULL;
    END IF;

    SET v_intervalo = (TIME_TO_SEC(v_hora_fin) - TIME_TO_SEC(v_hora_inicio)) / v_num_total_cupos;
    SET v_hora_aprox_sec = TIME_TO_SEC(v_hora_inicio) + ((p_num_cupo - 1) * v_intervalo);
    RETURN SEC_TO_TIME(v_hora_aprox_sec);
END;

DROP TRIGGER IF EXISTS trg_calculate_hora_aprox_before_insert;
CREATE TRIGGER trg_calculate_hora_aprox_before_insert
BEFORE INSERT ON cita
FOR EACH ROW
BEGIN
    SET NEW.hora_aprox = f_calcular_hora_aprox(NEW.num_cupo, NEW.idprogramacion_cita);
END;

DROP TRIGGER IF EXISTS update_cupos_disponibles;
CREATE TRIGGER update_cupos_disponibles
AFTER INSERT ON cita
FOR EACH ROW
BEGIN
  UPDATE programacion_cita
  SET cupos_disponibles = cupos_disponibles - 1
  WHERE idprogramacion_cita = NEW.idprogramacion_cita;
END;