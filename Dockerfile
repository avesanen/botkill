FROM ubuntu

RUN apt-get update -q

RUN DEBIAN_FRONTEND=noninteractive apt-get install -qy build-essential curl git

RUN curl -s https://storage.googleapis.com/golang/go1.3.src.tar.gz | tar -v -C /usr/local -xz

RUN cd /usr/local/go/src && ./make.bash --no-clean 2>&1

ENV PATH /usr/local/go/bin:$PATH

RUN mkdir /botkill

ADD src /botkill/src

ADD www /botkill/www

ADD build.sh /botkill/

ADD test.sh /botkill/

WORKDIR /botkill/

RUN ./build.sh

CMD ./bin/botkill
