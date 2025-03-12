pipeline {
    agent any
    environment {
        NODE_VERSION = '22.11.0'
        NPM_VERSION = '10.8.3'
        FRONT_DIR = '/var/www/AM-FRONT'
        BACK_DIR = '/var/www/AM-BACK'
        
        // Injecter les credentials
        DATABASE_HOST = credentials('DATABASE_HOST')
        DATABASE_PORT = credentials('DATABASE_PORT')
        DATABASE_USER = credentials('DATABASE_USER')
        DATABASE_PASSWORD = credentials('DATABASE_PASSWORD')
        DATABASE_NAME = credentials('DATABASE_NAME')
    }
    stages {
        stage('Checkout') {
            steps {
                git(branch: 'develop', url: 'git@github.com:Reednar/ambiance.git')
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    sh '''
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
echo "Node.js version : $(node -v)"
echo "npm version : $(npm -v)"
'''
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
                sh 'cd ambiance-front && npm run build --omit=dev'
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
                script {
                    sh '''
rm -rf $BACK_DIR/*
cp -r ambiance-back/dist/* $BACK_DIR/
cp ambiance-back/package*.json $BACK_DIR/
'''
                }
            }
        }

        stage('Install Dependencies in BACK_DIR') {
            steps {
                script {
                    sh '''
cd $BACK_DIR
npm install --omit=dev
'''
                }
            }
        }

        stage('Inject .env') {
            steps {
                script {
                    sh '''
echo "PORT=$PORT" >> $BACK_DIR/.env
echo "DATABASE_HOST=$DATABASE_HOST" >> $BACK_DIR/.env
echo "DATABASE_PORT=$DATABASE_PORT" >> $BACK_DIR/.env
echo "DATABASE_USER=$DATABASE_USER" >> $BACK_DIR/.env
echo "DATABASE_PASSWORD=$DATABASE_PASSWORD" >> $BACK_DIR/.env
echo "DATABASE_NAME=$DATABASE_NAME" >> $BACK_DIR/.env
'''
                }
            }
        }

        stage('Restart NestJS') {
            steps {
                script {
                    sh '''
cd $BACK_DIR
if pm2 describe nestjs > /dev/null; then
    pm2 restart nestjs --update-env --cwd $BACK_DIR
else
    pm2 start main.js --name nestjs --cwd $BACK_DIR --interpreter $(which node)
fi
pm2 save
'''
                }
            }
        }
    }
}
