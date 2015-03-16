---
layout: post
title: "Using Nagios to monitor Tropo"
date: 2012-04-20 22:34
comments: true
categories: [Nagios, Tropo]
---

So I will start by saying that Tropo maintains a very redundant, and fault tollerent network, however we do understand that people still need to do their due dilligance and implement monitoring just to be safe. So yesterday we had a developer that wanted do just this, they wanted to monitor Tropo’s SBC’s to ensure they were responding to requests as expected. The only problem here is that Tropo’s SBC’s don’t implelment OPTIONS and all the plugins for Nagios seem to use OPTIONS in their tests, however one seems to allow you to specify the response code for a passing test. This plugin is the [NagiosSIP plugin](http://dev.sipdoc.net/projects/sip-stuff/wiki/NagiosSIPplugin), and via the -c ( SIP_CODE) flag we can set a 501 ( SIP/501 Not Implemented) as a passing test, since a 501 would signify a responding SBC. Check out below for an example of just what I mean:

{% highlight bash %}
10:51:28 jdyer@aleph.local ./nagios_sip_plugin.rb -s sip.tropo.com -c 501
OK:status code = 501
{% endhighlight %}

We can also see the exit code is 0, which would be a pass

{% highlight bash %}
10:51:33 jdyer@aleph.local echo $?
0
{% endhighlight %}

Sure hope someone finds this helpful!

-John
