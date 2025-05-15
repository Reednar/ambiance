-- --------------------------------------------------------
-- Hôte:                         mysql-ambiance-bdd.alwaysdata.net
-- Version du serveur:           10.11.9-MariaDB - MariaDB Server
-- SE du serveur:                Linux
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour ambiance-bdd_ensitech
CREATE DATABASE IF NOT EXISTS `ambiance-bdd_ensitech` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `ambiance-bdd_ensitech`;

-- Listage de la structure de table ambiance-bdd_ensitech. Categories
CREATE TABLE IF NOT EXISTS `Categories` (
  `IdCategorie` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) NOT NULL,
  PRIMARY KEY (`IdCategorie`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Commentaires
CREATE TABLE IF NOT EXISTS `Commentaires` (
  `IdCommentaire` int(11) NOT NULL AUTO_INCREMENT,
  `Message` text DEFAULT NULL,
  `IdPublication` int(11) NOT NULL,
  `IdUtilisateur` int(11) NOT NULL,
  PRIMARY KEY (`IdCommentaire`),
  KEY `IdPublication` (`IdPublication`),
  KEY `IdUtilisateur` (`IdUtilisateur`),
  CONSTRAINT `Commentaires_ibfk_1` FOREIGN KEY (`IdPublication`) REFERENCES `Publications` (`IdPublication`),
  CONSTRAINT `Commentaires_ibfk_2` FOREIGN KEY (`IdUtilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Discussions
CREATE TABLE IF NOT EXISTS `Discussions` (
  `idDiscussion` int(11) NOT NULL AUTO_INCREMENT,
  `type_discussion` int(11) DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `IdGroupe` int(11) NOT NULL,
  PRIMARY KEY (`idDiscussion`),
  KEY `IdGroupe` (`IdGroupe`),
  CONSTRAINT `Discussions_ibfk_1` FOREIGN KEY (`IdGroupe`) REFERENCES `Groupes` (`IdGroupe`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Ecoles
CREATE TABLE IF NOT EXISTS `Ecoles` (
  `id_ecole` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `site_web` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `contact_email` varchar(255) NOT NULL,
  `type_ecole` enum('publique','privée','autre') NOT NULL,
  `rue` varchar(255) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `code_postal` varchar(20) NOT NULL,
  `id_createur` int(11) NOT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `allowed_domain` text DEFAULT NULL,
  PRIMARY KEY (`id_ecole`),
  KEY `Ecole_ibfk_1` (`id_createur`),
  CONSTRAINT `Ecole_ibfk_1` FOREIGN KEY (`id_createur`) REFERENCES `Utilisateurs` (`IdUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Groupes
CREATE TABLE IF NOT EXISTS `Groupes` (
  `IdGroupe` int(11) NOT NULL AUTO_INCREMENT,
  `NomDuGroupe` varchar(50) NOT NULL,
  `NombrePersonne` smallint(6) DEFAULT NULL,
  `IdPublication` int(11) NOT NULL,
  `date_creation` datetime DEFAULT NULL,
  PRIMARY KEY (`IdGroupe`),
  UNIQUE KEY `UNIQUE_Publication_Groupe` (`IdPublication`),
  CONSTRAINT `Groupes_ibfk_1` FOREIGN KEY (`IdPublication`) REFERENCES `Publications` (`IdPublication`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Images
CREATE TABLE IF NOT EXISTS `Images` (
  `IdImage` int(11) NOT NULL AUTO_INCREMENT,
  `LienImage` blob NOT NULL,
  `IdPublication` int(11) NOT NULL,
  PRIMARY KEY (`IdImage`),
  KEY `IdPublication` (`IdPublication`),
  CONSTRAINT `Images_ibfk_1` FOREIGN KEY (`IdPublication`) REFERENCES `Publications` (`IdPublication`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. MembresBDE
CREATE TABLE IF NOT EXISTS `MembresBDE` (
  `id_utilisateur` int(11) NOT NULL,
  `id_ecole` int(11) NOT NULL,
  `status` enum('pending','verified') NOT NULL DEFAULT 'pending',
  `date_fin` date DEFAULT NULL,
  `is_actif` tinyint(1) NOT NULL DEFAULT 1,
  KEY `MembresBDE_ibfk_1` (`id_utilisateur`),
  KEY `MembresBDE_ibfk_2` (`id_ecole`),
  CONSTRAINT `MembresBDE_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`) ON DELETE CASCADE,
  CONSTRAINT `MembresBDE_ibfk_2` FOREIGN KEY (`id_ecole`) REFERENCES `Ecoles` (`id_ecole`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Messages
CREATE TABLE IF NOT EXISTS `Messages` (
  `idMessage` int(11) NOT NULL AUTO_INCREMENT,
  `contenu` text DEFAULT NULL,
  `date_envoi` datetime DEFAULT current_timestamp(),
  `idUtilisateur` int(11) NOT NULL,
  `idDiscussion` int(11) NOT NULL,
  PRIMARY KEY (`idMessage`),
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `idDiscussion` (`idDiscussion`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`) ON DELETE CASCADE,
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`idDiscussion`) REFERENCES `Discussions` (`idDiscussion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Moderations
CREATE TABLE IF NOT EXISTS `Moderations` (
  `idModeration` int(11) NOT NULL AUTO_INCREMENT,
  `type_action` varchar(50) DEFAULT NULL,
  `date_action` datetime DEFAULT current_timestamp(),
  `IdUtilisateur` int(11) NOT NULL,
  `IdGroupe` int(11) NOT NULL,
  PRIMARY KEY (`idModeration`),
  KEY `IdUtilisateur` (`IdUtilisateur`),
  KEY `IdGroupe` (`IdGroupe`),
  CONSTRAINT `Moderations_ibfk_1` FOREIGN KEY (`IdUtilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`),
  CONSTRAINT `Moderations_ibfk_2` FOREIGN KEY (`IdGroupe`) REFERENCES `Groupes` (`IdGroupe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Paiements
CREATE TABLE IF NOT EXISTS `Paiements` (
  `idPaiement` int(11) NOT NULL AUTO_INCREMENT,
  `montant` decimal(15,2) DEFAULT NULL,
  `date_paiement` datetime DEFAULT NULL,
  `justificatif` varchar(255) DEFAULT NULL,
  `IdUtilisateur` int(11) NOT NULL,
  PRIMARY KEY (`idPaiement`),
  KEY `IdUtilisateur` (`IdUtilisateur`),
  CONSTRAINT `Paiements_ibfk_1` FOREIGN KEY (`IdUtilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Participation
CREATE TABLE IF NOT EXISTS `Participation` (
  `idParticipation` int(11) NOT NULL AUTO_INCREMENT,
  `IdUtilisateur` int(11) NOT NULL,
  `IdGroupe` int(11) NOT NULL,
  `PaiementEffectue` tinyint(1) DEFAULT 0,
  `IdPaiement` int(11) DEFAULT NULL,
  `Organisateur` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`idParticipation`),
  UNIQUE KEY `UNIQUE_User_Groupe` (`IdUtilisateur`,`IdGroupe`),
  KEY `IdGroupe` (`IdGroupe`),
  KEY `IdPaiement` (`IdPaiement`),
  CONSTRAINT `Participation_ibfk_1` FOREIGN KEY (`IdUtilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`),
  CONSTRAINT `Participation_ibfk_2` FOREIGN KEY (`IdGroupe`) REFERENCES `Groupes` (`IdGroupe`),
  CONSTRAINT `Participation_ibfk_3` FOREIGN KEY (`IdPaiement`) REFERENCES `Paiements` (`idPaiement`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Publications
CREATE TABLE IF NOT EXISTS `Publications` (
  `IdPublication` int(11) NOT NULL AUTO_INCREMENT,
  `CodePostal` varchar(100) NOT NULL,
  `rue` varchar(100) NOT NULL,
  `Ville` varchar(100) NOT NULL,
  `Titre` varchar(50) NOT NULL,
  `DateEvenement` datetime NOT NULL,
  `Description` text NOT NULL,
  `Prix` decimal(15,2) DEFAULT NULL,
  `Lien` varchar(50) DEFAULT NULL,
  `DateCreation` datetime DEFAULT current_timestamp(),
  `ParticipantMax` smallint(6) DEFAULT NULL,
  `ParticipantMin` smallint(6) DEFAULT NULL,
  `TypePost` enum('Evenement','activité') NOT NULL,
  `IdUtilisateur` int(11) NOT NULL,
  `PlaceHandicape` tinyint(1) DEFAULT NULL,
  `Rampe` tinyint(1) DEFAULT NULL,
  `Ascenseur` tinyint(1) DEFAULT NULL,
  `Image` longblob DEFAULT NULL,
  `ImageMimeType` varchar(100) DEFAULT NULL,
  `id_ecole` int(11) DEFAULT NULL,
  `DateFinEvenement` datetime DEFAULT NULL,
  PRIMARY KEY (`IdPublication`),
  KEY `IdUtilisateur` (`IdUtilisateur`),
  KEY `Publications_ibfk_2` (`id_ecole`),
  CONSTRAINT `Publications_ibfk_1` FOREIGN KEY (`IdUtilisateur`) REFERENCES `Utilisateurs` (`IdUtilisateur`) ON DELETE CASCADE,
  CONSTRAINT `Publications_ibfk_2` FOREIGN KEY (`id_ecole`) REFERENCES `Ecoles` (`id_ecole`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Publication_Categories
CREATE TABLE IF NOT EXISTS `Publication_Categories` (
  `IdPublication` int(11) NOT NULL,
  `IdCategorie` int(11) NOT NULL,
  PRIMARY KEY (`IdPublication`,`IdCategorie`),
  KEY `Publication_Categories_ibfk_2` (`IdCategorie`),
  CONSTRAINT `Publication_Categories_ibfk_1` FOREIGN KEY (`IdPublication`) REFERENCES `Publications` (`IdPublication`),
  CONSTRAINT `Publication_Categories_ibfk_2` FOREIGN KEY (`IdCategorie`) REFERENCES `Categories` (`IdCategorie`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de table ambiance-bdd_ensitech. Utilisateurs
CREATE TABLE IF NOT EXISTS `Utilisateurs` (
  `IdUtilisateur` int(11) NOT NULL AUTO_INCREMENT,
  `Prenom` varchar(50) NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `Pseudo` varchar(50) NOT NULL,
  `DateDeNaissance` date NOT NULL,
  `Genre` enum('Homme','Femme','Autre') NOT NULL,
  `Mail` varchar(100) NOT NULL,
  `MotDePasse` varchar(155) NOT NULL,
  `Pays` varchar(50) NOT NULL,
  `Role` enum('Utilisateur','Administrateur') NOT NULL,
  `Telephone` varchar(50) NOT NULL,
  `id_ecole` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdUtilisateur`),
  UNIQUE KEY `Mail` (`Mail`),
  KEY `Utilisateurs_ibfk_1` (`id_ecole`),
  CONSTRAINT `Utilisateurs_ibfk_1` FOREIGN KEY (`id_ecole`) REFERENCES `Ecoles` (`id_ecole`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
