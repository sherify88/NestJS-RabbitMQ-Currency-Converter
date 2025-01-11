#!/bin/bash

docker push .dkr.ecr.eu-central-1.amazonaws.com/convertify:${CI_COMMIT_SHA}