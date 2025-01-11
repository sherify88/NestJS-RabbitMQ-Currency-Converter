#!/bin/bash

docker build -t .dkr.ecr.eu-central-1.amazonaws.com/convertify:${CI_COMMIT_SHA} .