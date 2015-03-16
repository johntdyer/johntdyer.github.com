---
layout: post
title: Keep Route53 Health check source IP's up to date
description: "Using AWS Cli & JQ to ensure your route53 health check security groups are always up to date"
categories: [aws]
tags: [aws,route53,amazon,health]
published: True

---

We wanted to add Route53 health checks for some of our DNS end points but the list of origin IP's for these checks is not guaranteed.  This being the case we put together a small script to keep them up to date.

## Depedencies

* JQ - [jq](http://stedolan.github.io/jq/) is like sed for JSON data
* AWS CLI - [Aws](http://aws.amazon.com/cli/) AWS Command Line Interface (CLI)

## Example

{% highlight bash %}
GROUPID=sg-abc123456
PORTS="5060 5671"

for h in `aws route53 get-checker-ip-ranges | jq -r '.CheckerIpRanges[]'`; do

  for port in `echo $PORTS`; do
    printf "Adding ${h}:$port "
    aws ec2 authorize-security-group-ingress --group-id $GROUPID --protocol tcp --port $port --cidr $h 2&>1
    EXIT_CODE=$?
    if [[ $EXIT_CODE -eq 0 ]]; then
      echo " - Added"
    elif [[ $EXIT_CODE -eq 255 ]]; then
      echo " - Already present"
    else
      echo "Error"
      echo "---> $EXIT_CODE"
    fi
  done
done

{% endhighlight %}

