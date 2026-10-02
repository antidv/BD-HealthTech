-- ==========================================================
-- Funciones, Procedimientos y Triggers en PostgreSQL
-- ==========================================================

-- 1. Helper de compatibilidad MySQL DATE_FORMAT
CREATE OR REPLACE FUNCTION DATE_FORMAT(d TIMESTAMP WITH TIME ZONE, fmt TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
    IF fmt = '%d-%m-%Y' THEN
        RETURN TO_CHAR(d, 'DD-MM-YYYY');
    ELSIF fmt = '%Y-%m-%d' THEN
        RETURN TO_CHAR(d, 'YYYY-MM-DD');
    ELSE
        RETURN TO_CHAR(d, 'YYYY-MM-DD');
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION DATE_FORMAT(d DATE, fmt TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
    IF fmt = '%d-%m-%Y' THEN
        RETURN TO_CHAR(d, 'DD-MM-YYYY');
    ELSIF fmt = '%Y-%m-%d' THEN
        RETURN TO_CHAR(d, 'YYYY-MM-DD');
    ELSE
        RETURN TO_CHAR(d, 'YYYY-MM-DD');
    END IF;
END;
$$;

-- 2. Procedimiento para actualizar Posta y Consultorios
DROP PROCEDURE IF EXISTS actualizarPostaYConsultorios;
CREATE OR REPLACE PROCEDURE actualizarPostaYConsultorios(
    p_idposta INT,
    p_nombre VARCHAR(100),
    p_ciudad VARCHAR(50),
    p_direccion VARCHAR(255),
    p_telefono VARCHAR(9),
    p_estado INT,
    p_consultorios JSONB,
    p_nuevos_consultorios JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    elem JSONB;
BEGIN
    UPDATE posta
    SET nombre = p_nombre,
        ciudad = p_ciudad,
        direccion = p_direccion,
        telefono = p_telefono,
        disponible = p_estado
    WHERE idposta = p_idposta;

    IF p_consultorios IS NOT NULL AND jsonb_typeof(p_consultorios) = 'array' THEN
        FOR elem IN SELECT * FROM jsonb_array_elements(p_consultorios)
        LOOP
            UPDATE consultorio_posta
            SET disponible = (elem->>'disponible')::INT
            WHERE idposta = p_idposta AND idconsultorio = (elem->>'idconsultorio')::INT;
        END LOOP;
    END IF;

    IF p_nuevos_consultorios IS NOT NULL AND jsonb_typeof(p_nuevos_consultorios) = 'array' THEN
        FOR elem IN SELECT * FROM jsonb_array_elements(p_nuevos_consultorios)
        LOOP
            INSERT INTO consultorio_posta (idposta, idconsultorio, disponible)
            VALUES (p_idposta, (elem#>>'{}')::INT, 1)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;
END;
$$;

-- 3. Función / Procedimiento para insertar médico
DROP FUNCTION IF EXISTS sp_insertar_medico;
CREATE OR REPLACE FUNCTION sp_insertar_medico(
    i_correo VARCHAR(100),
    i_contrasenia VARCHAR(100),
    i_nombre VARCHAR(50),
    i_apellidoP VARCHAR(20),
    i_apellidoM VARCHAR(20),
    i_dni VARCHAR(8),
    i_especialidad VARCHAR(50)
)
RETURNS TABLE (
    mensaje TEXT,
    usuario_id INT,
    correo VARCHAR(100),
    nombre VARCHAR(50),
    apellidoP VARCHAR(20),
    apellidoM VARCHAR(20),
    dni VARCHAR(8),
    especialidad VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
    existe_correo INT := 0;
    v_usuario_id INT := 0;
    v_especialidad_id INT := 0;
BEGIN
    SELECT COUNT(*) INTO existe_correo FROM usuario u WHERE u.correo = i_correo;
    IF existe_correo > 0 THEN
        RAISE EXCEPTION 'El correo ingresado ya existe' USING ERRCODE = '45000';
    END IF;

    SELECT e.idespecialidad INTO v_especialidad_id FROM especialidad e WHERE e.nombre = i_especialidad LIMIT 1;
    IF v_especialidad_id IS NULL OR v_especialidad_id = 0 THEN
        RAISE EXCEPTION 'La especialidad ingresada no existe' USING ERRCODE = '45000';
    END IF;

    INSERT INTO usuario (rol, correo, contrasenia)
    VALUES ('Medico', i_correo, i_contrasenia)
    RETURNING usuario.idusuario INTO v_usuario_id;

    INSERT INTO medico (idusuario, nombre, apellidoP, apellidoM, dni, idespecialidad)
    VALUES (v_usuario_id, i_nombre, i_apellidoP, i_apellidoM, i_dni, v_especialidad_id);

    RETURN QUERY SELECT
        'Médico registrado con éxito'::TEXT,
        v_usuario_id,
        i_correo,
        i_nombre,
        i_apellidoP,
        i_apellidoM,
        i_dni,
        i_especialidad;
END;
$$;

-- 4. Función para cálculo de hora aproximada
CREATE OR REPLACE FUNCTION f_calcular_hora_aprox(
    p_num_cupo INT,
    p_idprogramacion_cita INT
) RETURNS TIME
LANGUAGE plpgsql
AS $$
DECLARE
    v_hora_inicio TIME;
    v_hora_fin TIME;
    v_num_total_cupos INT;
    v_start_sec INT;
    v_end_sec INT;
    v_intervalo_sec NUMERIC;
    v_hora_aprox_sec INT;
BEGIN
    SELECT h.hora_inicio, h.hora_fin, pc.cupos_totales
    INTO v_hora_inicio, v_hora_fin, v_num_total_cupos
    FROM programacion_cita pc
    JOIN horario h ON pc.idhorario = h.idhorario
    WHERE pc.idprogramacion_cita = p_idprogramacion_cita
    LIMIT 1;

    IF v_hora_inicio IS NULL OR v_hora_fin IS NULL OR v_num_total_cupos IS NULL OR v_num_total_cupos = 0 THEN
        RETURN NULL;
    END IF;

    v_start_sec := EXTRACT(HOUR FROM v_hora_inicio)::INT * 3600 + EXTRACT(MINUTE FROM v_hora_inicio)::INT * 60 + EXTRACT(SECOND FROM v_hora_inicio)::INT;
    v_end_sec := EXTRACT(HOUR FROM v_hora_fin)::INT * 3600 + EXTRACT(MINUTE FROM v_hora_fin)::INT * 60 + EXTRACT(SECOND FROM v_hora_fin)::INT;
    v_intervalo_sec := (v_end_sec - v_start_sec)::NUMERIC / v_num_total_cupos;
    v_hora_aprox_sec := (v_start_sec + ((p_num_cupo - 1) * v_intervalo_sec))::INT;

    RETURN (INTERVAL '1 second' * v_hora_aprox_sec)::TIME;
END;
$$;

-- 5. Triggers
CREATE OR REPLACE FUNCTION fn_trg_calculate_hora_aprox()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.hora_aprox := f_calcular_hora_aprox(NEW.num_cupo, NEW.idprogramacion_cita);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calculate_hora_aprox_before_insert ON cita;
CREATE TRIGGER trg_calculate_hora_aprox_before_insert
BEFORE INSERT ON cita
FOR EACH ROW
EXECUTE FUNCTION fn_trg_calculate_hora_aprox();

CREATE OR REPLACE FUNCTION fn_trg_update_cupos_disponibles()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE programacion_cita
    SET cupos_disponibles = cupos_disponibles - 1
    WHERE idprogramacion_cita = NEW.idprogramacion_cita;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_cupos_disponibles ON cita;
CREATE TRIGGER update_cupos_disponibles
AFTER INSERT ON cita
FOR EACH ROW
EXECUTE FUNCTION fn_trg_update_cupos_disponibles();