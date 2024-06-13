
INSERT INTO Usuario (nombre, telefono, correo, idSupervisor, departamento, urlFoto, rol,meta) 
VALUES 
    ('Lauren Llauradó', '521234567890', 'a01754196@tec.mx', NULL, 'Aclaraciones', 'url_foto_yo.jpg', 'supervisor',10);

INSERT INTO Usuario (nombre, telefono, correo, idSupervisor, departamento, urlFoto, rol,meta) 
VALUES 
    ('Carlos Sanchez', '554938382222', 'A01747433@tec.mx',  1, 'Compras', 'url_foto_yo.jpg', 'agente',NULL),
    ('Alan Alcántara', '520123456789', 'a01753505@tec.mx',1, 'Aclaraciones', 'url_foto_yo.jpg', 'agente',NULL),
    ('Rosa Figueroa', '521234567890', 'a01748086@tec.mx',  1, 'Aclaraciones', 'url_foto_yo.jpg', 'agente',NULL),
    ('Luis Landeros', '52132645870', 'a01754196@itesm.mx',  1, 'Aclaraciones','url_foto_yo.jpg', 'agente',NULL),
    ('Gustabo Sanchez', '521234567890', 'A01747433@itesm.mx', 1, 'Aclaraciones', 'url_foto_yo.jpg', 'agente',NULL);
    
INSERT INTO AreaOportunidad(nombre) 
VALUES 
	("Escucha Activa"),
	("Manejo de emociones"),
	("Atencion técnica"),
	("Comunicación técnica"),
	("Administracion de tiempo");
    

INSERT INTO Curso(nombre,url,descripcion)
VALUES
	('Escucha Activa','www.escuchaActiva.com','curso para mejorar la escucha activa'),
	('Escucha Activa2','www.escuchaActiva/segunda.com','curso para mejorar la escucha activa'),
	('Emociones','www.escuchaActiva/segunda.com','curso para mejorar la escucha activa'),
	('Emociones 2','www.emociones/segunda.com','curso para mejorar las emociones'),
	('Atención técnica','www.atTecn.com','curso para mejorar la atencion tecnica'),
	('Atención técnica 2','www.atTecn/segunda.com','curso para mejorar la atencion tecnica');
    
Insert Into CursoArea(idCurso,idArea)
values
(1,1),(2,1),(3,2),(4,2),(5,3),(6,3);

INSERT Cliente(nombre,correo,password,telefono)
values
("Andres","andresito@ivan.com","1234","55434939"),
("Gustabo","gustabo@valdez.com","1234","55323234"),
("Alan","alan@alcantara.com","1234","5532324"),
("Ares","ares@ivan.com","1234","5532323");

INSERT Cuenta(idCliente)
Values (1),(2),(3),(4),(1),(2),(3),(4);

INSERT Tarjeta(numCuenta,saldo,idCuenta,tipo)
VALUES
	(1,121323, 1, "Ahorro"),
    (2,454545, 1, "Ahorro"),
    (3,43435, 3, "Ahorro"),
    (4,76765, 5, "Ahorro"),
    (5,987653, 7, "Ahorro"),
    (6,15432, 4, "Ahorro"),
    (7,53435, 2, "Ahorro"),
    (8,535643, 6, "Ahorro"),
    (9,324234, 8, "Ahorro"),
    (10,779765, 1, "Ahorro"),
    (11,466544, 3, "Ahorro"),
    (12,665443, 5, "Ahorro"),
    (13,98665, 7, "Ahorro"),
    (14,43464, 4, "Ahorro"),
    (15,653333, 2, "Ahorro");
    
INSERT INTO Transaccion (fecha, detalle, estatus, monto, numCuenta, nombre)
VALUES
    ("2024-05-10", "movimiento", "Normal", 712, 1, "Netflix"),
    ("2024-05-11", "transferencia", "Pendiente", 285, 2, "Spotify"),
    ("2024-05-12", "mensualidad", "Solucionado", 430, 3, "Oxxo"),
    ("2024-05-13", "pago de servicio", "Normal", 548, 4, "Netflix"),
    ("2024-05-14", "movimiento", "Pendiente", 323, 5, "Spotify"),
    ("2024-05-08", "transferencia", "Solucionado", 189, 6, "Oxxo"),
    ("2024-05-09", "mensualidad", "Normal", 822, 7, "Netflix"),
    ("2024-05-10", "pago de servicio", "Pendiente", 514, 8, "Spotify"),
    ("2024-05-11", "movimiento", "Solucionado", 367, 9, "Oxxo"),
    ("2024-05-12", "transferencia", "Normal", 170, 10, "Netflix"),
    ("2024-05-13", "mensualidad", "Pendiente", 931, 11, "Spotify"),
    ("2024-05-14", "pago de servicio", "Solucionado", 245, 12, "Oxxo"),
    ("2024-05-08", "movimiento", "Normal", 497, 13, "Netflix"),
    ("2024-05-09", "transferencia", "Pendiente", 659, 14, "Spotify"),
    ("2024-05-10", "mensualidad", "Solucionado", 368, 15, "Oxxo");


INSERT INTO Llamada (fechaInicio, fechaFin, problemaResuelto, idUsuario, idTransaccion, sentimiento, nivelSatisfaccion, tema, motivo, urlTranscripcion, contactId) VALUES
(NOW(), NULL, NULL, 2, 10, 'POSITIVE', 7,'Transacción desconocida', 'Motivo 8', NULL, NULL),
(NOW(), NULL, NULL, 4, 10, 'POSITIVE', 7, 'Transacción desconocida', 'Motivo 8', NULL, NULL),
('2024-06-13 09:00:00', '2024-06-12 09:30:00', 1, 5, 1, 'NEUTRAL', 5, 'Quejas', 'Motivo 1', 'http://transcripcion1.com',NULL),
('2024-06-13 10:00:00', '2024-06-12 10:15:00', 0, 5, 2, 'POSITIVO', 3, 'Reclamaciones', 'Motivo 2', 'http://transcripcion2.com', NULL),
('2024-06-13 11:00:00', '2024-06-12 11:45:00', 1, 5, 3, 'NEGATIVO', 2, 'Transacción desconocida', 'Motivo 3', 'http://transcripcion3.com', NULL),
('2024-06-13 12:00:00', '2024-06-12 12:30:00', 0, 5, 4, 'NEUTRAL', 5, 'Quejas', 'Motivo 4', 'http://transcripcion4.com', NULL),
('2024-06-13 13:00:00', '2024-06-12 13:20:00', 1, 5, 5, 'POSITIVO', 3, 'Reclamaciones', 'Motivo 5', 'http://transcripcion5.com', NULL),
('2024-06-13 14:00:00', '2024-06-12 14:35:00', 0, 5, 6, 'NEGATIVO', 3, 'Transacción desconocida', 'Motivo 6', 'http://transcripcion6.com', NULL),
('2024-06-13 15:00:00', '2024-06-12 15:50:00', 1, 5, 7, 'NEUTRAL', 3, 'Quejas', 'Motivo 7', 'http://transcripcion7.com', NULL),
('2024-06-13 16:00:00', '2024-06-12 16:10:00', 0, 5, 8, 'POSITIVO', 5, 'Reclamaciones', 'Motivo 8', 'http://transcripcion8.com',NULL),
('2024-06-13 09:00:00', '2024-06-12 09:45:00', 1, 5, 9, 'NEGATIVO', 1, 'Transacción desconocida', 'Motivo 9', 'http://transcripcion9.com', NULL),
('2024-06-13 10:00:00', '2024-06-12 10:30:00', 0, 6, 10, 'NEUTRAL', 4, 'Quejas', 'Motivo 10', 'http://transcripcion10.com', NULL),
('2024-06-13 11:00:00', '2024-06-12 11:25:00', 1, 6, 1, 'POSITIVO', 4, 'Reclamaciones', 'Motivo 11', 'http://transcripcion11.com', NULL),
('2024-06-13 12:00:00', '2024-06-12 12:50:00', 0, 6, 2, 'NEGATIVO', 2, 'Transacción desconocida', 'Motivo 12', 'http://transcripcion12.com', NULL),
('2024-06-13 13:00:00', '2024-06-12 13:15:00', 1, 6, 3, 'NEUTRAL', 5, 'Quejas', 'Motivo 13', 'http://transcripcion13.com',NULL),
('2024-06-13 14:00:00', '2024-06-12 14:40:00', 0, 6, 4, 'POSITIVO', 3, 'Reclamaciones', 'Motivo 14', 'http://transcripcion14.com', NULL),
('2024-06-13 15:00:00', '2024-06-12 15:55:00', 1, 6, 5, 'NEGATIVO', 3, 'Transacción desconocida', 'Motivo 15', 'http://transcripcion15.com', NULL),
('2024-06-13 16:00:00', '2024-06-12 16:25:00', 0, 6, 6, 'NEUTRAL', 2, 'Quejas', 'Motivo 16', 'http://transcripcion16.com', NULL),
('2024-06-13 09:00:00', '2024-06-12 09:35:00', 1, 6, 7, 'POSITIVO', 4, 'Reclamaciones', 'Motivo 17', 'http://transcripcion17.com', NULL),
('2024-06-13 10:00:00', '2024-06-12 10:20:00', 0, 6, 8, 'NEGATIVO', 1, 'Transacción desconocida', 'Motivo 18', 'http://transcripcion18.com', NULL),
('2024-06-13 11:00:00', '2024-06-12 11:45:00', 1, 6, 9, 'NEUTRAL', 4, 'Quejas', 'Motivo 19', 'http://transcripcion19.com', NULL),
('2024-06-13 12:00:00', '2024-06-12 12:30:00', 0, 6, 10, 'POSITIVO', 4, 'Reclamaciones', 'Motivo 20', 'http://transcripcion20.com', NULL);

    
INSERT INTO Notificacion(idUsuario,contenido,fechaHora,completada)
VALUES
(1,"1.1 Agendado","2024-05-16 14:45:22",0),
(1,"Advertencia","2024-08-12 14:45:22",0);






 
