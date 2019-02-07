aws.cmd cloudformation delete-stack --stack-name $1
aws.cmd cloudformation wait stack-delete-complete --stack-name $1