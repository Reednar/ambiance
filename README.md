# Ambiance
## Environnement
- Windows
## Prérequis
- Version de node : v22.11.0
- Version de npm : v10.8.3
## Prérequis optionnel (logger)
- Grafana
- Loki
- Promtail
## Installation de NestJS
```bash
npm i -g @nestjs/cli
```
[NestJS](https://docs.nestjs.com)

## Installation de Angular
```bash
npm i -g @angular/cli
```
[Angular](https://angular.dev/)

## Lancement du backend
- Se déplacer dans le dossier ambiance-back
```bash
cd ambiance-back
```
- Installer les packages avec npm
```bash
npm install
```
ou
```bash
npm update
```
- Lancer le serveur back avec l'environnement de dev
```bash
npm run start:dev
```
## Lancement du frontend
- Se déplacer dans le dossier ambiance-front
```bash
cd ../ambiance-front
```
- Installer les packages avec npm
```bash
npm install
```
ou
```bash
npm update
```
- Lancer le serveur front avec l'environnement de dev
```bash
npm run start
```
## Téléchargement de Grafana (exécuter)
[Téléchargement](https://dl.grafana.com/enterprise/release/grafana-enterprise-11.3.0.windows-amd64.msi)
## Téléchargement de Loki (ne pas exécuter)
[Téléchargement](https://github.com/grafana/loki/releases/download/v3.2.1/loki-windows-amd64.exe.zip)
## Téléchargement de Promtail (ne pas exécuter)
[Téléchargement](https://github.com/grafana/loki/releases/download/v3.2.1/promtail-windows-amd64.exe.zip)

## Paramétrage de Grafana
- Ouvrir le dossier suivant : C:\Program Files\GrafanaLabs\grafana\conf
- Faire une copie du fichier "sample.ini" et appeler le fichier "custom.ini" (les semilicons ";" permettent de commenter une ligne)
- Modifier le fichier "custom.ini", trouver le port par défault et mettre la valeur "5000" (retirer le ";")
- Se déplacer dans le dossier : C:\Program Files\GrafanaLabs\grafana\bin
- Exécuter le fichier "grafana-server" en tant qu'administrateur
- Accéder à l'url suivante : http://localhost:5000
- Les identifiants par défault sont les suivants : 
```bash
admin
```
```bash
admin (le mot de passe devra être modifié par la suite)
```
## Paramétrage de Loki
- Créer un dossier nommé "Loki" est y mettre le contenu du dossier compressé : loki-windows-amd64.exe.zip
- Avoir un fichier de config appelé : "loki-config.yaml" (fourni par le devops)
- Ouvrir une invite de commande et se placer dans le dossier "Loki"
- Exécuter la commande suivante :
```bash
.\loki-windows-amd64.exe --config.file=loki-config.yaml
```

## Paramétrage de Promtail
- Créer un dossier nommé "Promtail" est y mettre le contenu du dossier compressé : promtail-windows-amd64.exe.zip
- Avoir un fichier de config appelé : "promtail-config.yaml" (fourni par le devops)
- Ouvrir une invite de commande et se placer dans le dossier "Promtail"
- Exécuter la commande suivante :
```bash
.\promtail-windows-amd64.exe --config.file=promtail-config.yaml
```