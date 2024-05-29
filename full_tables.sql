
INSERT INTO Usuario (idConnect, nombre, telefono, correo, password, idSupervisor, departamento, urlFoto, rol) 
VALUES 
    ('IDC124', 'Juan Martínez', '987654321', 'juan.martinez@empresa.com', 'password456', NULL, 'Ventas', 'url_foto_juanmartinez.jpg', 'supervisor'),
    ('IDC125', 'María López', '456789123', 'maria.lopez@empresa.com', 'password789', NULL, 'Soporte', 'url_foto_marialopez.jpg', 'supervisor'),
    ('IDC126', 'Carlos Rodríguez', '741852963', 'carlos.rodriguez@empresa.com', 'passwordabc', NULL, 'Ventas', 'url_foto_carlosrodriguez.jpg', 'supervisor'),
    ('IDC127', 'Luisa Pérez', '852963741', 'luisa.perez@empresa.com', 'passworddef', NULL, 'Soporte', 'url_foto_luisaperez.jpg', 'supervisor'),
    ('IDC128', 'Pedro Sánchez', '369258147', 'pedro.sanchez@empresa.com', 'passwordghi', NULL, 'Quejas', 'url_foto_pedrosanchez.jpg', 'supervisor'),
    ('IDC129', 'Elena Gómez', '159263478', 'elena.gomez@empresa.com', 'passwordjkl', NULL, 'Ventas', 'url_foto_elenagomez.jpg', 'supervisor'),
    ('IDC130', 'Miguel Fernández', '258147369', 'miguel.fernandez@empresa.com', 'passwordmno', NULL, 'Soporte', 'url_foto_miguelfernandez.jpg', 'supervisor'),
    ('IDC131', 'Sofía Martínez', '147258369', 'sofia.martinez@empresa.com', 'passwordpqr', NULL, 'Quejas', 'url_foto_sofiamartinez.jpg', 'supervisor'),
    ('IDC132', 'Javier González', '369147258', 'javier.gonzalez@empresa.com', 'passwordstu', NULL, 'Soporte', 'url_foto_javiergonzalez.jpg', 'supervisor'),
    ('IDC133', 'Laura Díaz', '852369147', 'laura.diaz@empresa.com', 'passwordvwx', NULL, 'Ventas', 'url_foto_lauradiaz.jpg', 'supervisor');

INSERT INTO Usuario (idConnect, nombre, telefono, correo, password, idSupervisor, departamento, urlFoto, rol) 
VALUES 
    ('IDC124', 'Juan Martínez', '987654321', 'juan@example.com', 'password456', 1, 'Ventas', 'url_foto_juanmartinez.jpg', 'agente'),
    ('IDC125', 'María López', '456789123', 'maria@example.com', 'password789', 7, 'Soporte', 'url_foto_marialopez.jpg', 'agente'),
    ('IDC126', 'Carlos Rodríguez', '741852963', 'carlos@example.com', 'passwordabc', 3, 'Quejas', 'url_foto_carlosrodriguez.jpg', 'agente'),
    ('IDC127', 'Luisa Pérez', '852963741', 'luisa@example.com', 'passworddef', 5, 'Ventas', 'url_foto_luisaperez.jpg', 'agente'),
    ('IDC128', 'Pedro Sánchez', '369258147', 'pedro@example.com', 'passwordghi', 9, 'Soporte', 'url_foto_pedrosanchez.jpg', 'agente'),
    ('IDC129', 'Elena Gómez', '159263478', 'elena@example.com', 'passwordjkl', 2, 'Quejas', 'url_foto_elenagomez.jpg', 'agente'),
    ('IDC130', 'Miguel Fernández', '258147369', 'miguel@example.com', 'passwordmno', 8, 'Ventas', 'url_foto_miguelfernandez.jpg', 'agente'),
    ('IDC131', 'Sofía Martínez', '147258369', 'sofia@example.com', 'passwordpqr', 4, 'Soporte', 'url_foto_sofiamartinez.jpg', 'agente'),
    ('IDC132', 'Javier González', '369147258', 'javier@example.com', 'passwordstu', 6, 'Quejas', 'url_foto_javiergonzalez.jpg', 'agente'),
    ('IDC133', 'Laura Díaz', '852369147', 'laura@example.com', 'passwordvwx', 10, 'Ventas', 'url_foto_lauradiaz.jpg', 'agente'),
    ('IDC134', 'Ana García', '123456789', 'ana@example.com', 'password123', 7, 'Soporte', 'url_foto_anagarcia.jpg', 'agente'),
    ('IDC135', 'David Martínez', '987654321', 'david@example.com', 'password234', 9, 'Ventas', 'url_foto_davidmartinez.jpg', 'agente'),
    ('IDC136', 'Lucía Rodríguez', '456789123', 'lucia@example.com', 'password345', 2, 'Quejas', 'url_foto_luciarodriguez.jpg', 'agente'),
    ('IDC137', 'Diego López', '741852963', 'diego@example.com', 'password456', 4, 'Soporte', 'url_foto_diegolopez.jpg', 'agente'),
    ('IDC138', 'Marta Pérez', '852963741', 'marta@example.com', 'password567', 6, 'Ventas', 'url_foto_martaperez.jpg', 'agente'),
    ('IDC139', 'Javier Sánchez', '369258147', 'javier.sanchez@example.com', 'password678', 1, 'Quejas', 'url_foto_javiersanchez.jpg', 'agente'),
    ('IDC140', 'Sara Gómez', '159263478', 'sara@example.com', 'password789', 3, 'Ventas', 'url_foto_saragomez.jpg', 'agente'),
    ('IDC141', 'Marcos Fernández', '258147369', 'marcos@example.com', 'password890', 5, 'Soporte', 'url_foto_marcosfernandez.jpg', 'agente'),
    ('IDC142', 'Eva Martínez', '147258369', 'eva@example.com', 'password901', 8, 'Ventas', 'url_foto_evamartinez.jpg', 'agente'),
    ('IDC143', 'Alberto González', '369147258', 'alberto.gonzalez@empresa.com', 'password012', 5, 'Soporte', 'url_foto_albertogonzalez.jpg', 'agente'),
    ('IDC144', 'Carmen Díaz', '852369147', 'carmen.diaz@empresa.com', 'password123', 8, 'Ventas', 'url_foto_carmendiaz.jpg', 'agente'),
    ('IDC145', 'Pablo García', '123456789', 'pablo.garcia@empresa.com', 'password234', 6, 'Quejas', 'url_foto_pablogarcia.jpg', 'agente'),
    ('IDC146', 'Alba Martín', '987654321', 'alba.martin@empresa.com', 'password345', 4, 'Soporte', 'url_foto_albamartin.jpg', 'agente'),
    ('IDC147', 'Adrián Ruiz', '456789123', 'adrian.ruiz@empresa.com', 'password456', 7, 'Ventas', 'url_foto_adrianruiz.jpg', 'agente'),
    ('IDC148', 'Cristina López', '741852963', 'cristina.lopez@empresa.com', 'password567', 2, 'Soporte', 'url_foto_cristinalopez.jpg', 'agente'),
    ('IDC149', 'Daniel Torres', '852963741', 'daniel.torres@empresa.com', 'password678', 9, 'Quejas', 'url_foto_danieltorres.jpg', 'agente'),
    ('IDC150', 'Rocío Fernández', '369258147', 'rocio.fernandez@empresa.com', 'password789', 3, 'Ventas', 'url_foto_rociofernandez.jpg', 'agente'),
    ('IDC151', 'Isabel Martínez', '159263478', 'isabel.martinez@empresa.com', 'password890', 1, 'Soporte', 'url_foto_isabelmartinez.jpg', 'agente'),
    ('IDC152', 'Rubén González', '258147369', 'ruben.gonzalez@empresa.com', 'password901', 8, 'Ventas', 'url_foto_rubengonzalez.jpg', 'agente'),
    ('IDC153', 'Natalia García', '147258369', 'natalia.garcia@empresa.com', 'password012', 10, 'Quejas', 'url_foto_nataliagarcia.jpg', 'agente'),
    ('IDC154', 'Víctor Sánchez', '369147258', 'victor.sanchez@empresa.com', 'password123', 5, 'Soporte', 'url_foto_victorsanchez.jpg', 'agente'),
    ('IDC155', 'Celia Díaz', '852369147', 'celia.diaz@empresa.com', 'password234', 7, 'Ventas', 'url_foto_celiadiaz.jpg', 'agente'),
    ('IDC156', 'Gonzalo Martínez', '123456789', 'gonzalo.martinez@empresa.com', 'password345', 4, 'Quejas', 'url_foto_gonzalomartinez.jpg', 'agente'),
    ('IDC157', 'Laura García', '987654321', 'laura.garcia@empresa.com', 'password456', 9, 'Soporte', 'url_foto_lauragarcia.jpg', 'agente'),
    ('IDC158', 'Sergio Fernández', '456789123', 'sergio.fernandez@empresa.com', 'password567', 2, 'Ventas', 'url_foto_sergiofernandez.jpg', 'agente'),
    ('IDC159', 'Irene Ruiz', '741852963', 'irene.ruiz@empresa.com', 'password678', 6, 'Soporte', 'url_foto_ireneruiz.jpg', 'agente'),
    ('IDC160', 'Raúl López', '852963741', 'raul.lopez@empresa.com', 'password789', 8, 'Ventas', 'url_foto_raullopez.jpg', 'agente'),
    ('IDC161', 'Marta Martín', '369258147', 'marta.martin@empresa.com', 'password890', 3, 'Quejas', 'url_foto_martamartin.jpg', 'agente'),
    ('IDC162', 'Alejandro García', '159263478', 'alejandro.garcia@empresa.com', 'password901', 5, 'Soporte', 'url_foto_alejandrogarcia.jpg', 'agente'),
    ('IDC163', 'Carmen Pérez', '258147369', 'carmen.perez@empresa.com', 'password012', 10, 'Ventas', 'url_foto_carmenperez.jpg', 'agente'),
    ('IDC164', 'Pablo Martínez', '147258369', 'pablo.martinez@empresa.com', 'password123', 1, 'Soporte', 'url_foto_pablomartinez.jpg', 'agente'),
    ('IDC165', 'Elena González', '369147258', 'elena.gonzalez@empresa.com', 'password234', 7, 'Quejas', 'url_foto_elenagonzalez.jpg', 'agente'),
    ('IDC166', 'Daniel Sánchez', '852369147', 'daniel.sanchez@empresa.com', 'password345', 4, 'Ventas', 'url_foto_danielsanchez.jpg', 'agente'),
    ('IDC167', 'Alba López', '123456789', 'alba.lopez@empresa.com', 'password456', 9, 'Soporte', 'url_foto_albalopez.jpg', 'agente'),
    ('IDC168', 'Javier Martínez', '987654321', 'javier.martinez@empresa.com', 'password567', 2, 'Ventas', 'url_foto_javiermartinez.jpg', 'agente'),
    ('IDC169', 'Andrea García', '456789123', 'andrea.garcia@empresa.com', 'password678', 8, 'Quejas', 'url_foto_andreagarcia.jpg', 'agente'),
    ('IDC181', 'Pablo López', '741852963', 'pablo.lopez@empresa.com', 'password890', 8, 'Ventas', 'url_foto_pablolopez.jpg', 'agente'),
    ('IDC182', 'Sandra Rodríguez', '852963741', 'sandra.rodriguez@empresa.com', 'password901', 3, 'Soporte', 'url_foto_sandrarodriguez.jpg', 'agente'),
    ('IDC183', 'Javier Martín', '369258147', 'javier.martin@empresa.com', 'password012', 9, 'Quejas', 'url_foto_javiermartin.jpg', 'agente'),
    ('IDC184', 'Lucía Sánchez', '159263478', 'lucia.sanchez@empresa.com', 'password123', 6, 'Ventas', 'url_foto_luciasanchez.jpg', 'agente'),
    ('IDC185', 'Diego González', '258147369', 'diego.gonzalez@empresa.com', 'password234', 2, 'Soporte', 'url_foto_diegogonzalez.jpg', 'agente'),
    ('IDC186', 'Laura Martínez', '147258369', 'laura.martinez@empresa.com', 'password345', 7, 'Ventas', 'url_foto_lauramartinez.jpg', 'agente'),
    ('IDC187', 'Adrián Pérez', '369147258', 'adrian.perez@empresa.com', 'password456', 4, 'Quejas', 'url_foto_adrianperez.jpg', 'agente'),
    ('IDC188', 'Sara Martín', '852369147', 'sara.martin@empresa.com', 'password567', 1, 'Soporte', 'url_foto_saramartin.jpg', 'agente'),
    ('IDC189', 'Carlos Sánchez', '123456789', 'carlos.sanchez@empresa.com', 'password678', 8, 'Ventas', 'url_foto_carlossanchez.jpg', 'agente'),
    ('IDC190', 'Carmen García', '987654321', 'carmen.garcia@empresa.com', 'password789', 5, 'Soporte', 'url_foto_carmengarcia.jpg', 'agente'),
    ('IDC191', 'Daniel Martínez', '456789123', 'daniel.martinez@empresa.com', 'password890', 9, 'Ventas', 'url_foto_danielmartinez.jpg', 'agente'),
    ('IDC192', 'María Rodríguez', '741852963', 'maria.rodriguez@empresa.com', 'password901', 6, 'Quejas', 'url_foto_mariarodriguez.jpg', 'agente'),
    ('IDC193', 'Manuel López', '852963741', 'manuel.lopez@empresa.com', 'password012', 2, 'Soporte', 'url_foto_manuellopez.jpg', 'agente'),
    ('IDC194', 'Laura Sánchez', '369258147', 'laura.sanchez@empresa.com', 'password123', 10, 'Ventas', 'url_foto_laurasanchez.jpg', 'agente'),
    ('IDC195', 'Alejandro Martínez', '159263478', 'alejandro.martinez@empresa.com', 'password234', 3, 'Soporte', 'url_foto_alejandromartinez.jpg', 'agente'),
    ('IDC196', 'Cristina González', '258147369', 'cristina.gonzalez@empresa.com', 'password345', 7, 'Quejas', 'url_foto_cristinagonzalez.jpg', 'agente'),
    ('IDC197', 'Sergio Rodríguez', '147258369', 'sergio.rodriguez@empresa.com', 'password456', 4, 'Ventas', 'url_foto_serigrodriguez.jpg', 'agente'),
    ('IDC198', 'Marta López', '369147258', 'marta.lopez@empresa.com', 'password567', 8, 'Soporte', 'url_foto_martalopez.jpg', 'agente'),
    ('IDC199', 'Javier Sánchez', '852369147', 'javier.sanchez@empresa.com', 'password678', 1, 'Ventas', 'url_foto_javiersanchez.jpg', 'agente'),
    ('IDC200', 'Andrea Martínez', '123456789', 'andrea.martinez@empresa.com', 'password789', 6, 'Quejas', 'url_foto_andreamartinez.jpg', 'agente');
    
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

INSERT INTO Llamada (fechaInicio, fechaFin, problemaResuelto, idUsuario, idTransaccion, sentimiento, motivo, urlTranscripcion, tema)
VALUES
    ("2024-05-06 19:45:12", NULL, NULL, 29, 7, "Positivo", NULL, NULL, NULL),
    ("2024-05-09 14:20:51", "2024-05-09 15:30:45", 0, 53, 12, "Neutral", "transaccion no reconocida", "./url/transc02", "Aclaracion"),
    ("2024-05-05 22:10:37", "2024-05-05 23:45:19", 1, 36, 9, "Positivo", "cargo extra", "./url/transc03", "Aclaracion"),
    ("2024-05-08 16:55:28", NULL, NULL, 63, 6, "Negativo", NULL, NULL, NULL),
    ("2024-05-09 12:40:05", "2024-05-09 14:15:34", 0, 45, 3, "Neutral", "transaccion no reconocida", "./url/transc04", "Aclaracion"),
    ("2024-05-07 20:30:59", "2024-05-07 22:10:48", 1, 18, 14, "Positivo", "cargo extra", "./url/transc05", "Aclaracion"),
    ("2024-05-09 07:15:22", NULL, NULL, 27, 5, "Neutral", NULL, NULL, NULL),
    ("2024-05-08 09:50:41", "2024-05-08 11:25:33", 0, 59, 2, "Positivo", "transaccion no reconocida", "./url/transc06", "Aclaracion"),
    ("2024-05-05 23:55:18", "2024-05-06 01:35:07", 1, 68, 11, "Negativo", "cargo extra", "./url/transc07", "Aclaracion"),
    ("2024-05-07 15:30:03", NULL, NULL, 43, 8, "Neutral", NULL, NULL, NULL),
    ("2024-05-06 12:20:37", "2024-05-06 14:05:19", 0, 22, 13, "Positivo", "transaccion no reconocida", "./url/transc08", "Aclaracion"),
    ("2024-05-10 18:40:22", "2024-05-10 20:20:15", 1, 74, 1, "Negativo", "cargo extra", "./url/transc09", "Aclaracion"),
    ("2024-05-08 14:10:45", NULL, NULL, 31, 10, "Neutral", NULL, NULL, NULL),
    ("2024-05-10 06:35:14", "2024-05-10 07:55:03", 1, 12, 8, "Negativo", "cargo extra", "./url/transc15", "Aclaracion"),
    ("2024-05-09 20:15:28", NULL, NULL, 42, 5, "Neutral", NULL, NULL, NULL),
    ("2024-05-07 17:40:51", "2024-05-07 19:25:39", 0, 61, 15, "Positivo", "transaccion no reconocida", "./url/transc16", "Aclaracion"),
    ("2024-05-06 11:20:37", "2024-05-06 12:55:28", 1, 28, 2, "Negativo", "cargo extra", "./url/transc17", "Aclaracion"),
    ("2024-05-10 14:45:22", NULL, NULL, 51, 9, "Neutral", NULL, NULL, NULL),
	("2024-05-06 19:45:12",NULL , NULL, 11, 7, "Positivo", NULL, NULL, NULL),
    ("2024-05-06 19:45:12",NULL , NULL, 26, 7, "Negativo", NULL, NULL, NULL),
    ("2024-05-06 19:45:12",NULL , NULL, 38, 7, "Neutral", NULL, NULL, NULL);

    
INSERT INTO Notificacion(idUsuario,contenido,fechaHora,completada)
VALUES
(1,"1.1 Agendado","2024-05-16 14:45:22",0),
(1,"Advertencia","2024-08-12 14:45:22",0);







 
