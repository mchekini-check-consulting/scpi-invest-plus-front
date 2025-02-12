node("ci-node") {

  def GIT_COMMIT_HASH = ""
  stage("Checkout") {
    checkout scm
    GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
  }

  stage("Build") {
    sh "npm install"
    sh "npm run build"
  }

  stage("Build docker image") {
    sh "sudo docker build -t mchekini/scpi-invest-plus-front:$GIT_COMMIT_HASH ."
  }

  stage("Push Docker Imgae") {
    withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
      sh "sudo docker login -u $username -p $password"
      sh "sudo docker push mchekini/scpi-invest-plus-front:$GIT_COMMIT_HASH"
      sh "sudo docker rmi mchekini/scpi-invest-plus-front:$GIT_COMMIT_HASH"
    }
  }


}
