pipeline {
    agent any

    environment {
        DOCKER_USERNAME = "saiganesh74"
        BACKEND_IMAGE = "mern-backend"
        FRONTEND_IMAGE = "mern-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Workspace') {
            steps {
                sh '''
                    pwd
                    ls -la
                '''
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    node -v
                    npm -v
                    docker --version
                    git --version
                    trivy --version
                '''
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend Audit') {
            steps {
                dir('backend') {
                    sh 'npm audit --audit-level=critical'
                }
            }
        }

        stage('Frontend Audit') {
            steps {
                dir('frontend') {
                    sh 'npm audit --audit-level=critical'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh '''
                        docker build \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh '''
                        docker build \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    trivy fs \
                    --severity HIGH,CRITICAL \
                    .
                '''
            }
        }

        stage('Trivy Backend Image Scan') {
            steps {
                sh '''
                    trivy image \
                    --severity CRITICAL \
                    --exit-code 1 \
                    ${BACKEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Trivy Frontend Image Scan') {
            steps {
                sh '''
                    trivy image \
                    --severity CRITICAL \
                    --exit-code 1 \
                    ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Docker Hub Login & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'docker_user',
                        passwordVariable: 'docker_pass'
                    )
                ]) {

                    sh '''
                        echo "$docker_pass" | docker login \
                        -u "$docker_user" \
                        --password-stdin

                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        ${DOCKER_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG}

                        docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}

                        docker push ${DOCKER_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG}

                        docker push ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}

                        docker logout
                    '''
                }
            }
        }
    }
}