---
title: "Installing ELB command line tools on OSX / Linux"
description: "The ELB command line tools are pretty nice, and they are actually required to get a lot of important information which is unfortunately missing from the AWS ELB"
pubDate: 'Jan 31, 2012'
tags: ['general']
---
The ELB command line tools are pretty nice, and they are actually required to get a lot of important information which is unfortunately missing from the AWS ELB UI. Installation is actually quite simple, first go ahead and download the zip from here, and then just go ahead and do the following:

```ruby

wget http://ec2-downloads.s3.amazonaws.com/ElasticLoadBalancing.zip
unzip ElasticLoadBalancing.zip -d ~/bin
echo "EXPORT ~/bin/`ls ~/bin | grep Elastic`" >> ~/.bash_profile
source ~/.bash_profile
```


Then boom, magic

```bash

10:50:24 jdyer@aleph.local Downloads elb-describe-lbs -h                                                                                                                                                                    127 ↵

SYNOPSIS
   elb-describe-lbs
       [LoadBalancerNames [LoadBalancerNames ...] ]  [General Options]

DESCRIPTION
       Describes the state and properties of LoadBalancers
```

Hope that helps!
