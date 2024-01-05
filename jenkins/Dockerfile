# Use the official Jenkins image
FROM jenkins/jenkins:lts

# If you need to install additional tools, do so here
# For example, to install Docker CLI:
USER root
RUN apt-get update && \
    apt-get install -y apt-transport-https \
                       ca-certificates \
                       curl \
                       gnupg2 \
                       software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    apt-key fingerprint 0EBFCD88 && \
    add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/debian \
       $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce-cli
USER jenkins

# Set up Jenkins home
ENV JENKINS_HOME /var/jenkins_home
VOLUME /var/jenkins_home
