pipeline {
    agent any

    stages {
        stage('Init') {
            steps {
                script {
                    echo "Initialisation : checkout du code source"
                    checkout scm // Permet d'éviter les erreurs avec file not found pour les fichiers Jenkinsfile.sonar et Jenkinsfile.deploy.
                }
            }
        }

        stage('Load Pipeline') {
            steps {
                script {
                    if (env.CHANGE_ID) {
                        echo "Pull Request détectée, chargement de Jenkinsfile.sonar"
                        if (fileExists('Jenkinsfile.sonar')) {
                            load 'Jenkinsfile.sonar'
                        } else {
                            error "Fichier Jenkinsfile.sonar introuvable"
                        }
                    } else if (env.BRANCH_NAME == 'develop') {
                        echo "Branche develop détectée, chargement de Jenkinsfile.deploy"
                        if (fileExists('Jenkinsfile.deploy')) {
                            load 'Jenkinsfile.deploy'
                        } else {
                            error "Fichier Jenkinsfile.deploy introuvable"
                        }
                    } else {
                        echo "Aucun Jenkinsfile à exécuter pour la branche ${env.BRANCH_NAME}"
                    }
                }
            }
        }
    }
}
