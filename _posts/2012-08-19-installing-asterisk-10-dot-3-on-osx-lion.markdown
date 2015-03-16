---
layout: post
title: "Installing Asterisk 10.3 on OSX Lion"
date: 2012-04-14 22:31
comments: true
categories: [Asterisk, OSX]
---

So I had a need to install Asterisk the other day on my laptop and doing the atypical:

{% highlight bash %}
./configure
make
make install
{% endhighlight %}

Gave me a whole bunch of suck

{% highlight bash %}
snmp/agent.c: In function ‘init_asterisk_mib’:
snmp/agent.c:835: error: ‘RONLY’ undeclared (first use in this function)
snmp/agent.c:835: error: (Each undeclared identifier is reported only once
snmp/agent.c:835: error: for each function it appears in.)
make[1]: *** [snmp/agent.o] Error 1
make[1]: *** Waiting for unfinished jobs....
   [LD] chan_unistim.o -> chan_unistim.so
make: *** [res] Error 2
{% endhighlight %}

Little bit of digging led to a bunch of solution thats didn’t seem to work, but after a little bit of trail and error I found a quick, and working solution, which I figured I would share

{% highlight bash %}
./configure --host=x86_64-darwin
make menuselect ( remove res_snmp under Resource Modules )
sudo make -j 4
sudo make install
sudo make samples
{% endhighlight %}

Worked for me, and I hope it helps someone else!

-John
