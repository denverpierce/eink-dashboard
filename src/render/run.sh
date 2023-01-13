#!/bin/bash
rm -f ./logs/info.log
rm -f ./log/error.log
npm run start > ./logs/info.log 2> ./logs/error.log
