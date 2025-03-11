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
set -e  # Arrêter le script en cas d'erreur

# Charger NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Vérifier si NVM est bien chargé
if ! command -v nvm > /dev/null; then
echo "❌ ERREUR: NVM n'est pas chargé !"
exit 1
fi

# Installer et utiliser la bonne version de Node.js
nvm install $NODE_VERSION
nvm use $NODE_VERSION
nvm alias default $NODE_VERSION

# Vérifier Node.js et npm
echo "✅ Utilisateur actuel : $(whoami)"
echo "✅ Environnement PATH : $PATH"
echo "✅ Node.js version : $(node -v)"
echo "✅ npm version : $(npm -v)"
'''
        }

      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          sh '''
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use $NODE_VERSION

echo "📦 Installation des dépendances..."
cd ambiance-front && npm install --legacy-peer-deps
cd ../ambiance-back && npm install --legacy-peer-deps
'''
        }

      }
    }

    stage('Build Angular') {
      steps {
        script {
          sh '''
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use $NODE_VERSION

echo "🛠️ Build Angular..."
cd ambiance-front && npm run build --prod
'''
        }

      }
    }

    stage('Build NestJS') {
      steps {
        script {
          sh '''
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use $NODE_VERSION

echo "🛠️ Build NestJS..."
cd ambiance-back && npm run build
'''
        }

      }
    }

    stage('Deploy Angular') {
      steps {
        script {
          sh '''
set -e
echo "🚀 Déploiement Angular..."
rm -rf $FRONT_DIR/*
cp -r ambiance-front/dist/* $FRONT_DIR/
'''
        }

      }
    }

    stage('Deploy NestJS') {
      steps {
        script {
          sh '''
set -e
echo "🚀 Déploiement NestJS..."
rm -rf $BACK_DIR/*
cp -r ambiance-back/dist/* $BACK_DIR/
'''
        }

      }
    }

    stage('Restart Services') {
      steps {
        script {
          sh '''
set -e
echo "🔄 Redémarrage des services..."
sudo -u ubuntu systemctl restart nestjs
sudo -u ubuntu systemctl restart nginx
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
    USER = 'ubuntu'
  }
}