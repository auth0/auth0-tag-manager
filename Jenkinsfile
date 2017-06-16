pipeline {
    agent any
    tools { nodejs 'node-v6.10.3' }
    environment {
        NODE_ENV = 'production'
    }
    stages {
        stage('Checkout') {
          steps {
            checkout scm
          }
        }

        stage('Installing dependencies') {
            steps {
                sh 'yarn install --production=false'
            }
        }

        stage('Build') {
            steps {
                sh 'tools/scripts/build.sh'
            }
        }

        stage('Publish to NPM') {
            steps {
                sh 'tools/scripts/npm.sh'
            }
        } 
    }

    post {
      // Always runs. And it runs before any of the other post conditions.
      always {
        // Let's wipe out the workspace before we finish!        
        deleteDir()
      }
      
      success {
        slackSend channel: '#crew-solutions-build',
                  color: 'good',
                  message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."
      }

      failure {
        slackSend channel: '#crew-solutions-build',
                  color: 'danger',
                  message: "The pipeline ${currentBuild.fullDisplayName} has failed."

      }
    }

    // The options directive is for configuration that applies to the whole job.
    options {
      // For example, we'd like to make sure we only keep 10 builds at a time, so
      // we don't fill up our storage!
      buildDiscarder(logRotator(numToKeepStr:'10'))
      
      // And we'd really like to be sure that this build doesn't hang forever, so
      // let's time it out after an hour.
      timeout(time: 30, unit: 'MINUTES')
    }
}
