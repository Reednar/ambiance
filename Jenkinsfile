pipeline {
    agent any

    environment {
        NODE_VERSION = '22.11.0'
        NPM_VERSION = '10.8.3'
        FRONT_DIR = '/var/www/AM-FRONT'
        BACK_DIR = '/var/www/AM-BACK'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'build/jenkins', url: 'git@github.com:Reednar/ambiance.git'
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    // Vérifier si Node.js est installé
                    sh 'if ! command -v node &> /dev/null; then echo "Node.js non installé !" && exit 1; fi'
                    // Vérifier si npm est installé
                    sh 'if ! command -v npm &> /dev/null; then echo "npm non installé !" && exit 1; fi'
                    
                    // Vérifier et installer @nestjs/cli si non présent
                    sh 'if ! command -v nest &> /dev/null; then sudo npm install -g @nestjs/cli; fi'
                    // Vérifier et installer @angular/cli si non présent
                    sh 'if ! command -v ng &> /dev/null; then sudo npm install -g @angular/cli; fi'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'cd ambiance-front && npm install'
                    sh 'cd ambiance-back && npm install'
                }
            }
        }

        stage('Build Angular') {
            steps {
                sh 'cd ambiance-front && npm run build --prod'
            }
        }

        stage('Build NestJS') {
            steps {
                sh 'cd ambiance-back && npm run build'
            }
        }

        stage('Deploy Angular') {
            steps {
                sh 'rm -rf $FRONT_DIR/* && cp -r ambiance-front/dist/* $FRONT_DIR/'
            }
        }

        stage('Deploy NestJS') {
            steps {
                sh 'rm -rf $BACK_DIR/* && cp -r ambiance-back/dist/* $BACK_DIR/'
            }
        }

        stage('Restart Services') {
            steps {
                sh 'sudo systemctl restart nestjs'
                sh 'sudo systemctl restart nginx'
            }
        }
    }
}
