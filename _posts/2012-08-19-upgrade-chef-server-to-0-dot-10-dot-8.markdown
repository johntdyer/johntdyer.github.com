---
layout: post
title: "Upgrade Chef server to 0.10.8"
date: 2011-12-18 22:10
comments: true
categories: [Chef]
---

Upgrading to Chef Server ( 0.10.8 ) is dead simple, takes probably 30 seconds.

{% highlight bash %}
for s in server server-webui solr expander; do sudo /etc/init.d/chef-${s} stop; done
sudo gem update chef chef-server --no-ri --no-rdoc
for s in server server-webui solr expander; do sudo /etc/init.d/chef-${s} start; done
{% endhighlight %}

If you want you can backup the server first using Seth’s backup script ( here ). Installing, and running it, is dead simple:

{% highlight bash %}
curl -O https://raw.github.com/jtimberman/knife-scripts/master/chef_server_backup.rb
knife exec chef_server_backup.rb
{% endhighlight %}

This will create a backup fo the server in your .chef dir. Enjoy
