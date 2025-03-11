pipeline {
  agent any
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

echo "Utilisateur actuel : $(whoami)"
echo "Environnement PATH : $PATH"

# V�rifier la version actuelle de Node.js
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
        sh 'rm -rf $BACK_DIR/* && cp -r ambiance-back/dist/* $BACK_DIR/'
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
pm2 start main.js --name nestjs
fi
pm2 save
'''
        }

      }
    }

  }
  environment {
    NODE_VERSION = '22.11.0'
    NPM_VERSION = '10.8.3'
    FRONT_DIR = '/var/www/AM-FRONT'
    BACK_DIR = '/var/www/AM-BACK'
  }
}