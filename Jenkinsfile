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
                git(branch: 'build/jenkins', url: 'git@github.com:Reednar/ambiance.git')
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

        stage('Debug BACK_DIR') {
            steps {
                script {
                    sh '''
echo "Contenu de $BACK_DIR :"
ls -lah $BACK_DIR
echo "Vérification de node_modules :"
ls -lah $BACK_DIR/node_modules/@nestjs/core || echo "node_modules manquant!"
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
    pm2 restart nestjs
else
    pm2 start dist/main.js --name nestjs --interpreter $(which node)
fi
pm2 save
'''
                }
            }
        }
    }
}
