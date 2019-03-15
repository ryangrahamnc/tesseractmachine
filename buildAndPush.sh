#!/usr/bin/env bash

export ME=ryangrahamnc
export NAME=tesseractmachine

export BUILD_TIME=`date '+%Y-%m-%d %H:%M:%S'`

echo "\n\nBUILDING\n"
docker build --build-arg BUILD_TIME="$BUILD_TIME" -t $ME/$NAME .

echo "\n\nPUSHING\n"
docker push $ME/$NAME

echo "\n\nPUSHED\n"
