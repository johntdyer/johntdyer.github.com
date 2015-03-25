---
layout: post
title: Get a quick list of all AWS instances using JQ and AWS Cli
categories: [cool]
tags: [aws,cli]
published: True

---

Today I needed to get a quick list of all my AWS instances, and rather then try to copy and paste from the aweful AWS web UI I figured I would go the manly route and do this using the CLI tools.

It turned out this was actually pretty easy using [JQ](stedolan.github.io/jq/) and the [AWS Cli](http://aws.amazon.com/cli/), both of which can be installed via Homebrew:

{% highlight bash %}
brew install jq
brew install awscli
{% endhighlight %}

Once you have it installed and configured the following will give you a list of all instances with have a `Name` tag.

{% highlight bash %}
 aws ec2 describe-instances | jq -r '.Reservations[].Instances[].Tags[] | select ( .Key | contains("Name") ) | .Value'
{% endhighlight %}


If you wanted to drill down a little further you could add another qualifier and show only instances with a state of `running`.

{% highlight bash %}
aws ec2 describe-instances | jq -r '.Reservations[].Instances[]| select ( .State.Name | contains("running")) | .Tags[] | select ( .Key | contains("Name") ) | .Value'
{% endhighlight %}

Hope thats helpful !
