echo "Stack Name: "
read STACK_NAME
echo "Asset Bucket Name: "
read BUCKET_NAME
echo "Slack signing key: "
read SIGNING_KEY
echo "Slack OAUTH token: "
read OAUTH_TOKEN

aws.cmd cloudformation package --template ./template.json --s3-bucket $BUCKET_NAME --use-json --output-template-file packaged-template.json
aws.cmd cloudformation deploy --template-file ./packaged-template.json --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --parameter-overrides SigningSecret=$SIGNING_KEY OAUTHToken=$OAUTH_TOKEN
aws.cmd cloudformation describe-stacks --stack-name $STACK_NAME --query Stacks[0].Outputs[0].OutputValue