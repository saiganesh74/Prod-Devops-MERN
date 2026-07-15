pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Verify Workspace') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }
        stage('Verify Tools'){
            steps{
                sh '''
                    node -v
                    npm -v
                    docker --version
                    git --version
                '''
            }
        }
        stage('Install backend Dependencies'){
            steps{
                dir('backend'){
                    sh 'npm ci'
                }
            }
        }
        stage('Install Frontend Dependencies'){
            steps{
                dir('frontend'){
                    sh 'npm ci'
                }
            }
        }

        stage('Backend - Audit'){
            steps{
                dir('backend'){
                    sh 'npm audit --audit-level=critical'
                }
            }
        }

        stage('Frontend - Audit'){
            steps{
                dir('frontend'){
                    sh 'npm audit --audit-level=critical'
                }
            }
        }

        stage('Build frontend'){
            steps{
                dir('frontend'){
                    sh 'npm run build'
                }
            }
        }

        stage('Docker backend image '){
            steps{
                dir('backend'){
                    sh 'docker build -t mern-backend:${BUILD_NUMBER}  .'
                }
            }
        }

        stage('Docker Frontend image '){
            steps{
                dir('frontend'){
                    sh 'docker build -t mern-frontend:v1'
                }
            }
        }

    }
}