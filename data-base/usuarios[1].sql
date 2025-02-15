-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 13-02-2025 a las 22:25:14
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `start.iot`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `fk_activo` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `fk_usuario_activo` (`fk_activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_activo` FOREIGN KEY (`fk_activo`) REFERENCES `activos` (`id_activo`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


/*PARA LA TABLA DE PRODUCTOS */;

CREATE TABLE productos (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion TEXT,
    categoria VARCHAR(100),
    activo VARCHAR(255),
    precio DECIMAL(10,2),
    img VARCHAR(500),
    especificaciones TEXT,
    compatible VARCHAR(255)
);

/*PARA LA TABLA DE PRODUCTOS */;
INSERT INTO productos (id, nombre, descripcion, categoria, activo, precio, img, especificaciones, compatible) VALUES
('STRT1', 'MEITRACK P88L', 'Mini rastreador personal, ideal para personas.', 'GPS', 'Personas', 721067.01, 'https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738307015/STRT1.IMAGEN.061611_xekhkg.png', '0 A 30 V, IP68, Compacto, Ligero, Resistente', 'No compatible'),
('STRT2', 'PIONNER X101', 'Alertas encendido/apagado y desconexión.', 'GPS', 'Camion', 332800.4, 'https://res.cloudinary.com/dsr4y9xyl/image/upload/v1739267693/5_rdykay.png', 'Alertas, Compacto, GPS, Desconexión, Fácil', ''),
('STRT3', 'GPS VT08F', 'Rastreador para motocicletas, GSM y GPS.', 'GPS', 'Carro, Moto, Camion', 153051.14, 'https://res.cloudinary.com/dsr4y9xyl/image/upload/v1738307011/STRT3.IMAGEN.055928_aprt3t.png', 'GSM, GPS, Motocicletas, Compacto, Rastreo', 'STRT9, STRT10');
