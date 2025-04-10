if (env.CHANGE_ID) {
    echo "Pull Request détectée, chargement de Jenkinsfile.sonar"
    load 'Jenkinsfile.sonar'
} else if (env.BRANCH_NAME == 'develop') {
    echo "Branche develop détectée, chargement de Jenkinsfile.deploy"
    load 'Jenkinsfile.deploy'
} else {
    echo "Aucun Jenkinsfile à exécuter pour la branche ${env.BRANCH_NAME}"
}
